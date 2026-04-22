import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export interface CancelDebtRequest {
  reason: string;
}

export const cancelDebt = ({
  id,
  data,
}: {
  id: number | string;
  data: CancelDebtRequest;
}): Promise<CancelDebtResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/debts/${id}/actions/cancel`, data, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type CancelDebtResponse = {
  message: string;
  success: boolean;
  data: null;
};

type UseCancelDebtOptions = {
  config?: MutationConfig<typeof cancelDebt>;
};

export const useCancelDebt = ({
  config,
}: UseCancelDebtOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: cancelDebt,
  });
};
