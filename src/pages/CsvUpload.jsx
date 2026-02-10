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
        <div style={{ marginTop: "20px" }}>
          <h4>Results</h4>
          <p>Total Windows: {result.total_windows}</p>
          <p>Alerts Detected: {result.results.filter(r => r.status === "ALERT").length}</p>
        </div>
      )}
    </div>
  );
}
