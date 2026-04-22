import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { createMutationHook } from "@/lib/react-query";

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

export const useApproveCustomerRegistration = createMutationHook(approveCustomerRegistration);
