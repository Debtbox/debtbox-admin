import { DashboardRoutes } from '@/features/dashboard';
import ProtectedRoutes from './ProtectedRoutes';
import { CustomersRoutes } from '@/features/customers';
import { MerchantsRoutes } from '@/features/merchants';
import { SettingsRoutes } from '@/features/settings';
import { BusinessApprovalsRoutes } from '@/features/business-approvals';
import { UserManagementRoutes } from '@/features/user-management';
import { MoneyRoutes } from '@/features/money';

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
        path: '/business-approvals',
        element: <BusinessApprovalsRoutes />,
      },
      {
        path: '/user-management',
        element: <UserManagementRoutes />,
      },
      {
        path: '/money',
        element: <MoneyRoutes />,
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
