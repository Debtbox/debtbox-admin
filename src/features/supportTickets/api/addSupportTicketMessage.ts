import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketMessageDTO } from '@/types/SupportTicketDTO';
import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';

export interface AddSupportTicketMessageRequest {
  body: string;
  isInternalNote: boolean;
}

export const addSupportTicketMessage = ({ id, data }: { id: string; data: AddSupportTicketMessageRequest }): Promise<AddSupportTicketMessageResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/support/${id}/messages`, data, {
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

type UseAddSupportTicketMessageOptions = {
  config?: MutationConfig<typeof addSupportTicketMessage>;
};

export const useAddSupportTicketMessage = ({ config }: UseAddSupportTicketMessageOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: addSupportTicketMessage,
  });
};