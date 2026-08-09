import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
    const {
        user,
        loading,
        isAuthenticated
    } = useAuth();

    // Wait for AuthContext to initialize
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <p className="text-slate-400">
                    Loading...
                </p>
            </div>
        );
    }

    // Not logged in
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Logged in but not admin
    if (user?.role !== 'admin') {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
};

export default AdminRoute;