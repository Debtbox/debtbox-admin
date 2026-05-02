import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGetPayments } from "../api/getPayments";
import { PaymentsTable } from "../components/PaymentsTable";
import { FilterBar } from "@/components/shared/FilterBar";

const PAYMENTS_PER_PAGE = 20;

const Payments = () => {
  const { t } = useTranslation();

  const [merchantId, setMerchantId] = useState("");
  const [page, setPage] = useState(0);

  const buildParams = useCallback(() => {
    const merchantIdNum = merchantId ? parseInt(merchantId, 10) : undefined;
    return {
      page,
      limit: PAYMENTS_PER_PAGE,
      merchantId: merchantIdNum && !isNaN(merchantIdNum) ? merchantIdNum : undefined,
    };
  }, [page, merchantId]);

  const paymentsQuery = useGetPayments({ params: buildParams() });

  const handleMerchantIdChange = (value: string) => {
    setMerchantId(value);
    setPage(0);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{t("payments.title", "Payments")}</h1>
        <p className="text-gray-500 text-sm">{t("payments.subtitle")}</p>
      </div>

      <div className="mb-6">
        <FilterBar
          searchPlaceholder={t("payouts.filters.merchantIdPlaceholder")}
          searchValue={merchantId}
          onSearchChange={handleMerchantIdChange}
          values={{}}
          onChange={() => {}}
          onClearAll={() => { setMerchantId(""); setPage(0); }}
        />
      </div>

      <PaymentsTable
        data={paymentsQuery.data?.data.data ?? []}
        isLoading={paymentsQuery.isLoading}
        pagination={{
          page: paymentsQuery.data?.data.page ?? 0,
          limit: paymentsQuery.data?.data.limit ?? PAYMENTS_PER_PAGE,
          total: paymentsQuery.data?.data.total ?? 0,
        }}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Payments;
