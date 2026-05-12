import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { ReceivableDetailsDTO } from "@/types/ReceivableDTO";

export interface SettleReceivableRequest {
  amountHalala: number;
  externalReference: string;
  settlementNote?: string;
}

export type SettleReceivableResponse = {
  message: string;
  success: boolean;
  data: ReceivableDetailsDTO;
};

export const settleReceivable = ({
  id,
  data,
}: {
  id: string;
  data: SettleReceivableRequest;
}): Promise<SettleReceivableResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/receivables/${id}/settle`, data, {
    headers: { "Accept-Language": language },
  });
};

export const useSettleReceivable = ({
  config,
}: { config?: MutationConfig<typeof settleReceivable> } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: settleReceivable,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ["receivables"] });
      void queryClient.invalidateQueries({ queryKey: ["receivable"] });
      config?.onSuccess?.(...args);
    },
  });
};
