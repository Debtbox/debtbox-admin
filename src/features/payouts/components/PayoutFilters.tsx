import { useTranslation } from "react-i18next";
import { FilterBar, type FilterGroupDef } from "@/components/shared/FilterBar";
import { MerchantSelect } from "@/components/shared/MerchantSelect";
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

export const PayoutFilters = ({
  filters,
  onFiltersChange,
}: PayoutFiltersProps) => {
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
    <div className="flex items-end gap-2">
      <MerchantSelect
        value={filters.merchantId}
        onChange={(id) => onFiltersChange({ ...filters, merchantId: id })}
        label={t("payouts.filters.merchant", "Merchant")}
        placeholder={t(
          "payouts.filters.merchantIdPlaceholder",
          "Filter by merchant...",
        )}
        className="flex-1"
      />
      <FilterBar
        filterGroups={[statusGroup]}
        values={filterValues}
        onChange={handleFilterChange}
        onClearAll={handleClearAll}
      />
    </div>
  );
};
