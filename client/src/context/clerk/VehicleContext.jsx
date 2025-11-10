// client/src/context/clerk/VehicleContext.jsx
import { createContext, useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

// ✅ نفس الاسم الذي تستخدمه في App.jsx
export const VehicleContext = createContext();

export function ClerkVehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      // axiosClient.baseURL = http://localhost:5000/api
      // إذًا هذا سينادي GET /api/vehicles
      const res = await axiosClient.get("/vehicles");
      setVehicles(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch vehicles", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <VehicleContext.Provider value={{ vehicles, loading, refresh: fetchVehicles }}>
      {children}
    </VehicleContext.Provider>
  );
}
