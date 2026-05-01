import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/shared/Input";
import { useUserStore } from "@/stores/UserStore";
import { SalesSectionTabs, SalesUserSelect } from "../components";
import { useSalesPerformance } from "../api/sales";
import { formatSalesAmount, formatSalesHalala, isSalesAdminRole } from "../utils";

const currentMonth = () => new Date().toISOString().slice(0, 7);

const Metric = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const SalesPerformance = () => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const canManageAllSales = isSalesAdminRole(user?.role?.slug);
  const [month, setMonth] = useState(currentMonth());
  const [salesUserId, setSalesUserId] = useState("");
  const query = useMemo(
    () => ({ month, salesUserId: canManageAllSales && salesUserId ? Number(salesUserId) : undefined }),
    [canManageAllSales, month, salesUserId],
  );
  const performanceQuery = useSalesPerformance({ query });
  const data = performanceQuery.data?.data;

  return (
    <div className="p-6">
      <SalesSectionTabs />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t("salesPerformance.title", "Sales Performance")}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Input
          label={t("salesPerformance.month", "Month")}
          type="month"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
        />
        {canManageAllSales && (
          <SalesUserSelect
            label={t("salesLeads.filters.assignedSalesUser", "Sales User")}
            value={salesUserId}
            onChange={setSalesUserId}
            allowUnassigned
          />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Metric label={t("salesPerformance.totalAssignedMerchants", "Assigned Merchants")} value={data?.totalAssignedMerchants ?? 0} />
        <Metric label={t("salesPerformance.activeMerchants", "Active Merchants")} value={data?.activeMerchants ?? 0} />
        <Metric label={t("salesPerformance.merchantsWithPayments", "Merchants With Payments")} value={data?.merchantsWithPayments ?? 0} />
        <Metric label={t("salesPerformance.totalDebtCount", "Debt Count")} value={data?.totalDebtCount ?? 0} />
        <Metric label={t("salesPerformance.totalDebtAmount", "Total Debt Amount")} value={formatSalesAmount(data?.totalDebtAmount)} />
        <Metric label={t("salesPerformance.totalPaidAmount", "Total Paid Amount")} value={formatSalesHalala(data?.totalPaidAmount)} />
        <Metric label={t("salesPerformance.incentiveTier", "Incentive Tier")} value={data?.incentiveTier ?? "—"} />
        <Metric label={t("salesPerformance.incentiveAmount", "Incentive Amount")} value={formatSalesAmount(data?.incentiveAmount)} />
      </div>
    </div>
  );
};

export default SalesPerformance;
