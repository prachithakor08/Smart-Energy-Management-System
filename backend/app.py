from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import pandas as pd
import time
from datetime import datetime
from database import alerts_collection
from collections import defaultdict, deque

from routes.alert_routes import alert_routes
from routes.predict_routes import predict_bp
from data_generator import generate_substation
from models.model import predict_alert, WINDOW

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# 🔥 Initialize SocketIO
socketio = SocketIO(
    app,
    cors_allowed_origins="http://localhost:5173",
    async_mode="threading",
)
# Register your existing routes
app.register_blueprint(alert_routes)
app.register_blueprint(predict_bp)

# Rolling buffer per substation
substation_buffers = defaultdict(lambda: deque(maxlen=WINDOW))


# -----------------------------
# 🔥 LIVE STREAM FUNCTION
# -----------------------------
def stream_live_data():
    print("🚀 Streaming task started")
       
    while True:
        print("Sending live data...")
        substations = []

        for i in range(1, 11):  # 10 substations

            sub = generate_substation(i)
            payload = sub["payload"]

            substation_buffers[i].append(payload)

            if len(substation_buffers[i]) >= WINDOW:

                window_df = pd.DataFrame(
                    list(substation_buffers[i])
                )

                _, recon_error = predict_alert(window_df)
                print(f"Substation {i} → Recon Error: {recon_error}")
                sub["anomalyScore"] = float(recon_error)

                if recon_error >= 9.6:
                    sub["status"] = "CRITICAL"
                    # Check if already active alert exists
                    existing = alerts_collection.find_one({
                        "substationId": i,
                        "status": {"$ne": "Resolved"}
                    })

                    if not existing:
                        alerts_collection.insert_one({
                            "substationId": i,
                            "substationName": f"Substation {i}",
                            "severity": "CRITICAL",
                            "anomalyScore": float(recon_error),
                            "message": "AI-detected power quality anomaly",
                            "status": "New",
                            "createdAt": datetime.utcnow(),
                            "acknowledgedAt": None,
                            "resolvedAt": None
                    })

                elif recon_error >= 9.0:
                    sub["status"] = "WARNING"
                else:
                    sub["status"] = "NORMAL"

            else:
                sub["status"] = "INSUFFICIENT_DATA"
                sub["anomalyScore"] = None

            substations.append(sub)

        socketio.emit("substation_data", substations)

        socketio.sleep(30)


# -----------------------------
# 🔥 RUN APP WITH SOCKETIO
# -----------------------------
if __name__ == "__main__":
    socketio.start_background_task(stream_live_data)
    socketio.run(app, host="0.0.0.0", port=5000, debug=False)