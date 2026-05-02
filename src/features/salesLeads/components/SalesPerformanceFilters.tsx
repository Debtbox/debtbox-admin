import { useTranslation } from "react-i18next";
import { Input } from "@/components/shared/Input";
import { SalesUserSelect } from "./SalesUserSelect";

export interface SalesPerformanceFiltersState {
  month: string;
  salesUserId: string;
}

interface SalesPerformanceFiltersProps {
  filters: SalesPerformanceFiltersState;
  canManageAllSales: boolean;
  onFiltersChange: (f: SalesPerformanceFiltersState) => void;
}

export const SalesPerformanceFilters = ({
  filters,
  canManageAllSales,
  onFiltersChange,
}: SalesPerformanceFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Input
        label={t("salesPerformance.month", "Month")}
        type="month"
        value={filters.month}
        onChange={(e) => onFiltersChange({ ...filters, month: e.target.value })}
      />
      {canManageAllSales && (
        <SalesUserSelect
          label={t("salesLeads.filters.assignedSalesUser", "Sales User")}
          value={filters.salesUserId}
          onChange={(value) => onFiltersChange({ ...filters, salesUserId: value })}
          allowUnassigned
        />
      )}
    </div>
  );
};
