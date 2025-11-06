import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { FaCar } from "react-icons/fa";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrName, setEmailOrName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axiosClient.post("/auth/login", {
        emailOrName,
        password,
      });

      login(data);
      console.log("✅ Logged in:", data);

     // Normalize role to string
const userRole = data.role?.name || data.user?.role?.name || data.role || data.user?.role;


      // ✅ توجيه حسب الدور
      if (userRole === "admin") navigate("/admin/dashboard");
      else if (userRole === "account") navigate("/accountant");
      else if (userRole === "clerk" || userRole === "cashier")
        navigate("/cashier");
      else navigate("/unauthorized");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <FaCar className="login-icon" />
        <h2 className="login-title">POS Vehicles System</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="login-input"
            placeholder="Email or UserName"
            value={emailOrName}
            onChange={(e) => setEmailOrName(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>

        <p className="footer-text">© 2025 POS Vehicles | Secure Access</p>
      </div>
    </div>
  );
}
