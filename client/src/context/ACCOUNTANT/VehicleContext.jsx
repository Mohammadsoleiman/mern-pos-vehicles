import React, { createContext, useState } from "react";

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([
    { id: "V001", model: "Toyota Corolla", plate: "ABC123", price: 20000 },
    { id: "V002", model: "Honda Civic", plate: "XYZ789", price: 22000 },
    { id: "V003", model: "Ford Focus", plate: "DEF456", price: 18000 },
    { id: "V004", model: "Nissan Altima", plate: "GHI789", price: 25000 },
  ]);

  // Add a new vehicle
  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, vehicle]);
  };

  // Edit existing vehicle by ID
  const editVehicle = (id, updatedVehicle) => {
    setVehicles(
      vehicles.map((v) => (v.id === id ? updatedVehicle : v))
    );
  };

  // Delete vehicle by ID
  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  // Calculate total inventory value
  const totalValue = vehicles.reduce((acc, v) => acc + v.price, 0);

  // Count of total vehicles
  const totalVehicles = vehicles.length;

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        editVehicle,
        deleteVehicle,
        totalValue,
        totalVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};
