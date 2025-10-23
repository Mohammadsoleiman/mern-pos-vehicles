import React, { useState, useContext } from "react";

// ✅ Correct context import
import { VehicleContext } from "../../context/ACCOUNTANT/VehicleContext.jsx";

// ✅ Correct CSS import (relative path from forms folder)
import "../../styles/accountant/forms.css";

export default function AddVehicleForm() {
  const { addVehicle } = useContext(VehicleContext);
  const [vehicle, setVehicle] = useState({ model: "", plate: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addVehicle(vehicle);
    setVehicle({ model: "", plate: "" });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>Add Vehicle</h3>
      <input
        type="text"
        placeholder="Model"
        value={vehicle.model}
        onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
      />
      <input
        type="text"
        placeholder="Plate Number"
        value={vehicle.plate}
        onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
      />
      <button type="submit">Add Vehicle</button>
    </form>
  );
}
