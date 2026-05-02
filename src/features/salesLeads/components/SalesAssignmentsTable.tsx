import { PowerOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import Table, { type TableColumn } from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import type { SalesAssignment } from "@/types/SalesLeadDTO";
import { formatSalesDateTime, getSalesUserDisplay } from "../utils";

interface SalesAssignmentsTableProps {
  data: SalesAssignment[];
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  canUpdate: boolean;
  onPageChange: (page: number) => void;
  onDeactivate: (id: string) => void;
}

export const SalesAssignmentsTable = ({
  data,
  isLoading,
  pagination,
  canUpdate,
  onPageChange,
  onDeactivate,
}: SalesAssignmentsTableProps) => {
  const { t } = useTranslation();

  const columns: TableColumn<SalesAssignment>[] = [
    {
      key: "salesUserId",
      title: t("salesAssignments.salesUser", "Sales User"),
      dataIndex: "salesUserId",
      render: (_value, record) => getSalesUserDisplay(record.salesUser, record.salesUserId),
    },
    {
      key: "entityType",
      title: t("salesAssignments.entityType", "Entity Type"),
      dataIndex: "entityType",
    },
    {
      key: "entityId",
      title: t("salesAssignments.entityId", "Entity ID"),
      dataIndex: "entityId",
    },
    {
      key: "assignedAt",
      title: t("salesAssignments.assignedAt", "Assigned At"),
      dataIndex: "assignedAt",
      render: (value) => formatSalesDateTime(value as string),
    },
    {
      key: "isActive",
      title: t("salesAssignments.isActive", "Active"),
      dataIndex: "isActive",
      render: (value) => (value ? t("common.yes", "Yes") : t("common.no", "No")),
    },
    {
      key: "unassignedAt",
      title: t("salesAssignments.unassignedAt", "Unassigned At"),
      dataIndex: "unassignedAt",
      render: (value) => formatSalesDateTime(value as string | null),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={isLoading}
      rowKey="id"
      emptyText={t("salesAssignments.empty", "No sales assignments found")}
      showActions={canUpdate}
      actions={(record) =>
        canUpdate && record.isActive ? (
          <Button variant="ghost" size="sm" onClick={() => onDeactivate(record.id)}>
            <PowerOff className="w-4 h-4" />
          </Button>
        ) : null
      }
      pagination={{
        current: pagination.page + 1,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: (next) => onPageChange(next - 1),
      }}
    />
  );
};
