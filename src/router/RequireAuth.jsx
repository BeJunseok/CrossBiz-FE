import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const RequireAuth = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
