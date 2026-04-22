import { useTranslation } from "react-i18next";
import { FilterBar, type FilterGroupDef } from "@/components/shared/FilterBar";

export interface DebtFiltersState {
  search: string;
  status: string[];
  createdFrom: string;
  createdTo: string;
  dueFrom: string;
  dueTo: string;
}

interface DebtFiltersProps {
  filters: DebtFiltersState;
  onFiltersChange: (f: DebtFiltersState) => void;
}

export const DebtFilters = ({ filters, onFiltersChange }: DebtFiltersProps) => {
  const { t } = useTranslation();

  const statusGroup: FilterGroupDef = {
    key: "status",
    label: t("debts.filters.status"),
    options: [
      { value: "pending", label: t("debts.statuses.pending") },
      { value: "active", label: t("debts.statuses.active") },
      { value: "paid", label: t("debts.statuses.paid") },
      { value: "overdue", label: t("debts.statuses.overdue") },
      { value: "in_arrears", label: t("debts.statuses.in_arrears") },
      { value: "cancelled", label: t("debts.statuses.cancelled") },
    ],
  };

  const filterValues: Record<string, string | string[]> = {
    status: filters.status,
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      status: [],
      createdFrom: "",
      createdTo: "",
      dueFrom: "",
      dueTo: "",
    });
  };

  return (
    <div className="space-y-3">
      <FilterBar
        searchPlaceholder={t("debts.search")}
        searchValue={filters.search}
        onSearchChange={(value) => onFiltersChange({ ...filters, search: value })}
        filterGroups={[statusGroup]}
        dateRange={{
          fromKey: "createdFrom",
          toKey: "createdTo",
          label: t("debts.filters.createdDate"),
        }}
        values={filterValues}
        onChange={handleFilterChange}
        onClearAll={handleClearAll}
      />

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
          {t("debts.filters.dueDate")}:
        </span>
        <input
          type="date"
          value={filters.dueFrom}
          max={filters.dueTo || undefined}
          onChange={(e) => onFiltersChange({ ...filters, dueFrom: e.target.value })}
          className="h-8 px-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="text-xs text-gray-400">—</span>
        <input
          type="date"
          value={filters.dueTo}
          min={filters.dueFrom || undefined}
          onChange={(e) => onFiltersChange({ ...filters, dueTo: e.target.value })}
          className="h-8 px-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {(filters.dueFrom || filters.dueTo) && (
          <button
            onClick={() => onFiltersChange({ ...filters, dueFrom: "", dueTo: "" })}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            {t("common.clear", "Clear")}
          </button>
        )}
      </div>
    </div>
  );
};
