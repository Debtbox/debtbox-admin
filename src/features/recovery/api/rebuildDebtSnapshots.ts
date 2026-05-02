import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { RecoverySummary } from "../types";

export interface RebuildDebtSnapshotsRequest {
  debtId?: number;
  merchantId?: number;
  from?: string;
  to?: string;
  options: {
    dryRun: boolean;
  };
}

export type RebuildDebtSnapshotsResponse = {
  message: string;
  success: boolean;
  data: RecoverySummary;
};

export const rebuildDebtSnapshots = (
  data: RebuildDebtSnapshotsRequest,
): Promise<RebuildDebtSnapshotsResponse> => {
  const language = getLanguageFromCookie();
  return axios.post("/admin/recovery/debts/fee-snapshot/rebuild", data, {
    headers: { "Accept-Language": language },
  });
};

export const useRebuildDebtSnapshots = ({
  config,
}: { config?: MutationConfig<typeof rebuildDebtSnapshots> } = {}) => {
  return useMutation({
    ...config,
    mutationFn: rebuildDebtSnapshots,
  });
};
