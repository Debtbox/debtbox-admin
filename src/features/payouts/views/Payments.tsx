import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGetPayments } from "../api/getPayments";
import { PaymentsTable } from "../components/PaymentsTable";
import { MerchantSelect } from "@/components/shared/MerchantSelect";

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

  const handleMerchantChange = (id: string) => {
    setMerchantId(id);
    setPage(0);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{t("payments.title", "Payments")}</h1>
        <p className="text-gray-500 text-sm">{t("payments.subtitle")}</p>
      </div>

      <div className="mb-6">
        <MerchantSelect
          value={merchantId}
          onChange={handleMerchantChange}
          label={t("payouts.filters.merchant", "Merchant")}
          placeholder={t("payouts.filters.merchantIdPlaceholder", "Filter by merchant...")}
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
