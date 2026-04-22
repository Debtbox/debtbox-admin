import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export const resendDebtNotification = ({
  id,
}: {
  id: number | string;
}): Promise<ResendDebtNotificationResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/debts/${id}/actions/resend-notifications`, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type ResendDebtNotificationResponse = {
  message: string;
  success: boolean;
  data: null;
};

type UseResendDebtNotificationOptions = {
  config?: MutationConfig<typeof resendDebtNotification>;
};

export const useResendDebtNotification = ({
  config,
}: UseResendDebtNotificationOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: resendDebtNotification,
  });
};
