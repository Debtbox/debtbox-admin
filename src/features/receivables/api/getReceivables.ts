import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { ReceivableDTO } from "@/types/ReceivableDTO";

export type GetReceivablesResponse = {
  message: string;
  success: boolean;
  data: { data: ReceivableDTO[]; total: number; page: number; limit: number };
};

export const getReceivables = (params?: {
  page?: number;
  limit?: number;
  merchantId?: number;
  status?: string;
}): Promise<GetReceivablesResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.merchantId !== undefined) queryParams.append("merchantId", params.merchantId.toString());
  if (params?.status) queryParams.append("status", params.status);

  const url = `/admin/receivables${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return axios.get(url, { headers: { "Accept-Language": language } });
};

type UseGetReceivables = {
  params?: {
    page?: number;
    limit?: number;
    merchantId?: number;
    status?: string;
  };
  config?: QueryConfig<typeof getReceivables>;
  onSuccess?: (data: GetReceivablesResponse) => void;
};

export const useGetReceivables = ({ params, config, onSuccess }: UseGetReceivables) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["receivables", params],
    queryFn: () => getReceivables(params),
    onSuccess,
  });
};
