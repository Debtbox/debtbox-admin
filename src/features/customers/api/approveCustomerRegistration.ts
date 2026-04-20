import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export interface ApproveCustomerRegistrationRequest {
  reviewNote?: string;
}

export const approveCustomerRegistration = ({
  id,
  data,
}: {
  id: number | string;
  data: ApproveCustomerRegistrationRequest;
}): Promise<ApproveCustomerRegistrationResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/customers/${id}/actions/approve-manual-registration`, data, {
    headers: { "Accept-Language": language },
  });
};

export type ApproveCustomerRegistrationResponse = {
  message: string;
  success: boolean;
  data: null;
};

type UseApproveCustomerRegistrationOptions = {
  config?: MutationConfig<typeof approveCustomerRegistration>;
};

export const useApproveCustomerRegistration = ({
  config,
}: UseApproveCustomerRegistrationOptions = {}) => {
  return useMutation({ ...config, mutationFn: approveCustomerRegistration });
};
