import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { PayoutDTO } from "./getPayouts";

export type GetPayoutResponse = {
  message: string;
  success: boolean;
  data: PayoutDTO;
};

export const getPayout = (id: string | number): Promise<GetPayoutResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/payouts/${id}`, { headers: { "Accept-Language": language } });
};

type UseGetPayout = {
  id: string | number;
  config?: QueryConfig<typeof getPayout>;
  onSuccess?: (data: GetPayoutResponse) => void;
};

export const useGetPayout = ({ id, config, onSuccess }: UseGetPayout) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["payout", id],
    queryFn: () => getPayout(id),
    onSuccess,
  });
};
