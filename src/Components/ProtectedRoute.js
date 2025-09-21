import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "../redux/Role/roleSlice";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // seconds

    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/Login" replace />;
    }

    const userRole = decoded.role; // ✅ read role from JWT

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token");
    return <Navigate to="/Login" replace />;
  }

  return children;
};
export default ProtectedRoute;
