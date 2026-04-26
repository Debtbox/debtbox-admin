import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const DebtsManagement = lazy(() => import("../views/DebtsManagement"));
const DebtDetails = lazy(() => import("../views/DebtDetails"));

export const DebtsManagementRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequirePermission permissions={[PERMISSIONS.DEBT_LIST]}>
            <DebtsManagement />
          </RequirePermission>
        }
      />
      <Route
        path="/:id"
        element={
          <RequirePermission permissions={[PERMISSIONS.DEBT_READ]}>
            <DebtDetails />
          </RequirePermission>
        }
      />
    </Routes>
  );
};
