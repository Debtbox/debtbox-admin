import { Navigate, useRoutes } from 'react-router-dom';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { getCookie } from '@/utils/storage';

export const AppRoutes = () => {
  // For now, always show protected routes (static template)
  // When backend is integrated, check for authentication token
  const isLoggedIn = getCookie('access_token') || true; // Temporary: always true for static template
  const routes = isLoggedIn ? protectedRoutes : publicRoutes;

  const element = useRoutes([
    ...routes,
    {
      path: '*',
      element: <Navigate to={isLoggedIn ? '/' : '/auth/login'} replace />,
    },
  ]);

  return <>{element}</>;
};
