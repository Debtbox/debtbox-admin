import { Navigate } from 'react-router-dom';
import { AuthRoutes } from '@/features/auth';
import PublicRoutes from './PublicRoutes';

export const publicRoutes = [
  {
    path: '/*',
    element: <PublicRoutes />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'auth/*',
        element: <AuthRoutes />,
      },
      {
        path: '*',
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
];
