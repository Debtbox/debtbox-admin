import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

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
  data: null;
};

type UseExtendDebtDueDateOptions = {
  config?: MutationConfig<typeof extendDebtDueDate>;
};

export const useExtendDebtDueDate = ({
  config,
}: UseExtendDebtDueDateOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: extendDebtDueDate,
  });
};
