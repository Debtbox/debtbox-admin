import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { GetPayoutResponse } from "./getPayout";

export interface MarkSettledRequest {
  amountTransferredHalala?: number;
  externalTransferReference?: string;
  settlementNote?: string;
  proofReference?: string;
}

export const markPayoutSettled = ({
  id,
  data,
}: {
  id: number | string;
  data: MarkSettledRequest;
}): Promise<GetPayoutResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/payouts/${id}/mark-settled`, data, {
    headers: { "Accept-Language": language },
  });
};

export const useMarkPayoutSettled = ({
  config,
}: { config?: MutationConfig<typeof markPayoutSettled> } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: markPayoutSettled,
    onSuccess: (...args) => {
      const id = args[1].id;
      void queryClient.invalidateQueries({ queryKey: ["payouts"] });
      void queryClient.invalidateQueries({ queryKey: ["payout", String(id)] });
      config?.onSuccess?.(...args);
    },
  });
};
