export default function SummaryCard({ title, value }) {
  return (
    <div className="card" style={{ width: "220px" }}>
      <p style={{ fontSize: "14px", color: "#64748b" }}>{title}</p>
      <h2 style={{ fontSize: "28px" }}>{value}</h2>
    </div>
  );
}
