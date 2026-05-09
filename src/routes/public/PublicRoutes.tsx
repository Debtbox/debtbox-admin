import { Navigate, Outlet } from 'react-router-dom';
import { getCookie, ACCESS_TOKEN_KEY } from '@/utils/storage';

const PublicRoutes = () => {
  if (getCookie(ACCESS_TOKEN_KEY)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;
