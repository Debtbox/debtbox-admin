import { axios } from '@/lib/axios';
import { useQueryWithCallback, type UseQueryWithCallbackOptions } from '@/lib/hooks/useQueryWithCallback';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketDetailsResponse } from '@/types/SupportTicketDTO';

export const getSupportTicketDetails = (id: string): Promise<SupportTicketDetailsResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/support/${id}`, {
    headers: {
      'Accept-Language': language,
    },
  });
};

type UseGetSupportTicketDetailsOptions = {
  id: string;
  config?: UseQueryWithCallbackOptions<SupportTicketDetailsResponse>;
};

export const useGetSupportTicketDetails = ({ id, config }: UseGetSupportTicketDetailsOptions) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ['support-ticket-details', id],
    queryFn: () => getSupportTicketDetails(id),
  });
};