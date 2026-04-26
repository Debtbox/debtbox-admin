import { useTranslation } from "react-i18next";
import {
  Users,
  Store,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
  Building2,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetDashboardStats } from "./api/getDashboardStats";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";

const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-12 w-12 bg-gray-200 rounded-lg" />
      <div className="h-4 w-4 bg-gray-200 rounded" />
    </div>
    <div className="space-y-2">
      <div className="h-3.5 bg-gray-200 rounded w-28" />
      <div className="h-8 bg-gray-200 rounded w-20" />
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="mb-6 space-y-2">
      <div className="h-5 bg-gray-200 rounded w-36" />
      <div className="h-3.5 bg-gray-200 rounded w-24" />
    </div>
    <div className="h-[300px] bg-gray-100 rounded-lg flex items-end gap-2 px-4 pb-4">
      {[40, 65, 55, 80, 70, 90].map((h, i) => (
        <div key={i} className="flex-1 bg-gray-200 rounded-t" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

const ApprovalsSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="mb-6 space-y-2">
      <div className="h-5 bg-gray-200 rounded w-36" />
      <div className="h-3.5 bg-gray-200 rounded w-24" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="h-8 w-8 bg-gray-200 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const canViewCustomers = useCan(PERMISSIONS.CUSTOMER_LIST);
  const canViewMerchants = useCan(PERMISSIONS.MERCHANT_LIST);
  const canViewDebts = useCan(PERMISSIONS.DEBT_LIST);
  const { data, isLoading } = useGetDashboardStats({ config: { staleTime: 60_000 } });

  const d = data?.data;

  const stats = [
    {
      name: t("dashboard.totalCustomers", "Total Customers"),
      value: (d?.totalCustomers ?? 0).toLocaleString(),
      icon: Users,
      color: "text-blue-600 bg-blue-50",
      link: "/customers",
      visible: canViewCustomers,
    },
    {
      name: t("dashboard.totalMerchants", "Total Merchants"),
      value: (d?.totalMerchants ?? 0).toLocaleString(),
      icon: Store,
      color: "text-green-600 bg-green-50",
      link: "/merchants",
      visible: canViewMerchants,
    },
    {
      name: t("dashboard.totalTransactions", "Total Transactions"),
      value: (d?.totalTransactions ?? 0).toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
      link: "/debts-management",
      visible: canViewDebts,
    },
    {
      name: t("dashboard.totalRevenue", "Total Revenue"),
      value: `SAR ${((d?.totalRevenueHalala ?? 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-orange-600 bg-orange-50",
      link: "/debts-management",
      visible: canViewDebts,
    },
  ].filter((stat) => stat.visible);

  const chartData = (d?.revenueGrowth ?? []).map((entry) => ({
    month: entry.month,
    revenue: entry.revenueHalala / 100,
    transactions: entry.transactionsCount,
  }));

  const pendingApprovals = d?.pendingApprovals.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("dashboard.title", "Admin Dashboard")}
        </h1>
        <p className="text-gray-600 mt-1">
          {t("dashboard.subtitle", "Overview of your platform statistics and activity")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.name}
                  to={stat.link}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Chart + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ApprovalsSkeleton />
          </>
        ) : (
          <>
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("dashboard.revenueGrowth", "Revenue Growth")}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t("dashboard.last6Months", "Last 6 months")}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    formatter={(value: number) =>
                      `SAR ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("dashboard.pendingApprovals", "Pending Approvals")}
                  </h2>
                  {d?.pendingApprovals.count ? (
                    <p className="text-sm text-gray-600 mt-1">
                      {d.pendingApprovals.count} {t("dashboard.requiresAttention", "requires attention")}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="space-y-3">
                {pendingApprovals.map((item) => {
                  const displayName = item.fullNameEn || item.fullNameAr || item.email || `#${item.id}`;
                  const href = item.entityType === "MERCHANT" ? `/merchants/${item.id}` : `/customers/${item.id}`;
                  const Icon = item.entityType === "MERCHANT" ? Building2 : UserPlus;
                  return (
                    <Link
                      key={`${item.entityType}-${item.id}`}
                      to={href}
                      className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{displayName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Icon className="w-3 h-3" />
                            {item.entityType === "MERCHANT"
                              ? t("dashboard.merchant", "Merchant")
                              : t("dashboard.customer", "Customer")}
                            {" · "}
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {pendingApprovals.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {t("dashboard.noPendingApprovals", "No pending approvals")}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const DashboardRoutes = () => {
  return <Dashboard />;
};
