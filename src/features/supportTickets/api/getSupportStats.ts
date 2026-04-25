import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export type SupportStatsData = {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  closedTickets: number;
};

export type GetSupportStatsResponse = {
  success: boolean;
  message: string;
  data: SupportStatsData;
};

export const getSupportStats = (): Promise<GetSupportStatsResponse> =>
  axios.get("/admin/support/stats", {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseGetSupportStats = {
  config?: QueryConfig<typeof getSupportStats>;
};

export const useGetSupportStats = ({ config }: UseGetSupportStats = {}) =>
  useQueryWithCallback({
    ...config,
    queryKey: ["support-stats"],
    queryFn: getSupportStats,
  });
