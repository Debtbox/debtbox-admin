import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';

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

type UseRejectManualRegistrationOptions = {
  config?: MutationConfig<typeof rejectManualRegistration>;
};

export const useRejectManualRegistration = ({ config }: UseRejectManualRegistrationOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: rejectManualRegistration,
  });
};