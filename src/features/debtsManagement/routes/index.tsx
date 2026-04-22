import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const DebtsManagement = lazy(() => import("../views/DebtsManagement"));
const DebtDetails = lazy(() => import("../views/DebtDetails"));

export const DebtsManagementRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DebtsManagement />} />
      <Route path="/:id" element={<DebtDetails />} />
    </Routes>
  );
};
