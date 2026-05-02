import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { DebtFeePreview } from "@/features/recovery/types";

export type GetDebtFeePreviewResponse = {
  message: string;
  success: boolean;
  data: DebtFeePreview;
};

export const getDebtFeePreview = (id: string | number): Promise<GetDebtFeePreviewResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/debts/${id}/fee-preview`, { headers: { "Accept-Language": language } });
};

type UseGetDebtFeePreview = {
  id: string | number;
  config?: QueryConfig<typeof getDebtFeePreview>;
};

export const useGetDebtFeePreview = ({ id, config }: UseGetDebtFeePreview) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["debt-fee-preview", id],
    queryFn: () => getDebtFeePreview(id),
    enabled: !!id,
  });
};
