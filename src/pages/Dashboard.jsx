import { useEffect, useState } from "react";
import { socket } from "../api/socket";
import SummaryCard from "../components/dashboard/SummaryCard";
import SubstationCard from "../components/dashboard/SubstationCard";
import SubstationSLD from "../components/sld/SubstationSLD";

export default function Dashboard() {

  const [substations, setSubstations] = useState([]);
  const [overview, setOverview] = useState({
    total: 0,
    alerts: 0,
    critical: 0,
    warning: 0
  });

  useEffect(() => {
     socket.on("connect", () => {
    console.log("Connected to backend socket!");
  });
    socket.on("substation_data", (data) => {
       console.log("LIVE DATA RECEIVED:", data);
      setSubstations(data);

      const critical = data.filter(s => s.status === "CRITICAL").length;
      const warning = data.filter(s => s.status === "WARNING").length;

      setOverview({
        total: data.length,
        alerts: critical + warning,
        critical,
        warning
      });

    });

    return () => socket.off("substation_data");

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

      <SubstationSLD substations={substations} />

      <hr style={{ margin: "30px 0" }} />

      <h2>Live Substation Status</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px"
        }}
      >
        {substations.map((s) => (
          <SubstationCard key={s.id} data={s} />
        ))}
      </div>

    </div>
  );
}