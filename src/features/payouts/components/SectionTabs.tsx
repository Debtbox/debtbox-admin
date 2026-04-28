import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";

export const SectionTabs = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const isPayments = location.pathname.includes("/payouts/payments");

  const tabs = [
    { label: t("payouts.tabs.payouts", "Payouts"), to: "/payouts" },
    { label: t("payouts.tabs.payments", "Payments"), to: "/payouts/payments" },
  ];

  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6">
      {tabs.map((tab) => {
        const active = tab.to === "/payouts/payments" ? isPayments : !isPayments;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              active
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};
