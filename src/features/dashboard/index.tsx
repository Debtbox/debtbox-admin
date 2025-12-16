import { useTranslation } from "react-i18next";
import {
  Users,
  Store,
  TrendingUp,
  DollarSign,
  CheckCircle2,
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

const Dashboard = () => {
  const { t } = useTranslation();

  // Static data
  const stats = [
    {
      name: t("dashboard.totalCustomers", "Total Customers"),
      value: "12,458",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
      link: "/customers",
    },
    {
      name: t("dashboard.totalMerchants", "Total Merchants"),
      value: "3,245",
      change: "+8.2%",
      icon: Store,
      color: "text-green-600 bg-green-50",
      link: "/merchants",
    },
    {
      name: t("dashboard.totalTransactions", "Total Transactions"),
      value: "45,892",
      change: "+15.3%",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
      link: "/money",
    },
    {
      name: t("dashboard.totalRevenue", "Total Revenue"),
      value: "SAR 2.85M",
      change: "+18.7%",
      icon: DollarSign,
      color: "text-orange-600 bg-orange-50",
      link: "/money",
    },
  ];

  const chartData = [
    { month: "Jan", revenue: 125000, users: 8500 },
    { month: "Feb", revenue: 145000, users: 9200 },
    { month: "Mar", revenue: 168000, users: 10100 },
    { month: "Apr", revenue: 189000, users: 11000 },
    { month: "May", revenue: 210000, users: 11800 },
    { month: "Jun", revenue: 235000, users: 12458 },
  ];

  const pendingApprovals = [
    {
      id: "1",
      businessName: "Al-Rashid Trading Co.",
      submittedDate: "2024-01-15",
    },
    {
      id: "2",
      businessName: "Modern Fashion Boutique",
      submittedDate: "2024-01-12",
    },
    {
      id: "3",
      businessName: "Tech Solutions LLC",
      submittedDate: "2024-01-10",
    },
  ];

  const recentActivity = [
    {
      type: "user",
      action: "New user registered",
      time: "2 hours ago",
      icon: UserPlus,
    },
    {
      type: "business",
      action: "Business approval requested",
      time: "4 hours ago",
      icon: Building2,
    },
    {
      type: "transaction",
      action: "Large transaction processed",
      time: "6 hours ago",
      icon: DollarSign,
    },
    {
      type: "approval",
      action: "Business approved",
      time: "1 day ago",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("dashboard.title", "Admin Dashboard")}
        </h1>
        <p className="text-gray-600 mt-1">
          {t(
            "dashboard.subtitle",
            "Overview of your platform statistics and activity"
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center text-xs font-semibold text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t("dashboard.revenueGrowth", "Revenue Growth")}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t("dashboard.last6Months", "Last 6 months")}
              </p>
            </div>
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
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => `SAR ${value.toLocaleString()}`}
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
              <p className="text-sm text-gray-600 mt-1">
                {t("dashboard.requiresAttention", "Requires attention")}
              </p>
            </div>
            <Link
              to="/business-approvals"
              className="text-primary hover:text-primary-dark text-sm font-medium"
            >
              {t("common.viewAll", "View All")}
            </Link>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {approval.businessName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(approval.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {pendingApprovals.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                {t("dashboard.noPendingApprovals", "No pending approvals")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {t("dashboard.recentActivity", "Recent Activity")}
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {t("dashboard.quickActions", "Quick Actions")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/business-approvals"
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <Building2 className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">
                {t("dashboard.reviewApprovals", "Review Approvals")}
              </p>
            </Link>
            <Link
              to="/user-management"
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
            >
              <UserPlus className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">
                {t("dashboard.manageUsers", "Manage Users")}
              </p>
            </Link>
            <Link
              to="/money"
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
            >
              <DollarSign className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">
                {t("dashboard.viewFinancials", "View Financials")}
              </p>
            </Link>
            <Link
              to="/customers"
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            >
              <Users className="w-5 h-5 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">
                {t("dashboard.manageCustomers", "Manage Customers")}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardRoutes = () => {
  return <Dashboard />;
};
