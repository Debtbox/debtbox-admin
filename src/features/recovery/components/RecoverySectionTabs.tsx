import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";

const TABS = [
  { to: "/recovery", label: "recovery.tabs.reconcile", defaultLabel: "Reconcile" },
  { to: "/recovery/payments", label: "recovery.tabs.paymentRecovery", defaultLabel: "Payment Recovery" },
  { to: "/recovery/payout-ledger", label: "recovery.tabs.payoutLedger", defaultLabel: "Payout Ledger" },
  { to: "/recovery/receivables", label: "recovery.tabs.receivables", defaultLabel: "Receivables" },
  { to: "/recovery/debt-snapshots", label: "recovery.tabs.debtSnapshots", defaultLabel: "Debt Snapshots" },
] as const;

export const RecoverySectionTabs = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200">
      {TABS.map((item) => {
        const active =
          item.to === "/recovery"
            ? location.pathname === "/recovery"
            : location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap",
              active
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {t(item.label, item.defaultLabel)}
          </Link>
        );
      })}
    </div>
  );
};
