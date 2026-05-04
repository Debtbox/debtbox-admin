import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { cn } from "@/utils/cn";
import Table, { type TableColumn } from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";
import type { PaymentDTO } from "../api/getPayments";
import { formatHalala, formatDate } from "../utils";

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const colors: Record<string, string> = {
    succeeded: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colors[status] ?? "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {t(`payments.statuses.${status}`, status)}
    </span>
  );
};

const PayoutBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const colors: Record<string, string> = {
    SETTLED: "bg-green-100 text-green-700",
    READY: "bg-blue-100 text-blue-700",
    PARTIALLY_SETTLED: "bg-orange-100 text-orange-700",
    PROCESSING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", colors[status] ?? "bg-gray-100 text-gray-600")}>
      {t(`payouts.statuses.${status}`, status)}
    </span>
  );
};

interface PaymentsTableProps {
  data: PaymentDTO[];
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
}

export const PaymentsTable = ({ data, isLoading, pagination, onPageChange }: PaymentsTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canRead = useCan(PERMISSIONS.PAYMENT_READ);

  const columns: TableColumn<PaymentDTO>[] = [
    {
      key: "id",
      title: t("payments.columns.id"),
      dataIndex: "id",
      render: (value) => (
        <span className="text-xs text-gray-500 font-mono">#{value as number}</span>
      ),
    },
    {
      key: "status",
      title: t("payments.columns.status"),
      dataIndex: "status",
      render: (value) => <PaymentStatusBadge status={value as string} />,
    },
    {
      key: "debt",
      title: t("payments.columns.debt"),
      dataIndex: "debt",
      render: (_, record) => (
        <div>
          <p className="text-sm text-gray-900 max-w-[180px] truncate">{record.debt.title}</p>
          <p className="text-xs text-gray-400">ID: {record.debt.id}</p>
        </div>
      ),
    },
    {
      key: "merchant",
      title: t("payments.columns.merchant"),
      dataIndex: "merchant",
      render: (_, record) => (
        <div>
          <p className="text-sm text-gray-900">{record.merchant.nameEn}</p>
          <p className="text-xs text-gray-400">ID: {record.merchant.id}</p>
        </div>
      ),
    },
    {
      key: "customer",
      title: t("payments.columns.customer"),
      dataIndex: "customer",
      render: (_, record) => (
        <Link
          to={`/customers/${record.customer.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {record.customer.nameEn}
        </Link>
      ),
    },
    {
      key: "grossAmount",
      title: t("payments.columns.grossAmount"),
      dataIndex: "grossAmountHalala",
      render: (value) => (
        <span className="font-medium text-gray-900">{formatHalala(value as number)}</span>
      ),
    },
    {
      key: "deductions",
      title: t("payments.columns.deductions"),
      dataIndex: "merchantVisibleTotalDeductionsHalala",
      render: (value) => (
        <span className="text-red-600 font-medium">-{formatHalala(value as number)}</span>
      ),
    },
    {
      key: "netAmount",
      title: t("payments.columns.netAmount"),
      dataIndex: "merchantNetAmountHalala",
      render: (value) => (
        <span className="text-green-700 font-semibold">{formatHalala(value as number)}</span>
      ),
    },
    {
      key: "method",
      title: t("payments.columns.method"),
      dataIndex: "paymentMethod",
      render: (value, record) => (
        <div>
          <p className="text-sm text-gray-700">{value as string}</p>
          {record.paymentBrand && (
            <p className="text-xs text-gray-400">{record.paymentBrand}</p>
          )}
        </div>
      ),
    },
    {
      key: "payouts",
      title: t("payments.columns.payouts"),
      dataIndex: "payouts",
      render: (_, record) =>
        record.payouts.length > 0 ? (
          <div className="flex flex-col gap-1">
            {record.payouts.map((p) => (
              <div key={p.payoutItemId} className="flex items-center gap-1.5">
                <PayoutBadge status={p.payoutStatus} />
                <span className="text-xs text-gray-400">#{p.payoutId}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      key: "paidAt",
      title: t("payments.columns.paidAt"),
      dataIndex: "paidAt",
      render: (value) => (
        <span className="text-sm text-gray-600">{formatDate(value as string | null) ?? "—"}</span>
      ),
    },
  ];

  return (
    <Table<PaymentDTO>
      columns={columns}
      data={data}
      loading={isLoading}
      rowKey="id"
      emptyText={t("payments.noPayments")}
      onRowClick={(row) => navigate(`/payments/${row.id}`)}
      showActions={canRead}
      actions={(record) =>
        canRead ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/payouts/payments/${record.id}`)}
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
