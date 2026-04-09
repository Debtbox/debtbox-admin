import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketDTO } from '@/types/SupportTicketDTO';
import type { SupportTicketStatus } from '@/enums';
import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';

export interface ChangeSupportTicketStatusRequest {
  status: SupportTicketStatus;
}

export const changeSupportTicketStatus = ({ id, data }: { id: string; data: ChangeSupportTicketStatusRequest }): Promise<ChangeSupportTicketStatusResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/support/${id}/status`, data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type ChangeSupportTicketStatusResponse = {
  message: string;
  success: boolean;
  data: SupportTicketDTO;
};

type UseChangeSupportTicketStatusOptions = {
  config?: MutationConfig<typeof changeSupportTicketStatus>;
};

export const useChangeSupportTicketStatus = ({ config }: UseChangeSupportTicketStatusOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: changeSupportTicketStatus,
  });
};