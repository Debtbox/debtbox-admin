import { DashboardRoutes } from "@/features/dashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import { CustomersRoutes } from "@/features/customers";
import { MerchantsRoutes } from "@/features/merchants";
import { SupportTicketsRoutes } from "@/features/supportTickets";
import { DebtsManagementRoutes } from "@/features/debtsManagement/";
import { SalesLeadsRoutes } from "@/features/salesLeads";

export const protectedRoutes = [
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/support-tickets*",
        element: <SupportTicketsRoutes />,
      },
      {
        path: "/",
        element: <DashboardRoutes />,
      },
      {
        path: "/dashboard",
        element: <DashboardRoutes />,
      },

      {
        path: "/customers*",
        element: <CustomersRoutes />,
      },
      {
        path: "/merchants*",
        element: <MerchantsRoutes />,
      },
      {
        path: "/debts-management*",
        element: <DebtsManagementRoutes />,
      },
      {
        path: "/sales-leads*",
        element: <SalesLeadsRoutes />,
      },
    ],
  },
];
