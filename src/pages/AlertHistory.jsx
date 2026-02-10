import { useEffect, useState } from "react";
import { fetchAlertHistory } from "../api/alertApi";

export default function AlertHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchAlertHistory().then(setHistory);
  }, []);

  if (history.length === 0) {
    return <p style={{ padding: "20px" }}>No resolved alerts yet </p>;
  }

  return (
    <div className="alert-history-container">
      <h2 style={{ marginBottom: "20px" }}>Alert History</h2>

      {history.map(alert => (
        <div
          key={alert.id}
          className="alert-card"
          style={{
            borderLeft: `6px solid ${
              alert.severity === "CRITICAL" ? "#dc3545" : "#facc15"
            }`
          }}
        >
          <div className="alert-header">
            <h4>Substation {alert.substationName}</h4>

            <span
              className={`badge ${
                alert.severity === "CRITICAL"
                  ? "badge-red"
                  : "badge-yellow"
              }`}
            >
              {alert.severity}
            </span>
          </div>

          <p className="alert-time">
            Resolved at: {new Date(alert.resolvedAt).toLocaleString()}
          </p>

          <p>
            Anomaly Score: <b>{alert.score.toFixed(2)}</b>
          </p>
        </div>
      ))}
    </div>
  );
}
