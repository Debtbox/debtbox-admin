import { useTranslation } from "react-i18next";
import { FilterBar, type FilterGroupDef } from "@/components/shared/FilterBar";
import { Input } from "@/components/shared/Input";
import { SalesUserSelect } from "./SalesUserSelect";

export interface SalesLeadsFiltersState {
  search: string;
  status: string[];
  leadType: string[];
  source: string[];
  assignedSalesUserId: string;
  crNumber: string;
  startDate: string;
  endDate: string;
}

interface SalesLeadsFiltersProps {
  filters: SalesLeadsFiltersState;
  canManageAllSales: boolean;
  onFiltersChange: (f: SalesLeadsFiltersState) => void;
}

export const SalesLeadsFilters = ({
  filters,
  canManageAllSales,
  onFiltersChange,
}: SalesLeadsFiltersProps) => {
  const { t } = useTranslation();

  const filterGroups: FilterGroupDef[] = [
    {
      key: "status",
      label: t("salesLeads.filters.status", "Status"),
      options: ["NEW", "CONTACTED", "INTERESTED", "CONVERTED", "LOST"].map((status) => ({
        value: status,
        label: t(`salesLeads.statuses.${status}`, status),
      })),
    },
    {
      key: "leadType",
      label: t("salesLeads.filters.leadType", "Lead Type"),
      options: ["MERCHANT", "CUSTOMER"].map((type) => ({
        value: type,
        label: t(`salesLeads.leadTypes.${type}`, type),
      })),
    },
    {
      key: "source",
      label: t("salesLeads.filters.source", "Source"),
      options: ["REFERRAL", "CAMPAIGN", "COLD", "EVENT", "OTHER"].map((source) => ({
        value: source,
        label: t(`salesLeads.sources.${source}`, source),
      })),
    },
  ];

  const filterValues: Record<string, string | string[]> = {
    status: filters.status,
    leadType: filters.leadType,
    source: filters.source,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      status: [],
      leadType: [],
      source: [],
      assignedSalesUserId: "",
      crNumber: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="space-y-3">
      <FilterBar
        searchPlaceholder={t(
          "salesLeads.search",
          "Search by name, email, or phone...",
        )}
        searchValue={filters.search}
        onSearchChange={(value) => onFiltersChange({ ...filters, search: value })}
        filterGroups={filterGroups}
        dateRange={{
          fromKey: "startDate",
          toKey: "endDate",
          label: t("salesLeads.filters.createdDate", "Created Date"),
        }}
        values={filterValues}
        onChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          label={t("salesLeads.filters.crNumber", "CR Number")}
          value={filters.crNumber}
          onChange={(event) =>
            onFiltersChange({ ...filters, crNumber: event.target.value })
          }
        />
        {canManageAllSales && (
          <SalesUserSelect
            label={t("salesLeads.filters.assignedSalesUser", "Sales User")}
            value={filters.assignedSalesUserId}
            onChange={(value) =>
              onFiltersChange({ ...filters, assignedSalesUserId: value })
            }
            allowUnassigned
          />
        )}
      </div>
    </div>
  );
};
