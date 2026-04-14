import { axios } from '@/lib/axios';
import { getLanguageFromCookie } from '@/utils/getLanguageFromCookies';
import type { MerchantDTO } from '@/types/MerchantDTO';
import { useMutation } from '@tanstack/react-query';
import type { MutationConfig } from '@/lib/react-query';

export interface UpdateMerchantRequest {
  status?: 'active' | 'inactive' | 'pending' | 'banned';
  payout_method?: 'weekly' | 'monthly' | 'instant';
  verification_status?: 'pending_nafath' | 'pending_email_verification' | 'pending_admin_approval' | 'approved' | 'rejected';
}

export const updateMerchant = ({
  id,
  data
}: {
  id: number | string;
  data: UpdateMerchantRequest;
}): Promise<UpdateMerchantResponse> => {
  const language = getLanguageFromCookie();
  return axios.patch(`/admin/merchants/${id}`, data, {
    headers: {
      'Accept-Language': language,
    },
  });
};

export type UpdateMerchantResponse = {
  message: string;
  success: boolean;
  data: MerchantDTO;
};

type UseUpdateMerchantOptions = {
  config?: MutationConfig<typeof updateMerchant>;
};

export const useUpdateMerchant = ({ config }: UseUpdateMerchantOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: updateMerchant,
  });
};