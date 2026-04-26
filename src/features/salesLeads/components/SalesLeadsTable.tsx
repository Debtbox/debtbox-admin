import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";
import Table, { type TableColumn } from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import { cn } from "@/utils/cn";
import type { SalesLeadDTO } from "@/types/SalesLeadDTO";
import { SalesLeadStatusBadge } from "./SalesLeadStatusBadge";
import { getLeadTypeColor } from "../utils";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";

interface SalesLeadsTableProps {
  data: SalesLeadDTO[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export const SalesLeadsTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
}: SalesLeadsTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canRead = useCan(PERMISSIONS.SALES_LEAD_READ);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const columns: TableColumn<SalesLeadDTO>[] = [
    {
      key: "id",
      title: t("salesLeads.columns.id"),
      dataIndex: "id",
      render: (value) => (
        <span className="text-xs text-gray-500 font-mono">
          {(value as string).slice(0, 8)}…
        </span>
      ),
    },
    {
      key: "fullName",
      title: t("salesLeads.columns.fullName"),
      dataIndex: "fullName",
      render: (value) => (
        <span className="font-medium text-gray-900 max-w-[180px] block truncate">
          {value as string}
        </span>
      ),
    },
    {
      key: "leadType",
      title: t("salesLeads.columns.leadType"),
      dataIndex: "leadType",
      render: (value) => (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getLeadTypeColor(value as string),
          )}
        >
          {t(`salesLeads.leadTypes.${value as string}`, value as string)}
        </span>
      ),
    },
    {
      key: "status",
      title: t("salesLeads.columns.status"),
      dataIndex: "status",
      render: (value) => <SalesLeadStatusBadge status={value as string} />,
    },
    {
      key: "source",
      title: t("salesLeads.columns.source"),
      dataIndex: "source",
      render: (value) => (
        <span className="text-sm text-gray-600">
          {t(`salesLeads.sources.${value as string}`, value as string)}
        </span>
      ),
    },
    {
      key: "phone",
      title: t("salesLeads.columns.phone"),
      dataIndex: "phone",
      render: (value) => (
        <span className="text-sm text-gray-600">
          {(value as string | null) ?? "—"}
        </span>
      ),
    },
    {
      key: "email",
      title: t("salesLeads.columns.email"),
      dataIndex: "email",
      render: (value) => (
        <span className="text-sm text-gray-600 max-w-[160px] block truncate">
          {(value as string | null) ?? "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: t("salesLeads.columns.createdAt"),
      dataIndex: "created_at",
      render: (value) => (
        <span className="text-gray-600">{formatDate(value as string)}</span>
      ),
    },
  ];

  return (
    <Table<SalesLeadDTO>
      columns={columns}
      data={data}
      loading={isLoading}
      rowKey="id"
      emptyText={t("salesLeads.noLeads", "No sales leads found")}
      showActions={canRead}
      actions={(record) => canRead ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/sales-leads/${record.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ) : null}
      pagination={{
        current: pagination.page + 1,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: (page) => onPageChange(page - 1),
      }}
    />
  );
};
