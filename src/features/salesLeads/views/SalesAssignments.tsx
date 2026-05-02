import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";
import { useUserStore } from "@/stores/UserStore";
import {
  CreateSalesAssignmentModal,
  SalesSectionTabs,
  SalesAssignmentsFilters,
  SalesAssignmentsTable,
  type SalesAssignmentsFiltersState,
} from "../components";
import { useDeactivateSalesAssignmentMutation, useListSalesAssignments } from "../api/sales";
import { isSalesAdminRole } from "../utils";

const LIMIT = 10;

const SalesAssignments = () => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const canManageAllSales = isSalesAdminRole(user?.role?.slug);
  const canUpdate = useCan(PERMISSIONS.SALES_ASSIGNMENT_UPDATE);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<SalesAssignmentsFiltersState>({
    entityType: [],
    isActive: [],
    entityId: "",
    salesUserId: "",
    startDate: "",
    endDate: "",
  });

  const handleFiltersChange = (next: SalesAssignmentsFiltersState) => {
    setFilters(next);
    setPage(0);
  };

  const assignmentsQuery = useListSalesAssignments({
    query: {
      page,
      limit: LIMIT,
      salesUserId: canManageAllSales && filters.salesUserId ? Number(filters.salesUserId) : undefined,
      entityType: filters.entityType[0] ? (filters.entityType[0] as "MERCHANT" | "CUSTOMER") : undefined,
      entityId: filters.entityId || undefined,
      isActive: filters.isActive.length === 1 ? filters.isActive[0] === "true" : undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    },
  });

  const deactivateMutation = useDeactivateSalesAssignmentMutation({
    onSuccess: () => toast.success(t("salesAssignments.deactivateSuccess", "Assignment deactivated")),
    onError: (err) => toast.error(err.response?.data?.message ?? t("salesAssignments.deactivateError", "Failed to deactivate assignment")),
  });

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

      <div className="mb-6">
        <SalesAssignmentsFilters
          filters={filters}
          canManageAllSales={canManageAllSales}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <SalesAssignmentsTable
        data={assignmentsQuery.data?.data.assignments ?? []}
        isLoading={assignmentsQuery.isLoading}
        pagination={{ page, limit: LIMIT, total: assignmentsQuery.data?.data.total ?? 0 }}
        canUpdate={canUpdate}
        onPageChange={setPage}
        onDeactivate={(id) => deactivateMutation.mutate(id)}
      />

      {canUpdate && showCreate && <CreateSalesAssignmentModal onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default SalesAssignments;
