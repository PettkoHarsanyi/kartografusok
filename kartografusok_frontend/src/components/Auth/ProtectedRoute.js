import { Navigate } from "react-router-dom";
import authService from "../../auth/auth.service";

export const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }
  return children;
};