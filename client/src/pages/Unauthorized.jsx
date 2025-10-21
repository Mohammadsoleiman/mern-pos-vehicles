import { useNavigate } from "react-router-dom";
import "../styles/Unauthorized.css";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-card">
      <img
        src="/  assets/unauthorized.png"
        alt="Unauthorized Access"
        className="unauth-image"
      />
      <h2>Access Denied</h2>
      <div className="unauth-icon">🚫</div>
      <p>You don’t have permission to view this page.</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
