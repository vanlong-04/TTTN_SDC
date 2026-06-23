import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PrivateRoute from "./PrivateRoute";

const RoleRoute = ({ roles, children }) => {
  const { user } = useAuth();

  return (
    <PrivateRoute>
      {user && roles.includes(user.role) ? children : <Navigate to="/" replace />}
    </PrivateRoute>
  );
};

export default RoleRoute;
