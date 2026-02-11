import { useState } from "react";
import axios from "axios";

export default function CsvUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/predict-alert-csv",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data);
    } catch (err) {
      alert("Error processing CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>CSV Alert Detection</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button className="btn btn-primary" onClick={handleUpload}>
        {loading ? "Processing..." : "Upload & Detect"}
      </button>

      {result && (
  <div style={{ marginTop: "30px" }}>
    
    {/* Substation Summary */}
    <div
      style={{
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#fff1f0",
        border: "1px solid #ff4d4f",
        marginBottom: "20px"
      }}
    >
      <h4 style={{ color: "#cf1322" }}>
        🚨 Substation Alert Summary
      </h4>
      <p><strong>Substation ID:</strong> 1</p>
      <p><strong>Status:</strong> CONTINUOUS ALERT</p>
      <p><strong>Total Alert Windows:</strong> {result.results.length}</p>
    </div>

    {/* Alert Details Table */}
    <h5>Alert Detection Timeline</h5>
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Time Window (Row Range)</th>
          <th>Anomaly Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {result.results.map((r, index) => (
          <tr key={index}>
            <td>{r.window_start_row} – {r.window_end_row}</td>
            <td>{r.anomalyScore.toFixed(2)}</td>
            <td style={{ color: "#cf1322", fontWeight: "bold" }}>
              {r.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
}
