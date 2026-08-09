import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const StudentRoute = ({ children }) => {
    const {
        user,
        loading,
        isAuthenticated
    } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <p className="text-slate-400">
                    Loading...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user?.role === 'admin') {
        return (
            <Navigate
                to="/admin/dashboard"
                replace
            />
        );
    }

    return children;
};

export default StudentRoute;