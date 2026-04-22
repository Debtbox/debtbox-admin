import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { createMutationHook } from "@/lib/react-query";

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

export const useResendDebtNotification = createMutationHook(resendDebtNotification);
