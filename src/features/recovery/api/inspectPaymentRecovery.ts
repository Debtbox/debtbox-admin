import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { PaymentInspectResult } from "../types";

export type InspectPaymentRecoveryResponse = {
  message: string;
  success: boolean;
  data: PaymentInspectResult;
};

export const inspectPaymentRecovery = (
  id: string | number,
): Promise<InspectPaymentRecoveryResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/recovery/payment/${id}/inspect`, {
    headers: { "Accept-Language": language },
  });
};

type UseInspectPaymentRecovery = {
  id: string | number | null;
  config?: QueryConfig<typeof inspectPaymentRecovery>;
};

export const useInspectPaymentRecovery = ({ id, config }: UseInspectPaymentRecovery) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["payment-recovery-inspect", id],
    queryFn: () => inspectPaymentRecovery(id!),
    enabled: !!id,
  });
};
