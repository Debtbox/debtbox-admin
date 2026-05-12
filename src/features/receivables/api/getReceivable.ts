import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { ReceivableDetailsDTO } from "@/types/ReceivableDTO";

export type GetReceivableResponse = {
  message: string;
  success: boolean;
  data: ReceivableDetailsDTO;
};

export const getReceivable = (id: string): Promise<GetReceivableResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/receivables/${id}`, { headers: { "Accept-Language": language } });
};

type UseGetReceivable = {
  id: string;
  config?: QueryConfig<typeof getReceivable>;
  onSuccess?: (data: GetReceivableResponse) => void;
};

export const useGetReceivable = ({ id, config, onSuccess }: UseGetReceivable) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["receivable", id],
    queryFn: () => getReceivable(id),
    onSuccess,
    enabled: !!id,
  });
};
