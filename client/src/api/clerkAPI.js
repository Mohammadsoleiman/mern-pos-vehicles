// src/api/clerkAPI.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  // you can add headers or interceptors here (auth token etc.)
});

// VEHICLES
export const fetchVehicles = (params) => api.get("/vehicles", { params });
export const fetchVehicle = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (payload) => api.post("/vehicles", payload);
export const updateVehicle = (id, payload) => api.put(`/vehicles/${id}`, payload);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

export default api;
