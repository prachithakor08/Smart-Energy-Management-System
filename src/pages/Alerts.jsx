import { useState } from "react";
import { useAlerts } from "../context/AlertContext";

export default function Alerts() {
  const { alerts, updateStatus } = useAlerts();
  const [activeAlert, setActiveAlert] = useState(null);

  const [formData, setFormData] = useState({
    classification: "Power Factor Deviation",
    rootCause: "",
    correctiveAction: "",
    preventiveStrategy: "",
    outcome: "Fully Resolved"
  });

  const activeAlerts = alerts.filter(a => a.status !== "Resolved");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await updateStatus(activeAlert.id, {
      status: "Resolved",
      resolutionDetails: formData
    });

    setActiveAlert(null);
  };

  return (
  <>
    {/* BLUR CONTENT */}
    <div className={activeAlert ? "blur-background" : ""}>
      <div style={{ padding: "20px" }}>
        <h2>Active Alerts</h2>

        {activeAlerts.map(alert => (
          <div key={alert.id} className="alert-card">
            <h4>Substation: {alert.substationName}</h4>
            <p><b>Severity:</b> {alert.severity}</p>
            <p>{new Date(alert.createdAt).toLocaleString()}</p>

            {alert.status === "New" && (
              <button
                className="btn btn-primary"
                onClick={() =>
                  updateStatus(alert.id, { status: "Acknowledged" })
                }
              >
                Acknowledge
              </button>
            )}

            {alert.status === "Acknowledged" && (
              <button
                className="btn btn-success"
                onClick={() => setActiveAlert(alert)}
              >
                Resolve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* MODAL OUTSIDE BLUR */}
    {activeAlert && (
      <div className="modal-overlay">
        <div className="modal-card">
          <h3>
            Resolve Alert – Substation {activeAlert.substationName}
          </h3>

          <label>Incident Classification</label>
          <select
            name="classification"
            value={formData.classification}
            onChange={handleChange}
          >
            <option>Power Factor Deviation</option>
            <option>Capacitor Bank Failure</option>
            <option>Voltage Imbalance</option>
            <option>Overload Condition</option>
            <option>Sensor Fault</option>
            <option>False Positive</option>
          </select>

          <label>Confirmed Root Cause</label>
          <textarea
            name="rootCause"
            value={formData.rootCause}
            onChange={handleChange}
          />

          <label>Corrective Action Taken</label>
          <textarea
            name="correctiveAction"
            value={formData.correctiveAction}
            onChange={handleChange}
          />

          <label>Preventive Strategy</label>
          <textarea
            name="preventiveStrategy"
            value={formData.preventiveStrategy}
            onChange={handleChange}
          />

          <label>Resolution Outcome</label>
          <select
            name="outcome"
            value={formData.outcome}
            onChange={handleChange}
          >
            <option>Fully Resolved</option>
            <option>Temporary Fix</option>
            <option>False Alarm</option>
            <option>Monitoring Required</option>
          </select>

          <div className="modal-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => setActiveAlert(null)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit Resolution
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}
