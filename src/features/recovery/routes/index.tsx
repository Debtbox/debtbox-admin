import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const ReconcileView = lazy(() => import("../views/ReconcileView"));
const PaymentRecoveryView = lazy(() => import("../views/PaymentRecoveryView"));
const PayoutLedgerView = lazy(() => import("../views/PayoutLedgerView"));
const ReceivablesView = lazy(() => import("../views/ReceivablesView"));
const DebtSnapshotsView = lazy(() => import("../views/DebtSnapshotsView"));

export const RecoveryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ReconcileView />} />
      <Route path="/payments" element={<PaymentRecoveryView />} />
      <Route path="/payout-ledger" element={<PayoutLedgerView />} />
      <Route path="/receivables" element={<ReceivablesView />} />
      <Route path="/debt-snapshots" element={<DebtSnapshotsView />} />
      <Route path="*" element={<Navigate to="/recovery" replace />} />
    </Routes>
  );
};
