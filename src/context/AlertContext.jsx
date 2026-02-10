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

  async function updateStatus(id, status) {
    await updateAlertStatus(id, status);
    loadAlerts();
  }

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, updateStatus }}>
      {children}
    </AlertContext.Provider>
  );
}
