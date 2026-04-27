import { useTranslation } from "react-i18next";
import { FilterBar, type FilterGroupDef } from "@/components/shared/FilterBar";
import type { PayoutStatus } from "../utils";

const PAYOUT_STATUSES: PayoutStatus[] = [
  "DRAFT",
  "READY",
  "PROCESSING",
  "PAID",
  "SETTLED",
  "PARTIALLY_SETTLED",
  "FAILED",
];

export interface PayoutFiltersState {
  status: string[];
  merchantId: string;
}

interface PayoutFiltersProps {
  filters: PayoutFiltersState;
  onFiltersChange: (f: PayoutFiltersState) => void;
}

export const PayoutFilters = ({ filters, onFiltersChange }: PayoutFiltersProps) => {
  const { t } = useTranslation();

  const statusGroup: FilterGroupDef = {
    key: "status",
    label: t("payouts.filters.status"),
    options: PAYOUT_STATUSES.map((s) => ({
      value: s,
      label: t(`payouts.statuses.${s}`, s),
    })),
  };

  const filterValues: Record<string, string | string[]> = {
    status: filters.status,
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleClearAll = () => {
    onFiltersChange({ status: [], merchantId: "" });
  };

  return (
    <FilterBar
      searchPlaceholder={t("payouts.filters.merchantIdPlaceholder")}
      searchValue={filters.merchantId}
      onSearchChange={(value) => onFiltersChange({ ...filters, merchantId: value })}
      filterGroups={[statusGroup]}
      values={filterValues}
      onChange={handleFilterChange}
      onClearAll={handleClearAll}
    />
  );
};
