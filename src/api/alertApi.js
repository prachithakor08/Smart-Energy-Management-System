export const fetchActiveAlerts = async () => {
  const res = await fetch("http://localhost:5000/alerts");
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
};

export const createAlert = async (payload) => {
  const res = await fetch("http://localhost:5000/alerts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create alert");
  }

  return res.json();
};

export const updateAlertStatus = async (id, payload) => {
  const res = await fetch(`http://localhost:5000/alerts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update alert status");
  }

  return res.json();
};

export const fetchAlertSummary = async () => {
  const res = await fetch("http://localhost:5000/alerts/summary");
  if (!res.ok) throw new Error("Failed to fetch alert summary");
  return res.json();
};

export const fetchAlertHistory = async () => {
  const res = await fetch("http://localhost:5000/alerts/history");
  if (!res.ok) throw new Error("Failed to fetch alert history");
  return res.json();
};
