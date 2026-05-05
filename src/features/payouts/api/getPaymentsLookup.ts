import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export interface PaymentLookupItem {
  debtId: number;
  title: string;
  amount: string;
}

export type GetPaymentsLookupResponse = {
  message: string;
  success: boolean;
  data: { data: PaymentLookupItem[]; total: number; page: number; limit: number };
};

export const getPaymentsLookup = (params?: {
  page?: number;
  limit?: number;
  merchantId?: number;
  customerId?: number;
}): Promise<GetPaymentsLookupResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.merchantId !== undefined) queryParams.append("merchantId", params.merchantId.toString());
  if (params?.customerId !== undefined) queryParams.append("customerId", params.customerId.toString());
  const url = `/admin/payments/lookup${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return axios.get(url, { headers: { "Accept-Language": language } });
};

type UseGetPaymentsLookup = {
  params?: { page?: number; limit?: number; merchantId?: number; customerId?: number };
  config?: QueryConfig<typeof getPaymentsLookup>;
};

export const useGetPaymentsLookup = ({ params, config }: UseGetPaymentsLookup = {}) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["payments-lookup", params],
    queryFn: () => getPaymentsLookup(params),
  });
};
