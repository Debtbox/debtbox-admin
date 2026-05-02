import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { PaymentDTO } from "./getPayments";

export type GetPaymentResponse = {
  message: string;
  success: boolean;
  data: PaymentDTO;
};

export const getPayment = (id: string | number): Promise<GetPaymentResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/payments/${id}`, { headers: { "Accept-Language": language } });
};

type UseGetPayment = {
  id: string | number;
  config?: QueryConfig<typeof getPayment>;
  onSuccess?: (data: GetPaymentResponse) => void;
};

export const useGetPayment = ({ id, config, onSuccess }: UseGetPayment) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["payment", id],
    queryFn: () => getPayment(id),
    onSuccess,
  });
};
