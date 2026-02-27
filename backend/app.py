from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import pandas as pd
from datetime import datetime
from database import alerts_collection
from collections import defaultdict, deque

from routes.alert_routes import alert_routes
from routes.predict_routes import predict_bp
from data_generator import generate_substation
from models.model import (
    predict_alert,
    classify_alert_severity,
    RECON_THRESHOLD,
    WINDOW,
)

STREAM_INTERNAL_SECONDS = 20
STREAM_CALIBRATION_WINDOWS = 20

app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
)

# Initialize SocketIO
socketio = SocketIO(
    app,
    cors_allowed_origins="http://localhost:5173",
    async_mode="threading",
)

# Register routes
app.register_blueprint(alert_routes)
app.register_blueprint(predict_bp)

# Rolling buffer per substation
substation_buffers = defaultdict(lambda: deque(maxlen=WINDOW))

# Error history used only for synthetic stream calibration
error_history = defaultdict(lambda: deque(maxlen=80))


def classify_stream_severity(substation_id: int, recon_error: float) -> str:
    history = error_history[substation_id]
    history.append(float(recon_error))

    if len(history) < STREAM_CALIBRATION_WINDOWS:
        return "NORMAL"

    p80 = float(pd.Series(history).quantile(0.80))
    p95 = float(pd.Series(history).quantile(0.95))

    warning_th = max(RECON_THRESHOLD, p80)
    critical_th = max(warning_th, p95)

    if recon_error >= critical_th:
        return "CRITICAL"
    if recon_error >= warning_th:
        return "WARNING"
    return "NORMAL"


# -----------------------------
# 🔥 LIVE STREAM FUNCTION
# -----------------------------
def stream_live_data():
    print("🚀 Streaming task started")

    while True:
        try:
            print("Sending live data...")
            substations = []

            for i in range(1, 11):
                sub = generate_substation(i)
                payload = sub["payload"]

                substation_buffers[i].append(payload)

                sub["samplesCollected"] = len(substation_buffers[i])
                sub["requiredSamples"] = WINDOW

                if len(substation_buffers[i]) >= WINDOW:
                    window_df = pd.DataFrame(list(substation_buffers[i]))

                    _, recon_error = predict_alert(window_df)

                    print(f"Substation {i} → Recon Error: {recon_error}")

                    sub["anomalyScore"] = float(recon_error)

                    # Base model severity
                    sub["modelSeverity"] = classify_alert_severity(
                        float(recon_error)
                    )

                    # Stream adaptive severity
                    severity = classify_stream_severity(i, float(recon_error))
                    sub["status"] = severity

                    if severity != "NORMAL":
                        existing = alerts_collection.find_one(
                            {
                                "substationId": i,
                                "status": {"$ne": "Resolved"},
                            }
                        )

                        if not existing:
                            alerts_collection.insert_one(
                                {
                                    "substationId": i,
                                    "substationName": f"Substation {i}",
                                    "severity": severity,
                                    "anomalyScore": float(recon_error),
                                    "message": "AI-detected power quality anomaly",
                                    "status": "New",
                                    "createdAt": datetime.utcnow(),
                                    "acknowledgedAt": None,
                                    "resolvedAt": None,
                                }
                            )
                else:
                    sub["status"] = "INSUFFICIENT_DATA"
                    sub["anomalyScore"] = None

                substations.append(sub)

            # Emit to frontend
            socketio.emit("substation_data", substations)

        except Exception as exc:
            print(f"Error while streaming live data: {exc}")

        # Sleep between streaming intervals
        socketio.sleep(STREAM_INTERNAL_SECONDS)


# -----------------------------
# 🔥 RUN APP WITH SOCKETIO
# -----------------------------
if __name__ == "__main__":
    socketio.start_background_task(stream_live_data)
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)