import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketDTO } from '@/types/SupportTicketDTO';
import type { SupportTicketPriority, SupportTicketType, RelatedEntityType } from '@/enums';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';

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

type UseUpdateSupportTicketOptions = {
  config?: MutationConfig<typeof updateSupportTicket>;
};

export const useUpdateSupportTicket = ({ config }: UseUpdateSupportTicketOptions = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: updateSupportTicket,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: ["support-stats"] });
      config?.onSuccess?.(...args);
    },
  });
};