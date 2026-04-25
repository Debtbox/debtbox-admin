import { CreditCard, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import type { TFunction } from "i18next";

interface DebtsStatsProps {
  total: number;
  active: number;
  overdue: number;
  paid: number;
  isLoading?: boolean;
  t: TFunction;
}

const StatCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded w-14" />
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded-full" />
    </div>
  </div>
);

export const DebtsStats = ({ total, active, overdue, paid, isLoading, t }: DebtsStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{t("debts.stats.total")}</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{t("debts.stats.active")}</p>
            <p className="text-2xl font-bold text-blue-600">{active}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{t("debts.stats.overdue")}</p>
            <p className="text-2xl font-bold text-red-600">{overdue}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{t("debts.stats.paid")}</p>
            <p className="text-2xl font-bold text-green-600">{paid}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>
    </div>
  );
};
