import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export type PendingApprovalItem = {
  entityType: "CUSTOMER" | "MERCHANT";
  id: number;
  fullNameAr: string | null;
  fullNameEn: string | null;
  email: string | null;
  createdAt: string;
  verificationStatus: string;
};

export type DashboardStatsData = {
  totalCustomers: number;
  totalMerchants: number;
  totalTransactions: number;
  totalRevenueHalala: number;
  revenueGrowth: {
    month: string;
    revenueHalala: number;
    transactionsCount: number;
  }[];
  pendingApprovals: {
    count: number;
    items: PendingApprovalItem[];
  };
};

export type GetDashboardStatsResponse = {
  success: boolean;
  message: string;
  data: DashboardStatsData;
};

export const getDashboardStats = (): Promise<GetDashboardStatsResponse> =>
  axios.get("/admin/dashboard/stats", {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseGetDashboardStats = {
  config?: QueryConfig<typeof getDashboardStats>;
};

export const useGetDashboardStats = ({ config }: UseGetDashboardStats = {}) =>
  useQueryWithCallback({
    ...config,
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
