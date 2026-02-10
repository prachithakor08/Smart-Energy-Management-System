import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div style={styles.appContainer}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div style={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  pageContent: {
    flex: 1,
    padding: "24px",
    backgroundColor: "#f4f6f8",
    overflowY: "auto",
  },
};
