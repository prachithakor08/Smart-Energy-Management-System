import { useEffect, useState } from "react";
import { predictAlert } from "../api/predictApi";
import { createAlert } from "../api/alertApi";
import { substationData } from "../data/substationData";
import SummaryCard from "../components/dashboard/SummaryCard";
import SubstationCard from "../components/dashboard/SubstationCard";
import { fetchAlertSummary } from "../api/alertApi";
import SubstationSLD from "../components/sld/SubstationSLD";

function deriveSeverity(payload) {
  if (
    payload["Power Factor Total"] < 0.75 ||
    payload["THD Current A"] > 8 ||
    payload["Voltage L-L Avg"] < 395
  ) {
    return "CRITICAL";
  }

  if (
    payload["Power Factor Total"] < 0.88 ||
    payload["THD Current A"] > 4
  ) {
    return "WARNING";
  }

  return "NORMAL";
}

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [overview, setOverview] = useState({
    total: 0,
    alerts: 0,
    critical: 0,
    warning: 0
  });

  
  useEffect(() => {
  async function loadDashboard() {
    // 1️⃣ Fetch alert summary from DB
    const summary = await fetchAlertSummary();

    setOverview({
      total: substationData.length,
      alerts: summary.active,
      critical: summary.critical,
      warning: summary.warning
    });

    // 2️⃣ Run prediction only for live status cards
    const updated = [];

    for (const ss of substationData) {
      const res = await predictAlert(ss);

      updated.push({
        id: ss.id,
        name: ss.name,
        status: res.status,
        connectivity: "Online",
        anomalyScore: res.anomalyScore ?? 0
      });
    }

    setResults(updated);
  }

  loadDashboard();
}, []);



  return (
    <div style={{ padding: "20px" }}>
      
      {/* OVERVIEW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        <SummaryCard title="Total Substations" value={overview.total} />
        <SummaryCard title="Active Alerts" value={overview.alerts} />
        <SummaryCard title="Critical" value={overview.critical} />
        <SummaryCard title="Warning" value={overview.warning} />
      </div>
        <hr style={{ margin: "30px 0" }} />
        
      
      <h2 style={{ 
  fontSize: "20px", 
  fontWeight: "700",
  color: "#111827",
  marginBottom: "20px"
}}>
  Grid Topology Visualization
</h2>

        <SubstationSLD substations={results} />

        <hr style={{ margin: "30px 0" }} />

      <h2>Live Substation Status</h2>

      {/* SUBSTATION CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px"
        }}
      >
        {results.map((s) => (
          <SubstationCard key={s.id} data={s} />
        ))}
      </div>

    </div>
  );
}
