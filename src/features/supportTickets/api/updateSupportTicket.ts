import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketDTO } from '@/types/SupportTicketDTO';
import type { SupportTicketPriority, SupportTicketType, RelatedEntityType } from '@/enums';
import { createMutationHook } from '@/lib/react-query';

export interface UpdateSupportTicketRequest {
  type?: SupportTicketType;
  priority?: SupportTicketPriority;
  tags?: string[];
  relatedEntityType?: RelatedEntityType | null;
  relatedEntityId?: string | null;
}

export const updateSupportTicket = ({ id, data }: { id: string; data: UpdateSupportTicketRequest }): Promise<UpdateSupportTicketResponse> => {
  const language = getLanguageFromCookie();
  return axios.patch(`/admin/support/${id}`, data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type UpdateSupportTicketResponse = {
  message: string;
  success: boolean;
  data: SupportTicketDTO;
};

export const useUpdateSupportTicket = createMutationHook(updateSupportTicket);