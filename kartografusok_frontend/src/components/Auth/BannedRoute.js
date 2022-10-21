import { Navigate } from "react-router-dom";
import authService from "../../auth/auth.service";

export const BannedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (user.banned) {
    return <Navigate to="/" />;
  }
  return children;
};