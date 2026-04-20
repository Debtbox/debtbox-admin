import { axios } from '@/lib/axios';
import type { QueryConfig } from '@/lib/react-query';
import { useQueryWithCallback } from '@/lib/hooks/useQueryWithCallback';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { SupportTicketDTO } from '@/types/SupportTicketDTO';

export const getSupportTickets = (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string[];
    priority?: string[];
    type?: string[];
    requesterType?: string[];
  }
): Promise<GetSupportTicketsResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search.toString());

  // Add filter arrays
  if (params?.status?.length) queryParams.append('status', params.status.join(','));
  if (params?.priority?.length) queryParams.append('priority', params.priority.join(','));
  if (params?.type?.length) queryParams.append('type', params.type.join(','));
  if (params?.requesterType?.length) queryParams.append('requesterType', params.requesterType.join(','));

  const url = `/admin/support${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  return axios.get(url, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type GetSupportTicketsResponse = {
  message: string;
  success: boolean;
  data: {tickets: SupportTicketDTO[] , total: number};
};

type UseGetSupportTickets = {
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string[];
    priority?: string[];
    type?: string[];
    requesterType?: string[];
  };
  config?: QueryConfig<typeof getSupportTickets>;
  onSuccess?: (data: GetSupportTicketsResponse) => void;
};

export const useGetSupportTickets = ({
  params,
  config,
  onSuccess,
}: UseGetSupportTickets) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ['support-tickets', params],
    queryFn: () => getSupportTickets(params),
    onSuccess,
  });
};
