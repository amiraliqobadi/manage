import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, isAuth }) => {
    return isAuth ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
