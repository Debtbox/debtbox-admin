import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { MerchantDTO } from "@/types/MerchantDTO";
import { createMutationHook } from "@/lib/react-query";

export interface UpdateMerchantRequest {
  full_name_ar?: string;
  full_name_en?: string;
  nationality?: string;
  dob?: string;
  gender?: string;
}

export const updateMerchant = ({
  id,
  data,
}: {
  id: number | string;
  data: UpdateMerchantRequest;
}): Promise<UpdateMerchantResponse> => {
  const language = getLanguageFromCookie();
  return axios.patch(`/admin/merchants/${id}`, data, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type UpdateMerchantResponse = {
  message: string;
  success: boolean;
  data: MerchantDTO;
};

export const useUpdateMerchant = createMutationHook(updateMerchant);
