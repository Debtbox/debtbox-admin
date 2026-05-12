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
        const isGrouped = !!record.groupedDebt?.isGrouped;
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
              <GroupedDebtBadge count={record.groupedDebt?.debtsCount} />
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
        const isGrouped = !!record.groupedDebt?.isGrouped;
        return (
          <div>
            <span className="font-medium text-gray-900">
              {formatDebtAmount(value as string)}
            </span>
            {isGrouped && record.groupedDebt && (
              <p className="text-xs text-gray-400">
                {t("groupedDebt.groupTotal", "Group total")}:{" "}
                {formatDebtAmount(record.groupedDebt.groupAmount)}
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
        if (!record.groupedDebt?.isGrouped || !expandedIds.has(record.id)) {
          return null;
        }
        const { debts, debtIds, debtsCount } = record.groupedDebt;
        return (
          <div className="bg-indigo-50/40 -mx-6 px-6 py-3 border-y border-indigo-100">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className="font-semibold uppercase tracking-wide text-indigo-700">
                {t("groupedDebt.childDebts", "Child debts")}
              </span>
              <span className="text-gray-400">·</span>
              <span>
                {t("groupedDebt.includesCount", "Includes {{count}} child debts", {
                  count: debtsCount,
                })}
              </span>
              {debtIds.length > 0 && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="font-mono">
                    {t("groupedDebt.debtIds", "Debt IDs")}: {debtIds.join(", ")}
                  </span>
                </>
              )}
            </div>
            <div className="rounded-lg border border-indigo-100 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-indigo-50/60">
                  <tr>
                    <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {t("debts.columns.id", "ID")}
                    </th>
                    <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {t("debts.columns.title", "Title")}
                    </th>
                    <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {t("debts.columns.amount", "Amount")}
                    </th>
                    <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {t("debts.columns.status", "Status")}
                    </th>
                    <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      {t("debts.columns.dueDate", "Due Date")}
                    </th>
                    <th className="text-right px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50">
                  {debts.map((child) => (
                    <tr key={child.id} className="hover:bg-indigo-50/40">
                      <td className="px-3 py-2 font-mono text-xs text-gray-500">
                        #{child.id}
                      </td>
                      <td className="px-3 py-2 text-gray-800 max-w-[240px] truncate">
                        {child.title ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {child.amount != null ? formatDebtAmount(child.amount) : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {child.status ? (
                          <DebtStatusBadge status={child.status} />
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {child.due_date ? formatDate(child.due_date) : "—"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {canRead && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/debts-management/${child.id}`);
                            }}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            aria-label={t("common.view", "View")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
