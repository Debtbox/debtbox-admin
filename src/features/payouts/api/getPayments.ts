import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { GroupedDebt } from "@/types/GroupedDebtDTO";

export interface PaymentPayoutRef {
  payoutItemId: number;
  payoutId: number;
  payoutStatus: string;
  merchantNetAmountHalala: number;
}

export interface PaymentDTO {
  id: number;
  status: string;
  paymentMethod: string;
  payoutMethod: string;
  grossAmountHalala: number;
  paidAmountHalala: number;
  remainingAmountHalala: number;
  debtboxFeeHalala: number;
  debtboxFeeVatIncluded: boolean;
  providerFeeBaseHalala: number;
  providerFeeVatHalala: number;
  providerFeeTotalHalala: number;
  providerFeeIncludedInDebtboxFee: boolean;
  providerFeeTypeApplied: string;
  providerFeePercentageBpsApplied: number | null;
  providerFeeFixedHalalaApplied: number;
  providerFeeCapHalalaApplied: number | null;
  providerFeeRuleSource: string | null;
  instantPayoutFeesHalala: number;
  merchantVisibleTotalDeductionsHalala: number;
  merchantNetAmountHalala: number;
  paymentBrand: string | null;
  cardCountry: string | null;
  cardIssuerCountry: string | null;
  currency: string;
  paidAt: string | null;
  merchantTransactionId: string | null;
  checkoutId: string | null;
  providerPaymentId: string;
  debt: { id: number; title: string; status: string };
  merchant: { id: number; nameEn: string };
  customer: { id: number; nameEn: string };
  business: { id: number; nameEn: string };
  payouts: PaymentPayoutRef[];
  groupedDebt?: GroupedDebt | null;
}

export type GetPaymentsResponse = {
  message: string;
  success: boolean;
  data: { data: PaymentDTO[]; total: number; page: number; limit: number };
};

export const getPayments = (params?: {
  page?: number;
  limit?: number;
  merchantId?: number;
}): Promise<GetPaymentsResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.merchantId !== undefined) queryParams.append("merchantId", params.merchantId.toString());

  const url = `/admin/payments${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return axios.get(url, { headers: { "Accept-Language": language } });
};

type UseGetPayments = {
  params?: { page?: number; limit?: number; merchantId?: number };
  config?: QueryConfig<typeof getPayments>;
  onSuccess?: (data: GetPaymentsResponse) => void;
};

export const useGetPayments = ({ params, config, onSuccess }: UseGetPayments) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
    onSuccess,
  });
};
