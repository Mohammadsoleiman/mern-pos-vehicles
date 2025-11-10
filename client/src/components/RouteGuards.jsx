// // client/src/components/RouteGuards.jsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export const PrivateRoute = ({ children }) => {
//   const { token } = useAuth();
//   return token ? children : <Navigate to="/" replace />;
// };

// export const RoleRoute = ({ children, allow }) => {
//   const { role } = useAuth();
//   if (!role) return <Navigate to="/" replace />;
//   return allow.includes(role) ? children : <Navigate to="/dashboard" replace />;
// };
