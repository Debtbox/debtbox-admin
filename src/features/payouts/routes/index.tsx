import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const Payouts = lazy(() => import("../views/Payouts"));
const PayoutDetails = lazy(() => import("../views/PayoutDetails"));
const Payments = lazy(() => import("../views/Payments"));
const PaymentDetails = lazy(() => import("../views/PaymentDetails"));

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

export const PaymentsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequirePermission permissions={[PERMISSIONS.PAYMENT_LIST]}>
            <Payments />
          </RequirePermission>
        }
      />
      <Route
        path="/:id"
        element={
          <RequirePermission permissions={[PERMISSIONS.PAYMENT_READ]}>
            <PaymentDetails />
          </RequirePermission>
        }
      />
    </Routes>
  );
};
