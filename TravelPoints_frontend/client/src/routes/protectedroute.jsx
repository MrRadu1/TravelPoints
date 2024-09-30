import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authcontext";
const ProtectedRoute = () => {
  const { token, role } = useAuth();

  if (token === null || role === null) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;