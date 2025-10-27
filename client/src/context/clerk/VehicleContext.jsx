// src/context/clerk/VehicleContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const VehicleContext = createContext();

export const ClerkVehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize with mock data
    fetchVehicles();
  }, []);

  // Fetch all vehicles (using mock data)
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockVehicles = [
        { 
          id: 1, 
          make: "Toyota", 
          model: "Camry", 
          year: 2024,
          stock: 5, 
          price: 25000,
          color: "Silver",
          vin: "1HGBH41JXMN109186",
          mileage: 0,
          condition: "new",
          description: "Brand new Toyota Camry with all modern features",
          imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500"
        },
        { 
          id: 2, 
          make: "Honda", 
          model: "Accord", 
          year: 2024,
          stock: 3, 
          price: 27000,
          color: "Black",
          vin: "1HGCM82633A123456",
          mileage: 0,
          condition: "new",
          description: "Elegant Honda Accord with premium interior",
          imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500"
        },
        { 
          id: 3, 
          make: "Ford", 
          model: "F-150", 
          year: 2023,
          stock: 2, 
          price: 35000,
          color: "Blue",
          vin: "1FTFW1ET5EKE12345",
          mileage: 15000,
          condition: "used",
          description: "Powerful pickup truck in excellent condition",
          imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500"
        },
        { 
          id: 4, 
          make: "Tesla", 
          model: "Model 3", 
          year: 2024,
          stock: 8, 
          price: 42000,
          color: "White",
          vin: "5YJ3E1EA8KF123456",
          mileage: 0,
          condition: "new",
          description: "Electric vehicle with autopilot features",
          imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500"
        },
        { 
          id: 5, 
          make: "Chevrolet", 
          model: "Silverado", 
          year: 2023,
          stock: 0, 
          price: 38000,
          color: "Red",
          vin: "1GCVKREC8FZ123456",
          mileage: 25000,
          condition: "used",
          description: "Heavy-duty truck for work and play",
          imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500"
        },
        { 
          id: 6, 
          make: "BMW", 
          model: "X5", 
          year: 2024,
          stock: 4, 
          price: 55000,
          color: "Gray",
          vin: "5UXCR6C08L9A12345",
          mileage: 0,
          condition: "new",
          description: "Luxury SUV with advanced safety features",
          imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500"
        }
      ];
      
      setVehicles(mockVehicles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to load vehicles");
      setLoading(false);
    }
  };

  // Add new vehicle
  const addVehicle = async (vehicleData) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock add
      const newVehicle = {
        id: Date.now(),
        ...vehicleData,
        price: parseFloat(vehicleData.price),
        stock: parseInt(vehicleData.stock),
        year: parseInt(vehicleData.year),
        mileage: vehicleData.mileage ? parseInt(vehicleData.mileage) : 0
      };
      
      setVehicles([...vehicles, newVehicle]);
      return newVehicle;
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setError("Failed to add vehicle");
      throw error;
    }
  };

  // Update vehicle
  const updateVehicle = async (id, vehicleData) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock update
      const updatedVehicle = {
        ...vehicleData,
        id,
        price: parseFloat(vehicleData.price),
        stock: parseInt(vehicleData.stock),
        year: parseInt(vehicleData.year),
        mileage: vehicleData.mileage ? parseInt(vehicleData.mileage) : 0
      };
      
      setVehicles(vehicles.map(v => v.id === id ? updatedVehicle : v));
      return updatedVehicle;
    } catch (error) {
      console.error("Error updating vehicle:", error);
      setError("Failed to update vehicle");
      throw error;
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock delete
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setError("Failed to delete vehicle");
      throw error;
    }
  };

  // Update vehicle stock
  const updateVehicleStock = async (id, quantity) => {
    try {
      const vehicle = vehicles.find(v => v.id === id);
      if (!vehicle) throw new Error("Vehicle not found");
      
      const newStock = vehicle.stock - quantity;
      if (newStock < 0) throw new Error("Insufficient stock");
      
      await updateVehicle(id, { ...vehicle, stock: newStock });
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  };

  // Get vehicle by ID
  const getVehicleById = (id) => {
    return vehicles.find(v => v.id === id);
  };

  // Search vehicles
  const searchVehicles = (query) => {
    if (!query) return vehicles;
    
    const lowercaseQuery = query.toLowerCase();
    return vehicles.filter(v => 
      v.make?.toLowerCase().includes(lowercaseQuery) ||
      v.model?.toLowerCase().includes(lowercaseQuery) ||
      v.vin?.toLowerCase().includes(lowercaseQuery) ||
      v.color?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Get low stock vehicles
  const getLowStockVehicles = () => {
    return vehicles.filter(v => v.stock > 0 && v.stock < 5);
  };

  // Get out of stock vehicles
  const getOutOfStockVehicles = () => {
    return vehicles.filter(v => v.stock === 0);
  };

  const value = {
    vehicles,
    loading,
    error,
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    updateVehicleStock,
    getVehicleById,
    searchVehicles,
    getLowStockVehicles,
    getOutOfStockVehicles,
    setVehicles
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

export default ClerkVehicleProvider;