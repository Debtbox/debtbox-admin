import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReceiptText } from "lucide-react";
import { useGetReceivables } from "../api/getReceivables";
import { ReceivablesFilters } from "../components/ReceivablesFilters";
import { ReceivablesTable } from "../components/ReceivablesTable";

interface FiltersState {
  page: number;
  limit: number;
  status: string[];
  merchantId: string;
  createdFrom: string;
  createdTo: string;
}

const DEFAULT_FILTERS: FiltersState = {
  page: 0,
  limit: 20,
  status: [],
  merchantId: "",
  createdFrom: "",
  createdTo: "",
};

const Receivables = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const { data, isLoading } = useGetReceivables({
    params: {
      page: filters.page,
      limit: filters.limit,
      merchantId: filters.merchantId ? parseInt(filters.merchantId) : undefined,
      status: filters.status.length > 0 ? filters.status.join(",") : undefined,
    },
  });

  const receivables = data?.data.data ?? [];
  const total = data?.data.total ?? 0;

  const handleFiltersChange = (partial: Partial<FiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 0 }));
  };

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <ReceiptText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("receivables.title", "Receivables")}
          </h1>
          <p className="text-sm text-gray-500">
            {t(
              "receivables.subtitle",
              "Manage merchant receivables and settlements",
            )}
          </p>
        </div>
      </div>

      <ReceivablesFilters
        filters={filters}
        onChange={handleFiltersChange}
        onClearAll={handleClearAll}
      />

      <ReceivablesTable
        data={receivables}
        isLoading={isLoading}
        pagination={{ page: filters.page, limit: filters.limit, total }}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};

export default Receivables;
