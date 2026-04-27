import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const Payouts = lazy(() => import("../views/Payouts"));
const PayoutDetails = lazy(() => import("../views/PayoutDetails"));

export const PayoutsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequirePermission permissions={[PERMISSIONS.PAYMENT_LIST]}>
            <Payouts />
          </RequirePermission>
        }
      />
      <Route
        path="/:id"
        element={
          <RequirePermission permissions={[PERMISSIONS.PAYMENT_READ]}>
            <PayoutDetails />
          </RequirePermission>
        }
      />
    </Routes>
  );
};
