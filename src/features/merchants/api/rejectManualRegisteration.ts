import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import { createMutationHook } from '@/lib/react-query';

export interface RejectManualRegistrationRequest {
  reviewNote: string;
}

export const rejectManualRegistration = ({
  id,
  data
}: {
  id: number | string;
  data: RejectManualRegistrationRequest;
}): Promise<RejectManualRegistrationResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/merchants/${id}/actions/reject-manual-registration`, data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type RejectManualRegistrationResponse = {
  message: string;
  success: boolean;
  data: null;
};

export const useRejectManualRegistration = createMutationHook(rejectManualRegistration);