import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';

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

type UseApproveManualRegistrationOptions = {
  config?: MutationConfig<typeof approveManualRegistration>;
};

export const useApproveManualRegistration = ({ config }: UseApproveManualRegistrationOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: approveManualRegistration,
  });
};