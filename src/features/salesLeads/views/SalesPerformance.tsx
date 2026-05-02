import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/stores/UserStore";
import {
  SalesSectionTabs,
  SalesPerformanceFilters,
  type SalesPerformanceFiltersState,
} from "../components";
import { useSalesPerformance } from "../api/sales";
import { formatIncentiveTier, formatSalesAmount, formatSalesHalala, isSalesAdminRole } from "../utils";

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
  const [filters, setFilters] = useState<SalesPerformanceFiltersState>({
    month: currentMonth(),
    salesUserId: "",
  });

  const query = useMemo(
    () => ({
      month: filters.month,
      salesUserId: canManageAllSales && filters.salesUserId ? Number(filters.salesUserId) : undefined,
    }),
    [canManageAllSales, filters],
  );

  const performanceQuery = useSalesPerformance({ query });
  const data = performanceQuery.data?.data;

  return (
    <div className="p-6">
      <SalesSectionTabs />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t("salesPerformance.title", "Sales Performance")}</h1>
      </div>

      <div className="mb-6">
        <SalesPerformanceFilters
          filters={filters}
          canManageAllSales={canManageAllSales}
          onFiltersChange={setFilters}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Metric label={t("salesPerformance.totalAssignedMerchants", "Assigned Merchants")} value={data?.totalAssignedMerchants ?? 0} />
        <Metric label={t("salesPerformance.activeMerchants", "Active Merchants")} value={data?.activeMerchants ?? 0} />
        <Metric label={t("salesPerformance.merchantsWithPayments", "Merchants With Payments")} value={data?.merchantsWithPayments ?? 0} />
        <Metric label={t("salesPerformance.totalDebtCount", "Debt Count")} value={data?.totalDebtCount ?? 0} />
        <Metric label={t("salesPerformance.totalDebtAmount", "Total Debt Amount")} value={formatSalesAmount(data?.totalDebtAmount)} />
        <Metric label={t("salesPerformance.totalPaidAmount", "Total Paid Amount")} value={formatSalesHalala(data?.totalPaidAmount)} />
        <Metric label={t("salesPerformance.incentiveTier", "Incentive Tier")} value={formatIncentiveTier(data?.incentiveTier)} />
        <Metric label={t("salesPerformance.incentiveAmount", "Incentive Amount")} value={formatSalesAmount(data?.incentiveAmount)} />
      </div>
    </div>
  );
};

export default SalesPerformance;
