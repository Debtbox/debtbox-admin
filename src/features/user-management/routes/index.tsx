import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const UserManagement = lazy(() => import("../views/UserManagement"));

export const UserManagementRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <RequirePermission permissions={[PERMISSIONS.USER_LIST]}>
          <UserManagement />
        </RequirePermission>
      }
    />
  </Routes>
);
