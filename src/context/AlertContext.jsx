import { createContext, useContext, useEffect, useState } from "react";
import { fetchActiveAlerts , updateAlertStatus } from "../api/alertApi";

const AlertContext = createContext();
export const useAlerts = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  async function loadAlerts() {
    const data = await fetchActiveAlerts ();
    setAlerts(data);
  }

 async function updateStatus(id, payload) {
  await updateAlertStatus(id, payload);
  loadAlerts();
}


  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const saveResolutionDetails = (id, details) => {
  setAlerts(prev =>
    prev.map(alert =>
      alert.id === id
        ? { ...alert, resolutionDetails: details }
        : alert
    )
  );
};

  
  return (
    <AlertContext.Provider value={{ alerts, updateStatus ,saveResolutionDetails }}>
      {children}
    </AlertContext.Provider>
  );
}
