import { DashboardRoutes } from "@/features/dashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import { CustomersRoutes } from "@/features/customers";
import { MerchantsRoutes } from "@/features/merchants";
import { SupportTicketsRoutes } from "@/features/supportTickets";
import { DebtsManagementRoutes } from "@/features/debtsManagement/";
import { SalesLeadsRoutes } from "@/features/salesLeads";
import { UserManagementRoutes } from "@/features/user-management";
import { PayoutsRoutes } from "@/features/payouts";
import { RequirePermission } from "./RequirePermission";
import { PERMISSIONS, DASHBOARD_PERMISSIONS } from "@/auth/permissions";
import { DefaultProtectedHome } from "./DefaultProtectedHome";

export const protectedRoutes = [
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/support-tickets*",
        element: (
          <RequirePermission permissions={[PERMISSIONS.TICKET_READ]}>
            <SupportTicketsRoutes />
          </RequirePermission>
        ),
      },
      {
        path: "/",
        element: <DefaultProtectedHome />,
      },
      {
        path: "/dashboard",
        element: (
          <RequirePermission permissions={DASHBOARD_PERMISSIONS}>
            <DashboardRoutes />
          </RequirePermission>
        ),
      },

      {
        path: "/customers*",
        element: (
          <RequirePermission permissions={[PERMISSIONS.CUSTOMER_LIST, PERMISSIONS.CUSTOMER_READ]}>
            <CustomersRoutes />
          </RequirePermission>
        ),
      },
      {
        path: "/merchants*",
        element: (
          <RequirePermission permissions={[PERMISSIONS.MERCHANT_LIST, PERMISSIONS.MERCHANT_READ]}>
            <MerchantsRoutes />
          </RequirePermission>
        ),
      },
      {
        path: "/debts-management*",
        element: (
          <RequirePermission permissions={[PERMISSIONS.DEBT_LIST, PERMISSIONS.DEBT_READ]}>
            <DebtsManagementRoutes />
          </RequirePermission>
        ),
      },
      {
        path: "/sales-leads*",
        element: (
          <RequirePermission permissions={[PERMISSIONS.SALES_LEAD_LIST, PERMISSIONS.SALES_LEAD_READ]}>
            <SalesLeadsRoutes />
          </RequirePermission>
        ),
      },
      {
        path: "/system-users*",
        element: (
          <RequirePermission permissions={[PERMISSIONS.USER_LIST]}>
            <UserManagementRoutes />
          </RequirePermission>
        ),
      },
      {
        path: "/payouts*",
        element: (
          <RequirePermission permissions={[PERMISSIONS.PAYMENT_LIST, PERMISSIONS.PAYMENT_READ]}>
            <PayoutsRoutes />
          </RequirePermission>
        ),
      },
    ],
  },
];
