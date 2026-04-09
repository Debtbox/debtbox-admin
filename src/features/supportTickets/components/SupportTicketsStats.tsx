import { CheckCircle2, Clock, MessageSquare, XCircle } from "lucide-react";
import type { TFunction } from "i18next";

interface SupportTicketsStatsProps {
  stats: {
    total: number;
    open: number;
    resolved: number;
    closed: number;
  };
  t: TFunction;
}

export const SupportTicketsStats = ({ stats, t }: SupportTicketsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("supportTickets.total")}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.total}
            </p>
          </div>
          <MessageSquare className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("supportTickets.open")}
            </p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.open}
            </p>
          </div>
          <Clock className="w-8 h-8 text-orange-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("supportTickets.resolved")}
            </p>
            <p className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {t("supportTickets.closed")}
            </p>
            <p className="text-2xl font-bold text-gray-600">
              {stats.closed}
            </p>
          </div>
          <XCircle className="w-8 h-8 text-gray-600" />
        </div>
      </div>
    </div>
  );
};