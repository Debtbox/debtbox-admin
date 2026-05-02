import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { RecoverySummary } from "../types";

export interface RebuildPayoutLedgerRequest {
  paymentId?: number;
  merchantId?: number;
  from?: string;
  to?: string;
  options: {
    dryRun: boolean;
    includeInstantOnly?: boolean;
  };
}

export type RebuildPayoutLedgerResponse = {
  message: string;
  success: boolean;
  data: RecoverySummary;
};

export const rebuildPayoutLedger = (
  data: RebuildPayoutLedgerRequest,
): Promise<RebuildPayoutLedgerResponse> => {
  const language = getLanguageFromCookie();
  return axios.post("/admin/recovery/payout/rebuild", data, {
    headers: { "Accept-Language": language },
  });
};

export const useRebuildPayoutLedger = ({
  config,
}: { config?: MutationConfig<typeof rebuildPayoutLedger> } = {}) => {
  return useMutation({
    ...config,
    mutationFn: rebuildPayoutLedger,
  });
};
