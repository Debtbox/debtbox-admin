import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export interface DebtLookupItem {
  debtId: number;
  title: string;
  amount: string;
}

export type GetDebtsLookupResponse = {
  message: string;
  success: boolean;
  data: { data: DebtLookupItem[]; total: number; page: number; limit: number };
};

export const getDebtsLookup = (params?: {
  page?: number;
  limit?: number;
  merchantId?: number;
  customerId?: number;
}): Promise<GetDebtsLookupResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.merchantId !== undefined) queryParams.append("merchantId", params.merchantId.toString());
  if (params?.customerId !== undefined) queryParams.append("customerId", params.customerId.toString());
  const url = `/admin/debts/lookup${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return axios.get(url, { headers: { "Accept-Language": language } });
};

type UseGetDebtsLookup = {
  params?: { page?: number; limit?: number; merchantId?: number; customerId?: number };
  config?: QueryConfig<typeof getDebtsLookup>;
};

export const useGetDebtsLookup = ({ params, config }: UseGetDebtsLookup = {}) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["debts-lookup", params],
    queryFn: () => getDebtsLookup(params),
  });
};
