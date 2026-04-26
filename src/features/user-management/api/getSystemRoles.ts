import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { AppApiResponse, SystemRole } from "./getSystemUsers";

export const systemRolesQueryKey = ["system-roles"] as const;

export const getSystemRoles = (): Promise<AppApiResponse<SystemRole[]>> =>
  axios.get("/admin/roles", {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseGetSystemRoles = {
  config?: QueryConfig<typeof getSystemRoles>;
};

export const useGetSystemRoles = ({ config }: UseGetSystemRoles = {}) =>
  useQueryWithCallback({
    ...config,
    queryKey: systemRolesQueryKey,
    queryFn: getSystemRoles,
  });
