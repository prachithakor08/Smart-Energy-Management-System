import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import AlertHistory from "./pages/AlertHistory";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import CsvUpload from "./pages/CsvUpload";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/alert-history" element={<AlertHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/alerts/history" element={<AlertHistory />} />
        <Route path="/csv-upload" element={<CsvUpload />} />

        {/* <Route path="/substation/:id" element={<SubstationDetails />} /> */}
        {/* <Route path="/devices/:id" element={<DeviceConnectivity />} /> */}
        {/* <Route path="/devices" element={<DeviceConnectivity />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
