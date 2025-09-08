import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children, requiredRoles }) => {
    const { auth, loading } = useAuth();

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!auth) {
        return <Navigate to="/login" />;
    }
    if (requiredRoles && !requiredRoles.includes(auth.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRole: PropTypes.string,
};

export default PrivateRoute;