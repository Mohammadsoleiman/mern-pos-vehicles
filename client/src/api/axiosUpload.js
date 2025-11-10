import axios from "axios";

const axiosUpload = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ⚠️ Do NOT set "Content-Type" here.
// Axios will automatically use "multipart/form-data" for FormData payloads.
export default axiosUpload;
