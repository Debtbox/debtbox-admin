import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { PERMISSIONS } from "@/auth/permissions";
import { RequirePermission } from "@/routes/protected/RequirePermission";

const Merchants = lazy(() => import("../views/Merchants"));
const MerchantDetails = lazy(() => import("../views/MerchantDetails"));

export const MerchantsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequirePermission permissions={[PERMISSIONS.MERCHANT_LIST]}>
            <Merchants />
          </RequirePermission>
        }
      />
      <Route
        path="/:id"
        element={
          <RequirePermission permissions={[PERMISSIONS.MERCHANT_READ]}>
            <MerchantDetails />
          </RequirePermission>
        }
      />
    </Routes>
  );
};
