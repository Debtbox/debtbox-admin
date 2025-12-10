import { DashboardRoutes } from '@/features/dashboard';
import ProtectedRoutes from './ProtectedRoutes';
import { CustomersRoutes } from '@/features/customers';
import { MerchantsRoutes } from '@/features/merchants';
import { SettingsRoutes } from '@/features/settings';

export const protectedRoutes = [
  {
    path: '/',
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/',
        element: <DashboardRoutes />,
      },
      {
        path: '/dashboard',
        element: <DashboardRoutes />,
      },
      {
        path: '/customers',
        element: <CustomersRoutes />,
      },
      {
        path: '/merchants',
        element: <MerchantsRoutes />,
      },
      {
        path: '/settings',
        element: <SettingsRoutes />,
      },
    ],
  },
];
