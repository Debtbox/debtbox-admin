import { CreditCard, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import type { TFunction } from "i18next";

interface DebtsStatsProps {
  total: number;
  active: number;
  overdue: number;
  inArrears: number;
  t: TFunction;
}

export const DebtsStats = ({ total, active, overdue, inArrears, t }: DebtsStatsProps) => {
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
            <p className="text-sm font-medium text-gray-600">{t("debts.stats.inArrears")}</p>
            <p className="text-2xl font-bold text-orange-600">{inArrears}</p>
          </div>
          <Clock className="w-8 h-8 text-orange-600" />
        </div>
      </div>
    </div>
  );
};
