import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export type DebtsStatsData = {
  totalDebts: number;
  activeDebts: number;
  overdueDebts: number;
  paidDebts: number;
};

export type GetDebtsStatsResponse = {
  success: boolean;
  message: string;
  data: DebtsStatsData;
};

export const getDebtsStats = (): Promise<GetDebtsStatsResponse> =>
  axios.get("/admin/debts/stats", {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseGetDebtsStats = {
  config?: QueryConfig<typeof getDebtsStats>;
};

export const useGetDebtsStats = ({ config }: UseGetDebtsStats = {}) =>
  useQueryWithCallback({
    ...config,
    queryKey: ["debts-stats"],
    queryFn: getDebtsStats,
  });
