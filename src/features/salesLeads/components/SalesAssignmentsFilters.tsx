import { useTranslation } from "react-i18next";
import { FilterBar, type FilterGroupDef } from "@/components/shared/FilterBar";
import { Input } from "@/components/shared/Input";
import { SalesUserSelect } from "./SalesUserSelect";

export interface SalesAssignmentsFiltersState {
  entityType: string[];
  isActive: string[];
  entityId: string;
  salesUserId: string;
  startDate: string;
  endDate: string;
}

interface SalesAssignmentsFiltersProps {
  filters: SalesAssignmentsFiltersState;
  canManageAllSales: boolean;
  onFiltersChange: (f: SalesAssignmentsFiltersState) => void;
}

export const SalesAssignmentsFilters = ({
  filters,
  canManageAllSales,
  onFiltersChange,
}: SalesAssignmentsFiltersProps) => {
  const { t } = useTranslation();

  const filterGroups: FilterGroupDef[] = [
    {
      key: "entityType",
      label: t("salesAssignments.entityType", "Entity Type"),
      options: [
        {
          value: "MERCHANT",
          label: t("salesLeads.leadTypes.MERCHANT", "Merchant"),
        },
        {
          value: "CUSTOMER",
          label: t("salesLeads.leadTypes.CUSTOMER", "Customer"),
        },
      ],
    },
    {
      key: "isActive",
      label: t("salesAssignments.status", "Status"),
      options: [
        { value: "true", label: t("common.active", "Active") },
        { value: "false", label: t("common.inactive", "Inactive") },
      ],
    },
  ];

  const filterValues: Record<string, string | string[]> = {
    entityType: filters.entityType,
    isActive: filters.isActive,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    onFiltersChange({
      entityType: [],
      isActive: [],
      entityId: "",
      salesUserId: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row items-end md:space-x-4 space-y-3 md:space-y-0">
        <Input
          label={t("salesAssignments.entityId", "Entity ID")}
          value={filters.entityId}
          onChange={(e) =>
            onFiltersChange({ ...filters, entityId: e.target.value })
          }
        />
        {canManageAllSales && (
          <SalesUserSelect
            label={t("salesLeads.filters.assignedSalesUser", "Sales User")}
            value={filters.salesUserId}
            onChange={(value) =>
              onFiltersChange({ ...filters, salesUserId: value })
            }
            allowUnassigned
          />
        )}
        <FilterBar
          filterGroups={filterGroups}
          dateRange={{
            fromKey: "startDate",
            toKey: "endDate",
            label: t("salesAssignments.assignedDate", "Assigned Date"),
          }}
          values={filterValues}
          onChange={handleFilterChange}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
};
