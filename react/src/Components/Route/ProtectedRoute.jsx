import { Navigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";

const ProtectedRoute = ({ children, requiredRoles }) => {
  // Get the token and user from the context
    const { token, user } = useStateContext();

    // Check if the user is authenticated and if they have the correct role
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Check if the user's role matches the required roles
    const userRole = user?.role_id === 1 ? "admin" : "teacher";

    if (requiredRoles && !requiredRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
