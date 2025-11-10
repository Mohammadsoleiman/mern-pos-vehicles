// import axiosClient from "./axiosClient";

// export const fetchSummary = async () => {
//   const { data } = await axiosClient.get("/reports/summary");
//   return data;
// };

// export const fetchTrend = async (period = "monthly") => {
//   const { data } = await axiosClient.get(`/reports/trend?period=${period}`);
//   return data;
// };
import axiosClient from "./axiosClient";

export const fetchSummary = async () => {
  const { data } = await axiosClient.get("/reports/summary");
  return data;
};

export const fetchTrend = async (period = "monthly") => {
  const { data } = await axiosClient.get(`/reports/trend?period=${period}`);
  return data;
};

/* ✅ ADDED — Admin Overview Cards */
export const fetchOverview = async () => {
  const { data } = await axiosClient.get("/reports/overview");
  return data;
};

/* ✅ ADDED — Financial Totals */
export const fetchFinancialTotals = async () => {
  const { data } = await axiosClient.get("/reports/financial-totals");
  return data;
};

/* ✅ ADDED — Top Customers Table */
export const fetchTopCustomers = async (limit = 5) => {
  const { data } = await axiosClient.get(`/reports/top-customers?limit=${limit}`);
  return data;
};

/* ✅ ADDED — Recent Transactions */
export const fetchRecentTransactions = async (limit = 8) => {
  const { data } = await axiosClient.get(`/reports/recent-transactions?limit=${limit}`);
  return data;
};

/* ✅ ADDED — Income vs Expense Chart */
export const fetchIncomeExpenseTimeseries = async () => {
  const { data } = await axiosClient.get("/reports/admin/timeseries");
  return data;
};

/* ✅ ADDED — Sales Trend Chart */
export const fetchSalesTrend = async () => {
  const { data } = await axiosClient.get("/reports/admin/sales-trend");
  return data;
};

/* ✅ ADDED — Vehicle Type Distribution */
export const fetchVehicleTypes = async () => {
  const { data } = await axiosClient.get("/reports/admin/vehicle-types");
  return data;
};
