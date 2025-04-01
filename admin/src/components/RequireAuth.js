import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RequireAuth({ children }) {
    const { user } = useAuth();

    if (!user) {
        // 用户未登录，重定向到登录页面
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RequireAuth;