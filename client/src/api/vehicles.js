import axiosClient from "./axiosClient";   // teammate's client (for normal JSON)
import axiosUpload from "./axiosUpload";   // your new client (for FormData uploads)

// Helper — build absolute image URL
export const imgUrl = (path) => {
  if (!path) return "";
  // if image path starts with "/uploads", prepend base URL
  if (path.startsWith("/uploads")) return `http://localhost:5000${path}`;
  return path;
};

// 🔹 Get all vehicles
export const getVehicles = async () => {
  const { data } = await axiosClient.get("/vehicles");
  return data;
};

// 🔹 Get one vehicle
export const getVehicle = async (id) => {
  const { data } = await axiosClient.get(`/vehicles/${id}`);
  return data;
};

// 🔹 Create new vehicle (with multiple images)
export const createVehicle = async (payload) => {
  const formData = new FormData();

  // Append new image files
  if (payload.imagesFiles?.length) {
    payload.imagesFiles.forEach((file) => formData.append("images", file));
  }

  // Append all other fields
  Object.entries(payload).forEach(([key, value]) => {
    if (key !== "images" && key !== "imagesFiles") {
      formData.append(key, value ?? "");
    }
  });

  const { data } = await axiosUpload.post("/vehicles", formData);
  return data;
};

// 🔹 Update existing vehicle (merge old + new images)
export const updateVehicle = async (id, payload) => {
  const formData = new FormData();

  // Send old images JSON string (server expects it)
  formData.append("oldImages", JSON.stringify(payload.oldImages || []));

  // Add new uploaded images
  if (payload.imagesFiles?.length) {
    payload.imagesFiles.forEach((file) => formData.append("images", file));
  }

  // Append all other editable fields
  const skip = new Set([
    "images",
    "imagesFiles",
    "oldImages",
    "_id",
    "id",
    "__v",
    "createdAt",
    "updatedAt",
  ]);

  Object.entries(payload).forEach(([key, value]) => {
    if (!skip.has(key)) formData.append(key, value ?? "");
  });

  const { data } = await axiosUpload.put(`/vehicles/${id}`, formData);
  return data;
};

// 🔹 Delete vehicle
export const deleteVehicle = async (id) => {
  const { data } = await axiosClient.delete(`/vehicles/${id}`);
  return data;
};
