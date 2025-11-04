import axiosClient from "./axiosClient";

export const getPurchases = () => axiosClient.get("/purchases");
export const addPurchase = (data) => axiosClient.post("/purchases", data);
export const updatePurchase = (id, data) => axiosClient.put(`/purchases/${id}`, data);
export const deletePurchase = (id) => axiosClient.delete(`/purchases/${id}`);
