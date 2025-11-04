import axiosClient from "./axiosClient";

export const fetchSummary = async () => {
  const { data } = await axiosClient.get("/reports/summary");
  return data;
};

export const fetchTrend = async (period = "monthly") => {
  const { data } = await axiosClient.get(`/reports/trend?period=${period}`);
  return data;
};
