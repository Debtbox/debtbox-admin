import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { createMutationHook } from "@/lib/react-query";
import type { CustomerDTO } from "@/types/CustomerDTO";

export interface UpdateCustomerRequest {
  full_name_ar?: string;
  full_name_en?: string;
  nationality?: string;
  dob?: string;
  gender?: string;
}

export const updateCustomer = ({
  id,
  data,
}: {
  id: number | string;
  data: UpdateCustomerRequest;
}): Promise<UpdateCustomerResponse> => {
  const language = getLanguageFromCookie();
  return axios.patch(`/admin/customers/${id}`, data, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type UpdateCustomerResponse = {
  message: string;
  success: boolean;
  data: CustomerDTO;
};

export const useUpdateCustomer = createMutationHook(updateCustomer);
