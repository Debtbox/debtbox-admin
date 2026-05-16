import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { DebtGroupedActionData } from "@/types/GroupedDebtDTO";

export interface ExtendDebtDueDateRequest {
  newDueDate: string;
  reason: string;
}

export const extendDebtDueDate = ({
  id,
  data,
}: {
  id: number | string;
  data: ExtendDebtDueDateRequest;
}): Promise<ExtendDebtDueDateResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/debts/${id}/actions/extend-due-date`, data, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type ExtendDebtDueDateResponse = {
  message: string;
  success: boolean;
  data: DebtGroupedActionData;
};

type UseExtendDebtDueDateOptions = {
  config?: MutationConfig<typeof extendDebtDueDate>;
};

export const useExtendDebtDueDate = ({
  config,
}: UseExtendDebtDueDateOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: extendDebtDueDate,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ["debts-stats"] });
      config?.onSuccess?.(...args);
    },
  });
};
