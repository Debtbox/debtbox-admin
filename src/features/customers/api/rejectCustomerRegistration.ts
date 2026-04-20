import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export interface RejectCustomerRegistrationRequest {
  reviewNote: string;
}

export const rejectCustomerRegistration = ({
  id,
  data,
}: {
  id: number | string;
  data: RejectCustomerRegistrationRequest;
}): Promise<RejectCustomerRegistrationResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/customers/${id}/actions/reject-manual-registration`, data, {
    headers: { "Accept-Language": language },
  });
};

export type RejectCustomerRegistrationResponse = {
  message: string;
  success: boolean;
  data: null;
};

type UseRejectCustomerRegistrationOptions = {
  config?: MutationConfig<typeof rejectCustomerRegistration>;
};

export const useRejectCustomerRegistration = ({
  config,
}: UseRejectCustomerRegistrationOptions = {}) => {
  return useMutation({ ...config, mutationFn: rejectCustomerRegistration });
};
