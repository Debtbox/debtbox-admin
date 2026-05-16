import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type { ResendDebtGroupedActionData } from "@/types/GroupedDebtDTO";

export const resendDebtNotification = ({
  id,
}: {
  id: number | string;
}): Promise<ResendDebtNotificationResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/debts/${id}/actions/resend-notifications`, undefined, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type ResendDebtNotificationResponse = {
  message: string;
  success: boolean;
  data: ResendDebtGroupedActionData;
};

type UseResendDebtNotificationOptions = {
  config?: MutationConfig<typeof resendDebtNotification>;
};

export const useResendDebtNotification = ({
  config,
}: UseResendDebtNotificationOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: resendDebtNotification,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ["debts-stats"] });
      config?.onSuccess?.(...args);
    },
  });
};
