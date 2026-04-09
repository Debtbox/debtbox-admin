import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketDTO } from '@/types/SupportTicketDTO';
import type { SupportTicketPriority, SupportTicketRequesterType, SupportTicketType } from '@/enums';
import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';

export interface CreateSupportTicketRequest {
  subject: string;
  description: string;
  type: SupportTicketType;
  priority: SupportTicketPriority;
  channel?: string;
  requesterType: SupportTicketRequesterType;
  requesterMerchantId?: number;
  requesterCustomerId?: number;
  relatedEntityType?: string;
  relatedEntityId?: string;
  assigneeUserId?: number;
  assignedTeam?: string;
  tags?: string[];
}

export const createSupportTicket = (data: CreateSupportTicketRequest): Promise<CreateSupportTicketResponse> => {
  const language = getLanguageFromCookie();
  return axios.post('/admin/support', data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type CreateSupportTicketResponse = {
  message: string;
  success: boolean;
  data: SupportTicketDTO;
};

type UseCreateSupportTicketOptions = {
  config?: MutationConfig<typeof createSupportTicket>;
};

export const useCreateSupportTicket = ({ config }: UseCreateSupportTicketOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: createSupportTicket,
  });
};