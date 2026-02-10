import { useNavigate } from "react-router-dom";

export default function SubstationCard({ data }) {
  const navigate = useNavigate();

  const statusColor =
    data.status === "CRITICAL"
      ? "#ff4d4f"
      : data.status === "WARNING"
      ? "#faad14"
      : "#52c41a";

  return (
    <div className="card" style={{ width: "260px" }}>
      <h3>{data.name}</h3>

      {/* <p>
        Connectivity:{" "}
        <span style={{ color: "#52c41a", fontWeight: "bold" }}>
          {data.connectivity}
        </span>
      </p> */}

      <p>
        AI Status:{" "}
        <span style={{ color: statusColor, fontWeight: "bold" }}>
          {data.status}
        </span>
      </p>

      {/* {data.status !== "NORMAL" && (
        <p>Anomaly Score: <b>{data.score}</b></p>
      )} */}

      <button
        style={{ marginTop: "10px" }}
        onClick={() => navigate(`/devices/${data.id}`)}
      >
        {/* View Details */}
      </button>
    </div>
  );
}
