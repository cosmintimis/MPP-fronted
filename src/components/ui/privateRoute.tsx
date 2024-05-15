import { useUserStore } from '@/store/users';
import { Outlet, Navigate } from 'react-router-dom';


const PrivateRoute = () => {
    const { isAuthenticated } = useUserStore();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;