import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { CustomerDetailsDTO } from "@/types/CustomerDTO";

export const getCustomer = (id: number | string): Promise<GetCustomerResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/customers/${id}`, { headers: { "Accept-Language": language } });
};

export type GetCustomerResponse = {
  message: string;
  success: boolean;
  data: CustomerDetailsDTO;
};

type UseGetCustomer = {
  id: number | string;
  config?: QueryConfig<typeof getCustomer>;
  onSuccess?: (data: GetCustomerResponse) => void;
};

export const useGetCustomer = ({ id, config, onSuccess }: UseGetCustomer) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id),
    onSuccess,
  });
};
