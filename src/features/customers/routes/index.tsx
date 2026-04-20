import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Customers = lazy(() => import("../views/Customers"));
const CustomerDetails = lazy(() => import("../views/CustomerDetails"));

export const CustomersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Customers />} />
      <Route path="/:id" element={<CustomerDetails />} />
    </Routes>
  );
};
