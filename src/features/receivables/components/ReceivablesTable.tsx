import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button, Table } from "@/components/shared";
import type { ReceivableDTO } from "@/types/ReceivableDTO";
import { ReceivableStatusBadge } from "./ReceivableStatusBadge";
import { formatHalala, formatDate } from "../utils";

interface ReceivablesTableProps {
  data: ReceivableDTO[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export const ReceivablesTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
}: ReceivablesTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    {
      key: "merchant",
      title: t("receivables.columns.merchant", "Merchant"),
      dataIndex: "merchant",
      render: (_: unknown, record: ReceivableDTO) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {record.merchant.nameEn || record.merchant.nameAr}
          </p>
          <p className="text-xs text-gray-400">
            {record.business.nameEn || record.business.nameAr}
          </p>
        </div>
      ),
    },
    {
      key: "debt",
      title: t("receivables.columns.debt", "Debt"),
      dataIndex: "debt",
      render: (_: unknown, record: ReceivableDTO) => (
        <div>
          <p className="text-sm text-gray-900 max-w-[200px] truncate">{record.debt.title}</p>
          <p className="text-xs text-gray-400">
            {record.debt.customer.nameEn || record.debt.customer.nameAr} · ID: {record.debt.id}
          </p>
        </div>
      ),
    },
    {
      key: "amountTotal",
      title: t("receivables.columns.amountTotal", "Total"),
      dataIndex: "amountTotalHalala",
      render: (_: unknown, record: ReceivableDTO) => (
        <p className="text-sm font-medium text-gray-900">{formatHalala(record.amountTotalHalala)}</p>
      ),
    },
    {
      key: "amountOutstanding",
      title: t("receivables.columns.amountOutstanding", "Outstanding"),
      dataIndex: "amountOutstandingHalala",
      render: (_: unknown, record: ReceivableDTO) => (
        <p className={`text-sm font-medium ${record.amountOutstandingHalala > 0 ? "text-red-600" : "text-gray-400"}`}>
          {formatHalala(record.amountOutstandingHalala)}
        </p>
      ),
    },
    {
      key: "status",
      title: t("receivables.columns.status", "Status"),
      dataIndex: "status",
      render: (_: unknown, record: ReceivableDTO) => (
        <ReceivableStatusBadge status={record.status} />
      ),
    },
    {
      key: "createdAt",
      title: t("receivables.columns.createdAt", "Created At"),
      dataIndex: "createdAt",
      render: (_: unknown, record: ReceivableDTO) => (
        <p className="text-sm text-gray-500">{formatDate(record.createdAt)}</p>
      ),
    },
  ];

  const actions = (record: ReceivableDTO) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(`/receivables/${record.id}`)}
      className="flex items-center gap-1"
    >
      <Eye className="w-4 h-4" />
      {t("common.view", "View")}
    </Button>
  );

  return (
    <Table
      columns={columns}
      data={data}
      loading={isLoading}
      emptyText={t("receivables.noReceivables", "No receivables found")}
      showActions
      actions={actions}
      rowKey="id"
      pagination={{
        current: pagination.page + 1,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: (page) => onPageChange(page - 1),
      }}
    />
  );
};
