import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketDTO } from '@/types/SupportTicketDTO';
import type { SupportTicketStatus } from '@/enums';
import { createMutationHook } from '@/lib/react-query';

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

export const useChangeSupportTicketStatus = createMutationHook(changeSupportTicketStatus);