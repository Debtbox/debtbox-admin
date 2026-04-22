import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { DebtDetailsDTO } from "@/types/DebtDTO";

export const getDebt = (id: number | string): Promise<GetDebtResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/debts/${id}`, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type GetDebtResponse = {
  message: string;
  success: boolean;
  data: DebtDetailsDTO;
};

type UseGetDebt = {
  id: number | string;
  config?: QueryConfig<typeof getDebt>;
  onSuccess?: (data: GetDebtResponse) => void;
};

export const useGetDebt = ({ id, config, onSuccess }: UseGetDebt) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["debt", id],
    queryFn: () => getDebt(id),
    onSuccess,
  });
};
