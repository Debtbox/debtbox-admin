import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, PowerOff } from "lucide-react";
import { toast } from "sonner";
import Table, { type TableColumn } from "@/components/shared/Table";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";
import { useUserStore } from "@/stores/UserStore";
import type { SalesAssignment } from "@/types/SalesLeadDTO";
import { CreateSalesAssignmentModal, SalesSectionTabs, SalesUserSelect } from "../components";
import { useDeactivateSalesAssignmentMutation, useListSalesAssignments } from "../api/sales";
import { formatSalesDateTime, getSalesUserDisplay, isSalesAdminRole } from "../utils";

const SalesAssignments = () => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const canManageAllSales = isSalesAdminRole(user?.role?.slug);
  const canUpdate = useCan(PERMISSIONS.SALES_ASSIGNMENT_UPDATE);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    salesUserId: "",
    entityType: "",
    entityId: "",
    isActive: "",
    startDate: "",
    endDate: "",
  });
  const assignmentsQuery = useListSalesAssignments({
    query: {
      page,
      limit: 10,
      salesUserId: canManageAllSales && filters.salesUserId ? Number(filters.salesUserId) : undefined,
      entityType: filters.entityType ? (filters.entityType as "MERCHANT" | "CUSTOMER") : undefined,
      entityId: filters.entityId || undefined,
      isActive: filters.isActive ? filters.isActive === "true" : undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    },
  });
  const deactivateMutation = useDeactivateSalesAssignmentMutation({
    onSuccess: () => toast.success(t("salesAssignments.deactivateSuccess", "Assignment deactivated")),
    onError: (err) => toast.error(err.response?.data?.message ?? t("salesAssignments.deactivateError", "Failed to deactivate assignment")),
  });

  const columns: TableColumn<SalesAssignment>[] = [
    {
      key: "salesUserId",
      title: t("salesAssignments.salesUser", "Sales User"),
      dataIndex: "salesUserId",
      render: (_value, record) => getSalesUserDisplay(record.salesUser, record.salesUserId),
    },
    { key: "entityType", title: t("salesAssignments.entityType", "Entity Type"), dataIndex: "entityType" },
    { key: "entityId", title: t("salesAssignments.entityId", "Entity ID"), dataIndex: "entityId" },
    { key: "assignedAt", title: t("salesAssignments.assignedAt", "Assigned At"), dataIndex: "assignedAt", render: (value) => formatSalesDateTime(value as string) },
    { key: "isActive", title: t("salesAssignments.isActive", "Active"), dataIndex: "isActive", render: (value) => value ? t("common.yes", "Yes") : t("common.no", "No") },
    { key: "unassignedAt", title: t("salesAssignments.unassignedAt", "Unassigned At"), dataIndex: "unassignedAt", render: (value) => formatSalesDateTime(value as string | null) },
  ];

  return (
    <div className="p-6">
      <SalesSectionTabs />
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">{t("salesAssignments.title", "Sales Assignments")}</h1>
        {canUpdate && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 me-2" />
            {t("salesAssignments.create", "Create Assignment")}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {canManageAllSales && (
          <SalesUserSelect value={filters.salesUserId} onChange={(value) => setFilters((prev) => ({ ...prev, salesUserId: value }))} allowUnassigned />
        )}
        <Select
          label={t("salesAssignments.entityType", "Entity Type")}
          value={filters.entityType}
          onChange={(event) => setFilters((prev) => ({ ...prev, entityType: event.target.value }))}
          options={[
            { value: "", label: t("common.all", "All") },
            { value: "MERCHANT", label: t("salesLeads.leadTypes.MERCHANT", "Merchant") },
            { value: "CUSTOMER", label: t("salesLeads.leadTypes.CUSTOMER", "Customer") },
          ]}
        />
        <Input label={t("salesAssignments.entityId", "Entity ID")} value={filters.entityId} onChange={(event) => setFilters((prev) => ({ ...prev, entityId: event.target.value }))} />
        <Select
          label={t("salesAssignments.isActive", "Active")}
          value={filters.isActive}
          onChange={(event) => setFilters((prev) => ({ ...prev, isActive: event.target.value }))}
          options={[
            { value: "", label: t("common.all", "All") },
            { value: "true", label: t("common.yes", "Yes") },
            { value: "false", label: t("common.no", "No") },
          ]}
        />
        <Input label={t("common.from", "From")} type="date" value={filters.startDate} onChange={(event) => setFilters((prev) => ({ ...prev, startDate: event.target.value }))} />
        <Input label={t("common.to", "To")} type="date" value={filters.endDate} onChange={(event) => setFilters((prev) => ({ ...prev, endDate: event.target.value }))} />
      </div>
      <Table
        columns={columns}
        data={assignmentsQuery.data?.data.assignments ?? []}
        loading={assignmentsQuery.isLoading}
        rowKey="id"
        emptyText={t("salesAssignments.empty", "No sales assignments found")}
        showActions={canUpdate}
        actions={(record) => canUpdate && record.isActive ? (
          <Button variant="ghost" size="sm" onClick={() => deactivateMutation.mutate(record.id)}>
            <PowerOff className="w-4 h-4" />
          </Button>
        ) : null}
        pagination={{
          current: page + 1,
          pageSize: 10,
          total: assignmentsQuery.data?.data.total ?? 0,
          onChange: (next) => setPage(next - 1),
        }}
      />
      {canUpdate && showCreate && <CreateSalesAssignmentModal onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default SalesAssignments;
