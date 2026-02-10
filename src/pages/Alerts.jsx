import { useAlerts } from "../context/AlertContext";

export default function Alerts() {
  const { alerts, updateStatus } = useAlerts();
  const activeAlerts = alerts.filter(a => a.status !== "Resolved");

  if (activeAlerts.length === 0) {
    return <p style={{ padding: "20px" }}>No active alerts </p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Active Alerts</h2>

      {activeAlerts.map(alert => (
        <div
          key={alert.id}
          style={{
            borderLeft: `6px solid ${alert.severity === "CRITICAL" ? "#dc3545" : "#ffc107"}`,
            background: "#fff",
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "6px"
          }}
        >
          <h4>Substation :{alert.substationName}</h4>
          <p><b>Severity:</b> {alert.severity}</p>
          {/* <p>{alert.message}</p> */}
          <p>{new Date(alert.createdAt).toLocaleString()}</p>

          {alert.status === "New" && (
            <button class="btn btn-primary" onClick={() => updateStatus(alert.id, "Acknowledged")}>
              Acknowledge
            </button>
          )}

          {alert.status === "Acknowledged" && (
            <button onClick={() => updateStatus(alert.id, "Resolved")}>
              Resolve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
