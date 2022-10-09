import { Navigate } from "react-router-dom";
import authService from "../../auth/auth.service";

export const LoggedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};