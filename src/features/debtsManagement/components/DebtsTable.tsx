import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, ChevronDown, ChevronRight } from "lucide-react";
import Table, { type TableColumn } from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import { GroupedDebtBadge } from "@/components/shared/GroupedDebtBadge";
import type { DebtDTO } from "@/types/DebtDTO";
import { DebtStatusBadge } from "./DebtStatusBadge";
import { formatDebtAmount, isDebtOverdue } from "../utils";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";

interface DebtsTableProps {
  data: DebtDTO[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export const DebtsTable = ({ data, isLoading, pagination, onPageChange }: DebtsTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canRead = useCan(PERMISSIONS.DEBT_READ);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const columns: TableColumn<DebtDTO>[] = [
    {
      key: "id",
      title: t("debts.columns.id"),
      dataIndex: "id",
      render: (value) => (
        <span className="text-xs text-gray-500 font-mono">#{value as number}</span>
      ),
    },
    {
      key: "title",
      title: t("debts.columns.title"),
      dataIndex: "title",
      render: (value, record) => {
        const isGrouped = (record.debtsCount ?? 0) > 1;
        const isExpanded = expandedIds.has(record.id);
        return (
          <div className="flex flex-col gap-1 max-w-[240px]">
            <div className="flex items-center gap-2">
              {isGrouped && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(record.id);
                  }}
                  className="p-0.5 -ms-1 rounded hover:bg-indigo-100 text-indigo-600"
                  aria-label={t(
                    "groupedDebt.toggleBreakdown",
                    "Toggle breakdown",
                  )}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
              <span className="font-medium text-gray-900 block truncate">
                {value as string}
              </span>
            </div>
            {isGrouped && (
              <GroupedDebtBadge count={record.debtsCount} />
            )}
          </div>
        );
      },
    },
    {
      key: "amount",
      title: t("debts.columns.amount"),
      dataIndex: "amount",
      render: (value, record) => {
        const isGrouped = (record.debtsCount ?? 0) > 1;
        return (
          <div>
            <span className="font-medium text-gray-900">
              {formatDebtAmount(value as string)}
            </span>
            {isGrouped && record.groupAmount != null && (
              <p className="text-xs text-gray-400">
                {t("groupedDebt.groupTotal", "Group total")}:{" "}
                {formatDebtAmount(record.groupAmount)}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      title: t("debts.columns.status"),
      dataIndex: "status",
      render: (value) => <DebtStatusBadge status={value as string} />,
    },
    {
      key: "merchant",
      title: t("debts.columns.merchant"),
      dataIndex: "merchant_full_name_en",
      render: (value, record) => (
        <div>
          <p className="text-sm text-gray-900">{value as string}</p>
          <p className="text-xs text-gray-400">ID: {record.merchant_id}</p>
        </div>
      ),
    },
    {
      key: "customer",
      title: t("debts.columns.customer"),
      dataIndex: "customer_full_name_en",
      render: (value, record) => (
        <div>
          <p className="text-sm text-gray-900">{value as string}</p>
          <p className="text-xs text-gray-400">ID: {record.customer_id}</p>
        </div>
      ),
    },
    {
      key: "dueDate",
      title: t("debts.columns.dueDate"),
      dataIndex: "due_date",
      render: (value, record) => (
        <span
          className={
            isDebtOverdue(value as string, record.status)
              ? "text-red-600 font-medium"
              : "text-gray-900"
          }
        >
          {formatDate(value as string)}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: t("debts.columns.createdAt"),
      dataIndex: "created_at",
      render: (value) => (
        <span className="text-gray-600">{formatDate(value as string)}</span>
      ),
    },
  ];

  return (
    <Table<DebtDTO>
      columns={columns}
      data={data}
      loading={isLoading}
      rowKey="id"
      emptyText={t("debts.noDebts")}
      showActions={canRead}
      actions={(record) => canRead ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/debts-management/${record.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ) : null}
      rowExtra={(record) => {
        const isGrouped = (record.debtsCount ?? 0) > 1;
        if (!isGrouped || !expandedIds.has(record.id)) {
          return null;
        }
        const debts = record.debts ?? [];
        const debtsCount = record.debtsCount ?? 0;
        return (
          <div className="-mx-6 -my-3 bg-linear-to-b from-indigo-50/50 to-white border-t border-indigo-100 pt-3 pb-5">
            <div className="flex items-center gap-2 px-8 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-500">
                {t("groupedDebt.childDebts", "Child debts")}
              </span>
              <span className="inline-flex items-center justify-center text-[10px] font-bold text-indigo-600 bg-indigo-100 rounded-full w-5 h-5">
                {debtsCount}
              </span>
            </div>
            <div className="flex flex-col gap-2 px-8">
              {debts.map((child) => (
                <div
                  key={child.id ?? child.debtId}
                  className="flex items-center gap-4 bg-white rounded-lg ring-1 ring-indigo-100 border-l-4 border-l-indigo-400 px-4 py-3 hover:ring-indigo-200 hover:border-l-indigo-500 hover:shadow-sm transition-all group"
                >
                  <span className="font-mono text-xs text-gray-400 min-w-[52px]">
                    #{child.id ?? child.debtId}
                  </span>
                  <span className="text-sm text-gray-800 flex-1 truncate max-w-[200px]">
                    {child.title ?? "—"}
                  </span>
                  <span className="text-sm font-medium text-gray-700 min-w-20">
                    {child.amount != null
                      ? formatDebtAmount(child.amount as string)
                      : "—"}
                  </span>
                  <div className="min-w-[100px]">
                    {child.status ? (
                      <DebtStatusBadge status={child.status} />
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 min-w-[90px]">
                    {child.due_date ?? child.dueDate
                      ? formatDate((child.due_date ?? child.dueDate)!)
                      : "—"}
                  </span>
                  {child.created_at && (
                    <span className="text-xs text-gray-400 min-w-[90px]">
                      {formatDate(child.created_at)}
                    </span>
                  )}
                  {canRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/debts-management/${child.id}`);
                      }}
                      className="ms-auto opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-7 h-7 rounded-full text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
                      aria-label={t("common.view", "View")}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }}
      pagination={{
        current: pagination.page + 1,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: (page) => onPageChange(page - 1),
      }}
    />
  );
};
