import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>⚡ Smart EMS</h2>

      <NavLink to="/" style={styles.link}>Dashboard</NavLink>
      <NavLink to="/alerts" style={styles.link}>Alerts</NavLink>
      <NavLink to="/alert-history" style={styles.link}>Alert History</NavLink>
      <NavLink to="/reports" style={styles.link}>Reports</NavLink>
      <NavLink to="/csv-upload" style={styles.link}>CSV Upload</NavLink>

      {/* <NavLink to="/devices" style={styles.link}>Device Connectivity</NavLink> */}

    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "#1e293b",
    color: "#fff",
    height: "100vh",
    padding: "20px",
  },
  logo: {
    marginBottom: "30px",
    fontSize: "20px",
  },
  link: {
    display: "block",
    color: "#cbd5e1",
    textDecoration: "none",
    marginBottom: "15px",
  },
};
