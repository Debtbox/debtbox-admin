import { useTranslation } from "react-i18next";
import { BarChart3, CheckCircle, CircleDollarSign, Store, Target, Users } from "lucide-react";
import { useSalesDashboard } from "../api/sales";
import { formatSalesAmount } from "../utils";
import { SalesSectionTabs } from "../components";

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4">
    <div className="bg-blue-50 rounded-lg p-3 text-blue-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const SalesDashboard = () => {
  const { t } = useTranslation();
  const dashboardQuery = useSalesDashboard({ staleTime: 60_000 });
  const data = dashboardQuery.data?.data;
  const leadsByStatus = data?.leadsByStatus ?? {};

  return (
    <div className="p-6">
      <SalesSectionTabs />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t("salesDashboard.title", "Sales Dashboard")}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <StatCard label={t("salesDashboard.totalLeads", "Total Leads")} value={data?.totalLeads ?? 0} icon={<Users className="w-6 h-6" />} />
        <StatCard label={t("salesDashboard.assignedLeads", "Assigned Leads")} value={data?.assignedLeads ?? 0} icon={<Target className="w-6 h-6" />} />
        <StatCard label={t("salesDashboard.convertedLeads", "Converted Leads")} value={data?.convertedLeads ?? 0} icon={<CheckCircle className="w-6 h-6" />} />
        <StatCard label={t("salesDashboard.activeMerchants", "Active Merchants")} value={data?.activeMerchants ?? 0} icon={<Store className="w-6 h-6" />} />
        <StatCard label={t("salesDashboard.incentiveTier", "Incentive Tier")} value={data?.incentiveTier ?? "—"} icon={<BarChart3 className="w-6 h-6" />} />
        <StatCard label={t("salesDashboard.incentiveAmount", "Incentive Amount")} value={formatSalesAmount(data?.incentiveAmount)} icon={<CircleDollarSign className="w-6 h-6" />} />
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">{t("salesDashboard.leadsByStatus", "Leads by Status")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {["NEW", "CONTACTED", "INTERESTED", "CONVERTED", "LOST"].map((status) => (
            <div key={status} className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">{t(`salesLeads.statuses.${status}`, status)}</p>
              <p className="text-xl font-semibold text-gray-900">{leadsByStatus[status as keyof typeof leadsByStatus] ?? 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
