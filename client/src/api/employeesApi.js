// src/api/employeesApi.js
import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const employeesApi = axios.create({
  baseURL: `${API_BASE}/api/employees`,
  headers: { "Content-Type": "application/json" },
});

// ---- CRUD ----

// ✅ Get all employees
export const getEmployees = async () => {
  const { data } = await employeesApi.get("/");
  return data;
};

// ✅ Get one employee by ID
export const getEmployee = async (id) => {
  const { data } = await employeesApi.get(`/${id}`);
  return data;
};

// ✅ Create a new employee
export const createEmployee = async (payload) => {
  const { data } = await employeesApi.post("/", payload);
  return data;
};

// ✅ Update employee
export const updateEmployee = async (id, payload) => {
  const { data } = await employeesApi.put(`/${id}`, payload);
  return data;
};

// ✅ Delete employee
export const deleteEmployee = async (id) => {
  const { data } = await employeesApi.delete(`/${id}`);
  return data;
};
