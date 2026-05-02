import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { RecoverySummary } from "../types";

export interface RecomputePaymentRequest {
  paymentId?: number;
  paymentIds?: number[];
  options: {
    recomputeFees: boolean;
    fixPaidFields: boolean;
    dryRun: boolean;
  };
}

export type RecomputePaymentResponse = {
  message: string;
  success: boolean;
  data: RecoverySummary;
};

export const recomputePayment = (
  data: RecomputePaymentRequest,
): Promise<RecomputePaymentResponse> => {
  const language = getLanguageFromCookie();
  return axios.post("/admin/recovery/payment/recompute", data, {
    headers: { "Accept-Language": language },
  });
};

export const useRecomputePayment = ({
  config,
}: { config?: MutationConfig<typeof recomputePayment> } = {}) => {
  return useMutation({
    ...config,
    mutationFn: recomputePayment,
  });
};
