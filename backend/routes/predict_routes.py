from flask import Blueprint, request, jsonify
import pandas as pd
from collections import defaultdict, deque
from database import alerts_collection
from datetime import datetime
from models.model import predict_alert, FEATURE_COLS, WINDOW
import joblib
import io

predict_bp = Blueprint("predict_bp", __name__)

metadata = joblib.load("models/gruae_metadata_v2.pkl")
RE_TH = metadata["recon_threshold"]
PF_IDX = metadata["pf_index"]

# Rolling buffer per substation
substation_buffers = defaultdict(lambda: deque(maxlen=WINDOW))

# UI → Model mapping
UI_TO_MODEL_MAP = {
    "active_power": "Active Power Total",
    "apparent_power": "Apparent Power Total",
    "reactive_power": "Reactive Power Total",
    "power_factor": "Power Factor Total",
    "current_a": "Current A",
    "current_b": "Current B",
    "current_c": "Current C",
    "current_avg": "Current Avg",
    "voltage_ab": "Voltage A-B",
    "voltage_bc": "Voltage B-C",
    "voltage_ca": "Voltage C-A",
    "voltage_ll_avg": "Voltage L-L Avg",
    "frequency": "Frequency",
    "thd_current_a": "THD Current A",
    "thd_current_b": "THD Current B",
    "thd_current_c": "THD Current C",
    "thd_voltage_ab": "THD Voltage A-B",
    "thd_voltage_bc": "THD Voltage B-C",
    "thd_voltage_ca": "THD Voltage C-A"
}


# SINGLE SUBSTATION PREDICTION (REAL-TIME)
@predict_bp.route("/predict-alert", methods=["POST"])
def predict_alert_api():

    data = request.get_json()

    if not isinstance(data, dict):
        return jsonify({"error": "JSON body must be an object"}), 400
    if "id" not in data:
        return jsonify({"error": "Missing 'id' field"}), 400
    if "payload" not in data:
        return jsonify({"error": "Missing 'payload' field"}), 400

    substation_id = data["id"]
    payload = data["payload"]

    # Validate features
    missing = [f for f in FEATURE_COLS if f not in payload]
    if missing:
        return jsonify({
            "error": "Missing features",
            "missing": missing
        }), 400

    row_df = pd.DataFrame([payload], columns=FEATURE_COLS)

# [this is temporrary for demo] PREFILL BUFFER (FOR DASHBOARD DEMO) --------------------
    if len(substation_buffers[substation_id]) == 0:
        for _ in range(WINDOW - 1):
            substation_buffers[substation_id].append(row_df.iloc[0])

# Append current reading
    substation_buffers[substation_id].append(row_df.iloc[0])


    current_len = len(substation_buffers[substation_id])

    if current_len < WINDOW:
        return jsonify({
            "status": "INSUFFICIENT_DATA",
            "received": current_len,
            "required": WINDOW,
            "anomalyScore": None
        })

    window_df = pd.DataFrame(list(substation_buffers[substation_id]))

    # -------------------- MODEL PREDICTION --------------------
    _, recon_error = predict_alert(window_df)

    # -------------------- SCORE NORMALIZATION --------------------
    normalized_score = recon_error / (RE_TH * 3)


    # -------------------- DOMAIN LOGIC --------------------
    pf = payload["Power Factor Total"]
    PF_REF = 0.95

    loss = (1 / (pf ** 2)) - (1 / (PF_REF ** 2))

    is_anomaly = recon_error > RE_TH
    pf_bad = pf < 0.8
    loss_high = loss > 0.5

    final_event = is_anomaly and pf_bad and loss_high

    # -------------------- SEVERITY MAPPING --------------------
    if recon_error >= 9.6:
        severity = "CRITICAL"
    elif recon_error >= 9.0:
        severity = "WARNING"
    else:
        severity = "NORMAL"

# -------------------- ALERT CREATION --------------------
    if severity != "NORMAL":
        existing = alerts_collection.find_one({
            "substationId": substation_id,
            "status": {"$ne": "Resolved"}
        })

        if not existing:
            alerts_collection.insert_one({
                "substationId": substation_id,
                "substationName": data.get("name", substation_id),
                "severity": severity,
                "anomalyScore": float(normalized_score),
                "message": "AI-detected power quality anomaly",
                "status": "New",
                "createdAt": datetime.utcnow(),
                "acknowledgedAt": None,
                "resolvedAt": None
            })

# -------------------- RESPONSE TO UI --------------------
    return jsonify({
        "substation_id": substation_id,
        "status": severity,
        "anomalyScore": float(recon_error)
    })


# ------------------------------------------------------------------
# CSV BATCH TESTING (UNCHANGED)
# ------------------------------------------------------------------
@predict_bp.route("/predict-alert-csv", methods=["POST"])
def predict_alert_csv():
    if "file" not in request.files:
        return jsonify({"error": "CSV file not provided"}), 400

    file = request.files["file"]

    try:
        df = pd.read_csv(file)
    except Exception:
        return jsonify({"error": "Invalid CSV file"}), 400

    # 🔥 CHECK Date & Time columns
    if "Date" not in df.columns or "Time" not in df.columns:
        return jsonify({
            "error": "CSV must contain 'Date' and 'Time' columns",
            "available_columns": list(df.columns)
        }), 400

    # 🔥 COMBINE Date + Time into single timestamp
    df["timestamp"] = pd.to_datetime(
        df["Date"].astype(str) + " " + df["Time"].astype(str),
        errors="coerce"
    )

    # Sort by timestamp (IMPORTANT for sliding window)
    df = df.sort_values("timestamp").reset_index(drop=True)

    missing = [f for f in FEATURE_COLS if f not in df.columns]
    if missing:
        return jsonify({
            "error": "Missing features in CSV",
            "missing": missing
        }), 400

    results = []

    for i in range(len(df) - WINDOW + 1):
        window_df = df.iloc[i:i + WINDOW][FEATURE_COLS]

        window_df = window_df.apply(pd.to_numeric, errors="coerce")
        window_df = window_df.fillna(window_df.mean())

        is_alert, score = predict_alert(window_df)

        start_time = df.iloc[i]["timestamp"]
        end_time = df.iloc[i + WINDOW - 1]["timestamp"]

        results.append({
            "window_start_time": start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "window_end_time": end_time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": "ALERT" if is_alert else "NORMAL",
            "anomalyScore": float(score)
        })

    return jsonify({
        "total_windows": len(results),
        "results": results
    })
    
    
# GENERATE REPORTS OF CSV PREDICTION
from flask import make_response

@predict_bp.route("/download-report", methods=["POST"])
def download_report():
    data = request.json.get("results")

    df = pd.DataFrame(data)

    output = io.BytesIO()
    df.to_excel(output, index=False, engine='openpyxl')
    output.seek(0)

    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=Substation_Alert_Report.xlsx"
    response.headers["Content-Type"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    return response