import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGetPayouts } from "../api/getPayouts";
import type { PayoutStatus } from "../utils";
import { PayoutFilters, PayoutsTable, type PayoutFiltersState } from "../components";

const PAYOUTS_PER_PAGE = 10;

const Payouts = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<PayoutFiltersState & { page: number; limit: number }>({
    page: 0,
    limit: PAYOUTS_PER_PAGE,
    status: [],
    merchantId: "",
  });

  const buildParams = useCallback(
    (overrides?: Partial<typeof filters>) => {
      const f = { ...filters, ...overrides };
      const merchantIdNum = f.merchantId ? parseInt(f.merchantId, 10) : undefined;
      return {
        page: f.page,
        limit: f.limit,
        status: f.status.length ? (f.status[0] as PayoutStatus) : undefined,
        merchantId: merchantIdNum && !isNaN(merchantIdNum) ? merchantIdNum : undefined,
      };
    },
    [filters],
  );

  const payoutsQuery = useGetPayouts({ params: buildParams() });

  const handleFiltersChange = (f: PayoutFiltersState) => {
    setFilters((prev) => ({ ...prev, ...f, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{t("payouts.title")}</h1>
        <p className="text-gray-500 text-sm">{t("payouts.subtitle")}</p>
      </div>

      <div className="mb-6">
        <PayoutFilters
          filters={{ status: filters.status, merchantId: filters.merchantId }}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <PayoutsTable
        data={payoutsQuery.data?.data.data ?? []}
        isLoading={payoutsQuery.isLoading}
        pagination={{
          page: payoutsQuery.data?.data.page ?? 0,
          limit: payoutsQuery.data?.data.limit ?? PAYOUTS_PER_PAGE,
          total: payoutsQuery.data?.data.total ?? 0,
        }}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Payouts;
