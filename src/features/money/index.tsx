import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, PieChart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Money = () => {
  const { t } = useTranslation();

  // Static data for charts
  const revenueData = [
    { month: 'Jan', revenue: 125000, profit: 45000 },
    { month: 'Feb', revenue: 145000, profit: 52000 },
    { month: 'Mar', revenue: 168000, profit: 61000 },
    { month: 'Apr', revenue: 189000, profit: 68000 },
    { month: 'May', revenue: 210000, profit: 75000 },
    { month: 'Jun', revenue: 235000, profit: 84000 },
    { month: 'Jul', revenue: 258000, profit: 92000 },
    { month: 'Aug', revenue: 275000, profit: 98000 },
    { month: 'Sep', revenue: 290000, profit: 105000 },
    { month: 'Oct', revenue: 310000, profit: 112000 },
    { month: 'Nov', revenue: 335000, profit: 120000 },
    { month: 'Dec', revenue: 360000, profit: 130000 },
  ];

  const categoryData = [
    { name: t('money.categories.transactions', 'Transactions'), value: 45, color: '#3b82f6' },
    { name: t('money.categories.fees', 'Fees'), value: 30, color: '#10b981' },
    { name: t('money.categories.subscriptions', 'Subscriptions'), value: 15, color: '#f59e0b' },
    { name: t('money.categories.other', 'Other'), value: 10, color: '#8b5cf6' },
  ];

  const transactionData = [
    { day: 'Mon', amount: 12500 },
    { day: 'Tue', amount: 18900 },
    { day: 'Wed', amount: 15200 },
    { day: 'Thu', amount: 22100 },
    { day: 'Fri', amount: 19800 },
    { day: 'Sat', amount: 16500 },
    { day: 'Sun', amount: 14200 },
  ];

  const stats = [
    {
      label: t('money.totalRevenue', 'Total Revenue'),
      value: 'SAR 2,850,000',
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-50',
      trend: revenueData[revenueData.length - 1].revenue - revenueData[revenueData.length - 2].revenue,
    },
    {
      label: t('money.totalProfit', 'Total Profit'),
      value: 'SAR 1,035,000',
      change: '+15.2%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
      trend: revenueData[revenueData.length - 1].profit - revenueData[revenueData.length - 2].profit,
    },
    {
      label: t('money.monthlyRevenue', 'Monthly Revenue'),
      value: 'SAR 360,000',
      change: '+8.3%',
      changeType: 'increase' as const,
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-50',
      trend: 30000,
    },
    {
      label: t('money.activeTransactions', 'Active Transactions'),
      value: '1,234',
      change: '+5.1%',
      changeType: 'increase' as const,
      icon: Wallet,
      color: 'text-orange-600 bg-orange-50',
      trend: 64,
    },
  ];

  const recentTransactions = [
    {
      id: '1',
      type: 'payment',
      description: t('money.transactionTypes.payment', 'Payment Received'),
      amount: 12500,
      date: '2024-01-15T10:30:00',
      status: 'completed',
    },
    {
      id: '2',
      type: 'fee',
      description: t('money.transactionTypes.fee', 'Service Fee'),
      amount: -250,
      date: '2024-01-15T09:15:00',
      status: 'completed',
    },
    {
      id: '3',
      type: 'refund',
      description: t('money.transactionTypes.refund', 'Refund Processed'),
      amount: -5000,
      date: '2024-01-14T16:45:00',
      status: 'completed',
    },
    {
      id: '4',
      type: 'payment',
      description: t('money.transactionTypes.payment', 'Payment Received'),
      amount: 18900,
      date: '2024-01-14T14:20:00',
      status: 'completed',
    },
    {
      id: '5',
      type: 'subscription',
      description: t('money.transactionTypes.subscription', 'Subscription Payment'),
      amount: 5000,
      date: '2024-01-13T11:00:00',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('money.title', 'Money & Profits')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('money.subtitle', 'Financial overview and profit analytics')}
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
            {t('money.export', 'Export')}
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light text-sm font-medium">
            {t('money.generateReport', 'Generate Report')}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div
                  className={`flex items-center text-xs font-semibold ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('money.revenueProfit', 'Revenue & Profit')}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('money.last12Months', 'Last 12 months')}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                name={t('money.revenue', 'Revenue')}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                name={t('money.profit', 'Profit')}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('money.revenueByCategory', 'Revenue by Category')}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('money.categoryBreakdown', 'Revenue distribution')}
              </p>
            </div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('money.weeklyTransactions', 'Weekly Transactions')}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('money.thisWeek', 'This week')}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `SAR ${value.toLocaleString()}`}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('money.recentTransactions', 'Recent Transactions')}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('money.latestActivity', 'Latest financial activity')}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.amount > 0
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}SAR {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MoneyRoutes = () => {
  return <Money />;
};


