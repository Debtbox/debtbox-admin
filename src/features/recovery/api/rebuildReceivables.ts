import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { RecoverySummary } from "../types";

export interface RebuildReceivablesRequest {
  merchantId?: number;
  debtId?: number;
  from?: string;
  to?: string;
  options: {
    dryRun: boolean;
  };
}

export type RebuildReceivablesResponse = {
  message: string;
  success: boolean;
  data: RecoverySummary;
};

export const rebuildReceivables = (
  data: RebuildReceivablesRequest,
): Promise<RebuildReceivablesResponse> => {
  const language = getLanguageFromCookie();
  return axios.post("/admin/recovery/receivables/rebuild", data, {
    headers: { "Accept-Language": language },
  });
};

export const useRebuildReceivables = ({
  config,
}: { config?: MutationConfig<typeof rebuildReceivables> } = {}) => {
  return useMutation({
    ...config,
    mutationFn: rebuildReceivables,
  });
};
