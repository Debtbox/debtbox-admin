import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketMessageDTO } from '@/types/SupportTicketDTO';
import { createMutationHook } from '@/lib/react-query';

export interface AddSupportTicketMessageRequest {
  body: string;
  isInternalNote: boolean;
}

export const addSupportTicketMessage = ({ id, data }: { id: string; data: AddSupportTicketMessageRequest }): Promise<AddSupportTicketMessageResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/v0.0.1/api/admin/support/${id}/messages`, data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type AddSupportTicketMessageResponse = {
  message: string;
  success: boolean;
  data: SupportTicketMessageDTO;
};

export const useAddSupportTicketMessage = createMutationHook(addSupportTicketMessage);