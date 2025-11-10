import axios from "axios";

const API = "http://localhost:5000/api/accounts";

export const getAccounts = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getAccount = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const createAccount = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const updateAccount = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

export const deleteAccount = async (id) => {
  await axios.delete(`${API}/${id}`);
};
