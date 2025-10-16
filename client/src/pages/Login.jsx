import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { FaCar } from "react-icons/fa";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axiosClient.post("/auth/login", { email, password });
      login(data);
      console.log("✅ Logged in:", data);

      const userRole = data.role || data.user?.role;
      if (userRole === "admin") navigate("/dashboard");
      else if (userRole === "accounting") navigate("/accounting");
      else if (userRole === "clerk") navigate("/cashier");
      else navigate("/cashier");
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
            type="email"
            className="login-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
