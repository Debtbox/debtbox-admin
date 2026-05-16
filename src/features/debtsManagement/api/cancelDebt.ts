import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { DebtGroupedActionData } from "@/types/GroupedDebtDTO";

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
  data: DebtGroupedActionData;
};

type UseCancelDebtOptions = {
  config?: MutationConfig<typeof cancelDebt>;
};

export const useCancelDebt = ({
  config,
}: UseCancelDebtOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: cancelDebt,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ["debts-stats"] });
      config?.onSuccess?.(...args);
    },
  });
};
