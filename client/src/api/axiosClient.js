import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // لا تستعمل cookies بهالمشروع
});

export default axiosClient;
