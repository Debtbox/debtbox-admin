import { useTranslation } from "react-i18next";
import { FilterBar, type FilterGroupDef } from "@/components/shared/FilterBar";

export interface SalesLeadsFiltersState {
  search: string;
  status: string[];
  leadType: string[];
  source: string[];
  startDate: string;
  endDate: string;
}

interface SalesLeadsFiltersProps {
  filters: SalesLeadsFiltersState;
  onFiltersChange: (f: SalesLeadsFiltersState) => void;
}

export const SalesLeadsFilters = ({
  filters,
  onFiltersChange,
}: SalesLeadsFiltersProps) => {
  const { t } = useTranslation();

  const statusGroup: FilterGroupDef = {
    key: "status",
    label: t("salesLeads.filters.status", "Status"),
    options: [
      { value: "NEW", label: t("salesLeads.statuses.NEW", "New") },
      {
        value: "CONTACTED",
        label: t("salesLeads.statuses.CONTACTED", "Contacted"),
      },
      {
        value: "INTERESTED",
        label: t("salesLeads.statuses.INTERESTED", "Interested"),
      },
      {
        value: "CONVERTED",
        label: t("salesLeads.statuses.CONVERTED", "Converted"),
      },
      { value: "LOST", label: t("salesLeads.statuses.LOST", "Lost") },
    ],
  };

  const leadTypeGroup: FilterGroupDef = {
    key: "leadType",
    label: t("salesLeads.filters.leadType", "Lead Type"),
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
  };

  const sourceGroup: FilterGroupDef = {
    key: "source",
    label: t("salesLeads.filters.source", "Source"),
    options: [
      {
        value: "REFERRAL",
        label: t("salesLeads.sources.REFERRAL", "Referral"),
      },
      {
        value: "CAMPAIGN",
        label: t("salesLeads.sources.CAMPAIGN", "Campaign"),
      },
      { value: "COLD", label: t("salesLeads.sources.COLD", "Cold") },
      { value: "EVENT", label: t("salesLeads.sources.EVENT", "Event") },
      { value: "OTHER", label: t("salesLeads.sources.OTHER", "Other") },
    ],
  };

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
      startDate: "",
      endDate: "",
    });
  };

  return (
    <FilterBar
      searchPlaceholder={t(
        "salesLeads.search",
        "Search by name, email, or phone...",
      )}
      searchValue={filters.search}
      onSearchChange={(value) => onFiltersChange({ ...filters, search: value })}
      filterGroups={[statusGroup, leadTypeGroup, sourceGroup]}
      dateRange={{
        fromKey: "startDate",
        toKey: "endDate",
        label: t("salesLeads.filters.createdDate", "Created Date"),
      }}
      values={filterValues}
      onChange={handleFilterChange}
      onClearAll={handleClearAll}
    />
  );
};
