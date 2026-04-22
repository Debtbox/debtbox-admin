import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import { createMutationHook } from '@/lib/react-query';

export interface ApproveManualRegistrationRequest {
  reviewNote?: string;
}

export const approveManualRegistration = ({
  id,
  data
}: {
  id: number | string;
  data: ApproveManualRegistrationRequest;
}): Promise<ApproveManualRegistrationResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/merchants/${id}/actions/approve-manual-registration`, data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type ApproveManualRegistrationResponse = {
  message: string;
  success: boolean;
  data: null;
};

export const useApproveManualRegistration = createMutationHook(approveManualRegistration);