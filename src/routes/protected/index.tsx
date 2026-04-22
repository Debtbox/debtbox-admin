import { DashboardRoutes } from "@/features/dashboard";
import ProtectedRoutes from "./ProtectedRoutes";
import { CustomersRoutes } from "@/features/customers";
import { MerchantsRoutes } from "@/features/merchants";
import { SupportTicketsRoutes } from "@/features/supportTickets";
import { DebtsManagementRoutes } from "@/features/debtsManagement/";

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
        path: "/customers-management*",
        element: <CustomersRoutes />,
      },
      {
        path: "/merchants-management*",
        element: <MerchantsRoutes />,
      },
      {
        path: "/debts-management*",
        element: <DebtsManagementRoutes />,
      },
    ],
  },
];
