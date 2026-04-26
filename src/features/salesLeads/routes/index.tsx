import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const SalesLeads = lazy(() => import("../views/SalesLeads"));
const SalesLeadDetails = lazy(() => import("../views/SalesLeadDetails"));

export const SalesLeadsRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <RequirePermission permissions={[PERMISSIONS.SALES_LEAD_LIST]}>
          <SalesLeads />
        </RequirePermission>
      }
    />
    <Route
      path="/:id"
      element={
        <RequirePermission permissions={[PERMISSIONS.SALES_LEAD_READ]}>
          <SalesLeadDetails />
        </RequirePermission>
      }
    />
  </Routes>
);
