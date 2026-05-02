import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { ReconcileReport } from "../types";

export interface ReconcileRequest {
  merchantId?: number;
  from?: string;
  to?: string;
  options: {
    fixPayments: boolean;
    fixPayouts: boolean;
    fixReceivables: boolean;
    fixDebtFeeSnapshots: boolean;
    dryRun: boolean;
  };
}

export type ReconcileResponse = {
  message: string;
  success: boolean;
  data: ReconcileReport;
};

export const reconcile = (data: ReconcileRequest): Promise<ReconcileResponse> => {
  const language = getLanguageFromCookie();
  return axios.post("/admin/recovery/reconcile", data, {
    headers: { "Accept-Language": language },
  });
};

export const useReconcile = ({
  config,
}: { config?: MutationConfig<typeof reconcile> } = {}) => {
  return useMutation({
    ...config,
    mutationFn: reconcile,
  });
};
