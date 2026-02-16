import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/authProvider";
const ProtectedRoute = ({allowedRole}) => {
  const { token, role } = useAuth();
  const location = useLocation();
  return token ? (
    allowedRole === Number(role) ? (
      <Outlet />
    ) :(
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/user/login" state={{ from: location }} replace />
  )
};

export default ProtectedRoute;
