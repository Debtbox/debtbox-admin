import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { GetPayoutResponse } from "./getPayout";

export interface MarkSettledRequest {
  amountTransferredHalala: number;
  externalTransferReference: string;
  settlementNote?: string;
  proofFile: File;
}

export const markPayoutSettled = ({
  id,
  data,
}: {
  id: number | string;
  data: MarkSettledRequest;
}): Promise<GetPayoutResponse> => {
  const language = getLanguageFromCookie();
  const formData = new FormData();
  formData.append("amountTransferredHalala", data.amountTransferredHalala.toString());
  formData.append("externalTransferReference", data.externalTransferReference);
  if (data.settlementNote) formData.append("settlementNote", data.settlementNote);
  formData.append("proofReference", data.proofFile);

  // Content-Type must be unset so the browser sets multipart/form-data with the correct boundary.
  // The Axios instance defaults to application/json which would break FormData.
  return axios.post(`/admin/payouts/${id}/mark-settled`, formData, {
    headers: { "Accept-Language": language, "Content-Type": undefined },
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
