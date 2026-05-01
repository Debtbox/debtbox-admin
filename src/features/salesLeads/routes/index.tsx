import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const SalesLeads = lazy(() => import("../views/SalesLeads"));
const SalesLeadDetails = lazy(() => import("../views/SalesLeadDetails"));
const SalesDashboard = lazy(() => import("../views/SalesDashboard"));
const SalesAssignments = lazy(() => import("../views/SalesAssignments"));
const SalesPerformance = lazy(() => import("../views/SalesPerformance"));

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
      path="/dashboard"
      element={
        <RequirePermission permissions={[PERMISSIONS.DASHBOARD_SALES_READ]}>
          <SalesDashboard />
        </RequirePermission>
      }
    />
    <Route
      path="/assignments"
      element={
        <RequirePermission permissions={[PERMISSIONS.SALES_ASSIGNMENT_READ]}>
          <SalesAssignments />
        </RequirePermission>
      }
    />
    <Route
      path="/performance"
      element={
        <RequirePermission permissions={[PERMISSIONS.SALES_PERFORMANCE_READ]}>
          <SalesPerformance />
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
