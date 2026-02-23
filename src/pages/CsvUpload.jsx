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

  const handleDownload = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/download-report",
      { results: result.results },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Substation_Alert_Report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    alert("Error generating report");
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
  <div className="csv-results">

    {/* Summary Card */}
    <div className="alert-summary-card">
      <div className="summary-left">
        <h4>🚨 Substation Alert Summary</h4>
        <p><strong>Substation ID:</strong> 1</p>
        <p>
          <strong>Status:</strong> 
          <span className="status-badge critical">
            CONTINUOUS ALERT
          </span>
        </p>
        <p><strong>Total Alert Windows:</strong> {result.results.length}</p>
      </div>
    </div>

    {/* Timeline Table */}
    <div className="timeline-card">
      <h5>Alert Detection Timeline</h5>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Time Window</th>
              <th>Anomaly Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {result.results.map((r, index) => (
              <tr key={index}>
                <td>
                  {new Date(r.window_start_time).toLocaleTimeString()} –{" "}
                  {new Date(r.window_end_time).toLocaleTimeString()}
                </td>
                <td>{r.anomalyScore.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${r.status.toLowerCase()}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            
     </div>
     <button
            className="btn btn-primary btn-success mt-3"
            onClick={handleDownload}
          >
          Generate Report (Excel)
          </button>
  </div>
  
)}
    </div>
  );
}
