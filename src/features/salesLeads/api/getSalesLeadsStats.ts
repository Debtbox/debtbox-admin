import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export type SalesLeadsStatsData = {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
};

export type GetSalesLeadsStatsResponse = {
  success: boolean;
  message: string;
  data: SalesLeadsStatsData;
};

export const getSalesLeadsStats = (): Promise<GetSalesLeadsStatsResponse> =>
  axios.get("/admin/sales/leads/stats", {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseGetSalesLeadsStats = {
  config?: QueryConfig<typeof getSalesLeadsStats>;
};

export const useGetSalesLeadsStats = ({
  config,
}: UseGetSalesLeadsStats = {}) =>
  useQueryWithCallback({
    ...config,
    queryKey: ["sales-leads-stats"],
    queryFn: getSalesLeadsStats,
  });
