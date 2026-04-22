import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { createMutationHook } from "@/lib/react-query";

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

export const useExtendDebtDueDate = createMutationHook(extendDebtDueDate);
