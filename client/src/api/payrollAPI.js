import axiosClient from "./axiosClient";

export const getPayroll = () => axiosClient.get("/payroll");
export const addPayroll = (data) => axiosClient.post("/payroll", data);
export const updatePayroll = (id, data) => axiosClient.put(`/payroll/${id}`, data);
export const deletePayroll = (id) => axiosClient.delete(`/payroll/${id}`);
