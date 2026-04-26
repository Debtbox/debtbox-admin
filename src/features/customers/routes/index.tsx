import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const Customers = lazy(() => import("../views/Customers"));
const CustomerDetails = lazy(() => import("../views/CustomerDetails"));

export const CustomersRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequirePermission permissions={[PERMISSIONS.CUSTOMER_LIST]}>
            <Customers />
          </RequirePermission>
        }
      />
      <Route
        path="/:id"
        element={
          <RequirePermission permissions={[PERMISSIONS.CUSTOMER_READ]}>
            <CustomerDetails />
          </RequirePermission>
        }
      />
    </Routes>
  );
};
