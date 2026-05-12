import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const Receivables = lazy(() => import("../views/Receivables"));
const ReceivableDetails = lazy(() => import("../views/ReceivableDetails"));

export const ReceivablesRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequirePermission permissions={[PERMISSIONS.PAYMENT_LIST]}>
            <Receivables />
          </RequirePermission>
        }
      />
      <Route
        path="/:id"
        element={
          <RequirePermission permissions={[PERMISSIONS.PAYMENT_READ]}>
            <ReceivableDetails />
          </RequirePermission>
        }
      />
    </Routes>
  );
};
