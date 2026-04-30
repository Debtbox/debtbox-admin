import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, Edit2, UserPlus, CheckCircle } from "lucide-react";
import Table, { type TableColumn } from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import { cn } from "@/utils/cn";
import type { SalesLead } from "@/types/SalesLeadDTO";
import { SalesLeadStatusBadge } from "./SalesLeadStatusBadge";
import {
  formatSalesDate,
  getLeadTypeColor,
  getSalesUserDisplay,
} from "../utils";

interface SalesLeadsTableProps {
  data: SalesLead[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  canRead: boolean;
  canUpdate: boolean;
  canAssign: boolean;
  onPageChange: (page: number) => void;
  onEdit: (lead: SalesLead) => void;
  onAssign: (lead: SalesLead) => void;
  onConvert: (lead: SalesLead) => void;
}

export const SalesLeadsTable = ({
  data,
  isLoading,
  pagination,
  canRead,
  canUpdate,
  canAssign,
  onPageChange,
  onEdit,
  onAssign,
  onConvert,
}: SalesLeadsTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const columns: TableColumn<SalesLead>[] = [
    {
      key: "fullName",
      title: t("salesLeads.columns.fullName", "Full Name"),
      dataIndex: "fullName",
      render: (value) => (
        <span className="font-medium text-gray-900 max-w-[180px] block truncate">
          {value as string}
        </span>
      ),
    },
    {
      key: "leadType",
      title: t("salesLeads.columns.leadType", "Lead Type"),
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
      key: "phone",
      title: t("salesLeads.columns.phone", "Phone"),
      dataIndex: "phone",
      render: (value) => <span className="text-gray-600">{(value as string | null) ?? "—"}</span>,
    },
    {
      key: "email",
      title: t("salesLeads.columns.email", "Email"),
      dataIndex: "email",
      render: (value) => (
        <span className="text-gray-600 max-w-[160px] block truncate">
          {(value as string | null) ?? "—"}
        </span>
      ),
    },
    {
      key: "crNumber",
      title: t("salesLeads.columns.crNumber", "CR Number"),
      dataIndex: "crNumber",
      render: (value) => <span className="text-gray-600">{(value as string | null) ?? "—"}</span>,
    },
    {
      key: "source",
      title: t("salesLeads.columns.source", "Source"),
      dataIndex: "source",
      render: (value) => (
        <span className="text-sm text-gray-600">
          {t(`salesLeads.sources.${value as string}`, value as string)}
        </span>
      ),
    },
    {
      key: "status",
      title: t("salesLeads.columns.status", "Status"),
      dataIndex: "status",
      render: (value) => <SalesLeadStatusBadge status={value as string} />,
    },
    {
      key: "assignedSalesUserId",
      title: t("salesLeads.columns.assignedTo", "Sales User"),
      dataIndex: "assignedSalesUserId",
      render: (_value, record) => (
        <span className="text-gray-600">
          {getSalesUserDisplay(record.assignedSalesUser, record.assignedSalesUserId)}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: t("salesLeads.columns.createdAt", "Created At"),
      dataIndex: "created_at",
      render: (value) => <span className="text-gray-600">{formatSalesDate(value as string)}</span>,
    },
  ];

  const showActions = canRead || canUpdate || canAssign;

  return (
    <Table<SalesLead>
      columns={columns}
      data={data}
      loading={isLoading}
      rowKey="id"
      emptyText={t("salesLeads.noLeads", "No sales leads found")}
      showActions={showActions}
      actions={(record) => (
        <div className="flex justify-end gap-1">
          {canRead && (
            <Button variant="ghost" size="sm" onClick={() => navigate(`/sales-leads/${record.id}`)}>
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {canUpdate && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(record)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {canAssign && (
            <Button variant="ghost" size="sm" onClick={() => onAssign(record)}>
              <UserPlus className="w-4 h-4" />
            </Button>
          )}
          {canUpdate && record.status !== "CONVERTED" && (
            <Button variant="ghost" size="sm" onClick={() => onConvert(record)}>
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
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
