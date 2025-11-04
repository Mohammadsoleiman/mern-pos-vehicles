import axiosClient from "./axiosClient";

export const getExpenses = () => axiosClient.get("/expenses");
export const addExpense = (data) => axiosClient.post("/expenses", data);
export const updateExpense = (id, data) => axiosClient.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => axiosClient.delete(`/expenses/${id}`);
