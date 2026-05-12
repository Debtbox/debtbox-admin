import { useTranslation } from "react-i18next";
import { FilterBar } from "@/components/shared/FilterBar";
import { MerchantSelect } from "@/components/shared/MerchantSelect";

interface ReceivablesFiltersState {
  status: string[];
  merchantId: string;
  createdFrom: string;
  createdTo: string;
}

interface ReceivablesFiltersProps {
  filters: ReceivablesFiltersState;
  onChange: (filters: Partial<ReceivablesFiltersState>) => void;
  onClearAll: () => void;
}

export const ReceivablesFilters = ({
  filters,
  onChange,
  onClearAll,
}: ReceivablesFiltersProps) => {
  const { t } = useTranslation();

  const statusOptions = [
    { value: "OPEN", label: t("receivables.statuses.OPEN", "Open") },
    {
      value: "PARTIALLY_SETTLED",
      label: t("receivables.statuses.PARTIALLY_SETTLED", "Partially Settled"),
    },
    { value: "SETTLED", label: t("receivables.statuses.SETTLED", "Settled") },
  ];

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex-1">
        <MerchantSelect
          value={filters.merchantId}
          onChange={(id) => onChange({ merchantId: id })}
          label={t("receivables.filters.merchant", "Merchant")}
        />
      </div>
      <FilterBar
        filterGroups={[
          {
            key: "status",
            label: t("receivables.filters.status", "Status"),
            options: statusOptions,
          },
        ]}
        dateRange={{
          fromKey: "createdFrom",
          toKey: "createdTo",
          label: t("receivables.filters.dateRange", "Created Date"),
        }}
        values={{
          status: filters.status,
          createdFrom: filters.createdFrom,
          createdTo: filters.createdTo,
        }}
        onChange={(key, value) =>
          onChange({ [key]: value } as Partial<ReceivablesFiltersState>)
        }
        onClearAll={onClearAll}
        className="self-end"
      />
    </div>
  );
};
