import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const SalesLeads = lazy(() => import("../views/SalesLeads"));
const SalesLeadDetails = lazy(() => import("../views/SalesLeadDetails"));

export const SalesLeadsRoutes = () => (
  <Routes>
    <Route path="/" element={<SalesLeads />} />
    <Route path="/:id" element={<SalesLeadDetails />} />
  </Routes>
);
