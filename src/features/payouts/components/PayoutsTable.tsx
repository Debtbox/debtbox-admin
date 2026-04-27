import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import Table, { type TableColumn } from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";
import type { PayoutDTO } from "../api/getPayouts";
import { PayoutStatusBadge } from "./PayoutStatusBadge";
import { formatHalala, formatDate } from "../utils";

interface PayoutsTableProps {
  data: PayoutDTO[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export const PayoutsTable = ({ data, isLoading, pagination, onPageChange }: PayoutsTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canRead = useCan(PERMISSIONS.PAYMENT_READ);

  const columns: TableColumn<PayoutDTO>[] = [
    {
      key: "id",
      title: t("payouts.columns.id"),
      dataIndex: "id",
      render: (value) => (
        <span className="text-xs text-gray-500 font-mono">#{value as number}</span>
      ),
    },
    {
      key: "status",
      title: t("payouts.columns.status"),
      dataIndex: "status",
      render: (value) => <PayoutStatusBadge status={value as string} />,
    },
    {
      key: "payoutMethod",
      title: t("payouts.columns.payoutMethod"),
      dataIndex: "payoutMethod",
      render: (value) => (
        <span className="text-sm text-gray-700 capitalize">{value as string}</span>
      ),
    },
    {
      key: "merchant",
      title: t("payouts.columns.merchant"),
      dataIndex: "merchant",
      render: (_, record) => (
        <div>
          <p className="text-sm text-gray-900">{record.merchant.nameEn}</p>
          <p className="text-xs text-gray-400">ID: {record.merchant.id}</p>
        </div>
      ),
    },
    {
      key: "period",
      title: t("payouts.columns.period"),
      dataIndex: "periodStart",
      render: (_, record) => (
        <div className="text-xs text-gray-600">
          <p>{formatDate(record.periodStart)}</p>
          <p className="text-gray-400">→ {formatDate(record.periodEnd)}</p>
        </div>
      ),
    },
    {
      key: "netAmount",
      title: t("payouts.columns.netAmount"),
      dataIndex: "merchantNetAmountHalala",
      render: (value) => (
        <span className="font-semibold text-gray-900">{formatHalala(value as number)}</span>
      ),
    },
    {
      key: "settlementDate",
      title: t("payouts.columns.settlementDate"),
      dataIndex: "manualSettlement",
      render: (_, record) => (
        <span className="text-sm text-gray-600">
          {formatDate(record.manualSettlement?.settledAt) ?? "—"}
        </span>
      ),
    },
  ];

  return (
    <Table<PayoutDTO>
      columns={columns}
      data={data}
      loading={isLoading}
      rowKey="id"
      emptyText={t("payouts.noPayouts")}
      showActions={canRead}
      actions={(record) =>
        canRead ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/payouts/${record.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        ) : null
      }
      pagination={{
        current: pagination.page + 1,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: (page) => onPageChange(page - 1),
      }}
    />
  );
};
