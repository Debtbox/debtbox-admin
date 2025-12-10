import { useTranslation } from 'react-i18next';
import { Users, Store, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();

  const stats = [
    {
      name: t('dashboard.totalCustomers', 'Total Customers'),
      value: '0',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: t('dashboard.totalMerchants', 'Total Merchants'),
      value: '0',
      icon: Store,
      color: 'bg-green-500',
    },
    {
      name: t('dashboard.totalTransactions', 'Total Transactions'),
      value: '0',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      name: t('dashboard.totalRevenue', 'Total Revenue'),
      value: 'SAR 0',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.title', 'Admin Dashboard')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('dashboard.subtitle', 'Overview of your platform statistics')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.recentActivity', 'Recent Activity')}
          </h2>
          <p className="text-gray-500 text-center py-8">
            {t('dashboard.noActivity', 'No recent activity')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.quickActions', 'Quick Actions')}
          </h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              {t('dashboard.addCustomer', 'Add New Customer')}
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              {t('dashboard.addMerchant', 'Add New Merchant')}
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              {t('dashboard.viewReports', 'View Reports')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardRoutes = () => {
  return <Dashboard />;
};
