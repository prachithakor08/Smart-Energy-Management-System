import { useEffect, useState } from "react";
import { fetchAlertHistory } from "../api/alertApi";

export default function AlertHistory() {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAlertHistory().then(setHistory);
  }, []);

  if (history.length === 0) {
    return <p style={{ padding: "20px" }}>No resolved alerts yet</p>;
  }

  return (
    <div className="alert-history-container">
      <h2 className="history-title">Alert History</h2>

      {history.map(alert => (
        <div
          key={alert.id}
          className="alert-card history-enhanced-card"
          style={{
            borderLeft: `6px solid ${
              alert.severity === "CRITICAL" ? "#dc3545" : "#facc15"
            }`
          }}
        >
          <div className="alert-header enhanced-header">
            <div>
              <h4 className="substation-title">
                Substation {alert.substationName}
              </h4>
              <p className="alert-time">
                Resolved at:{" "}
                {new Date(alert.resolvedAt).toLocaleString()}
              </p>
              <p className="score-text">
                Anomaly Score:{" "}
                <span className="score-value">
                  {alert.score.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="right-section">
              <span
                className={`severity-badge ${
                  alert.severity === "CRITICAL"
                    ? "critical"
                    : "warning"
                }`}
              >
                {alert.severity}
              </span>

              <button
                className="details-btn"
                onClick={() =>
                  setExpandedId(
                    expandedId === alert.id ? null : alert.id
                  )
                }
              >
                {expandedId === alert.id
                  ? "Hide Details"
                  : "View Details"}
              </button>
            </div>
          </div>

          {/* 🔥 Expanded Section */}
          {expandedId === alert.id &&
            alert.resolutionDetails && (
              <div className="details-box">
                <div className="detail-row">
                  <span>Root Cause</span>
                  <strong>
                    {alert.resolutionDetails.rootCause}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Reason</span>
                  <strong>
                    {alert.resolutionDetails.classification}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Action Taken</span>
                  <strong>
                    {alert.resolutionDetails.correctiveAction}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Prevention</span>
                  <strong>
                    {alert.resolutionDetails.preventiveStrategy}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Resolution Type</span>
                  <strong className="outcome-badge">
                    {alert.resolutionDetails.outcome}
                  </strong>
                </div>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
