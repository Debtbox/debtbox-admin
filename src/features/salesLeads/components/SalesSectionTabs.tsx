import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PERMISSIONS } from "@/auth/permissions";
import { can } from "@/auth/rbac";
import { useUserStore } from "@/stores/UserStore";
import { cn } from "@/utils/cn";

export const SalesSectionTabs = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const items = [
    { to: "/sales-leads", label: t("salesLeads.title", "Sales Leads"), permission: PERMISSIONS.SALES_LEAD_LIST },
    { to: "/sales-leads/dashboard", label: t("salesDashboard.title", "Sales Dashboard"), permission: PERMISSIONS.DASHBOARD_SALES_READ },
    { to: "/sales-leads/assignments", label: t("salesAssignments.title", "Sales Assignments"), permission: PERMISSIONS.SALES_ASSIGNMENT_READ },
    { to: "/sales-leads/performance", label: t("salesPerformance.title", "Sales Performance"), permission: PERMISSIONS.SALES_PERFORMANCE_READ },
  ].filter((item) => can(user, item.permission));

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200">
      {items.map((item) => {
        const active =
          item.to === "/sales-leads"
            ? location.pathname === "/sales-leads"
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
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};
