from flask import Blueprint, request, jsonify
from datetime import datetime
from bson import ObjectId
from database import alerts_collection

alert_routes = Blueprint("alert_routes", __name__)

# ----------------------------
# CREATE ALERT
# ----------------------------
@alert_routes.route("/alerts", methods=["POST"])
def create_alert():
    data = request.json

    # Prevent duplicate active alerts for same substation
    existing = alerts_collection.find_one({
        "substationId": data["substationId"],
        "status": {"$ne": "Resolved"}
    })

    if existing:
        return jsonify({"message": "Alert already exists"}), 200

    alert = {
        "substationId": data["substationId"],
        "substationName": data["substationName"],
        "severity": data["severity"],
        "anomalyScore": data["anomalyScore"],
        "message": data.get("message", "Anomaly detected"),
        "status": "New",
        "createdAt": datetime.utcnow(),
        "acknowledgedAt": None,
        "resolvedAt": None
    }

    alerts_collection.insert_one(alert)
    return jsonify({"success": True}), 201


# ----------------------------
# GET ACTIVE ALERTS
# ----------------------------
@alert_routes.route("/alerts", methods=["GET"])
def get_active_alerts():
    alerts = alerts_collection.find(
        {"status": {"$ne": "Resolved"}}
    )

    return jsonify([
        {
            "id": str(a["_id"]),
            "substationName": a["substationName"],
            "severity": a["severity"],
            "status": a["status"],
            "score": a["anomalyScore"],
            "message": a["message"],
            "createdAt":a["createdAt"]
        } for a in alerts
    ])


# ----------------------------
# UPDATE ALERT STATUS
# ----------------------------
@alert_routes.route("/alerts/<id>", methods=["PUT"])
def update_alert(id):
    data = request.json
    status = data["status"]

    update = {"status": status}

    if status == "Acknowledged":
        update["acknowledgedAt"] = datetime.utcnow()
    elif status == "Resolved":
        update["resolvedAt"] = datetime.utcnow()

    alerts_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": update}
    )

    return jsonify({"success": True})


# ----------------------------
# ALERT HISTORY
# ----------------------------
@alert_routes.route("/alerts/history", methods=["GET"])
def alert_history():
    alerts = alerts_collection.find({"status": "Resolved"})

    return jsonify([
        {
            "id": str(a["_id"]),
            "substationName": a["substationName"],
            "severity": a["severity"],
            "resolvedAt": a["resolvedAt"],
            "score": a["anomalyScore"]
        } for a in alerts
    ])


# ----------------------------
# ALERT SUMMARY (FOR DASHBOARD)
# ----------------------------
@alert_routes.route("/alerts/summary", methods=["GET"])
def alert_summary():
    pipeline = [
        {"$match": {"status": {"$ne": "Resolved"}}},
        {"$group": {
            "_id": "$severity",
            "count": {"$sum": 1}
        }}
    ]

    data = list(alerts_collection.aggregate(pipeline))

    summary = {
        "active": 0,
        "critical": 0,
        "warning": 0
    }

    for d in data:
        summary["active"] += d["count"]
        if d["_id"] == "CRITICAL":
            summary["critical"] = d["count"]
        elif d["_id"] == "WARNING":
            summary["warning"] = d["count"]

    return jsonify(summary)
