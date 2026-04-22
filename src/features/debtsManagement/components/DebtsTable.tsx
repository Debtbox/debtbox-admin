import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import Table, { type TableColumn } from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import type { DebtDTO } from "@/types/DebtDTO";
import { DebtStatusBadge } from "./DebtStatusBadge";
import { formatDebtAmount, isDebtOverdue } from "../utils";

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
      render: (value) => (
        <span className="font-medium text-gray-900 max-w-[200px] block truncate">
          {value as string}
        </span>
      ),
    },
    {
      key: "amount",
      title: t("debts.columns.amount"),
      dataIndex: "amount",
      render: (value) => (
        <span className="font-medium text-gray-900">{formatDebtAmount(value as string)}</span>
      ),
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
      showActions
      actions={(record) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/debts-management/${record.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      )}
      pagination={{
        current: pagination.page + 1,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: (page) => onPageChange(page - 1),
      }}
    />
  );
};
