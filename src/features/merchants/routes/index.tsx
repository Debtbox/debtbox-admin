import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Merchants = lazy(() => import("../views/Merchants"));
const MerchantDetails = lazy(() => import("../views/MerchantDetails"));

export const MerchantsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Merchants />} />
      <Route path="/:id" element={<MerchantDetails />} />
    </Routes>
  );
};