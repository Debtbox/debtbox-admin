import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { AppApiResponse, SystemUser } from "./getSystemUsers";

export const getSystemUser = (
  id: number | string,
): Promise<AppApiResponse<SystemUser>> =>
  axios.get(`/admin/users/${id}`, {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseGetSystemUser = {
  id?: number | string | null;
  enabled?: boolean;
  config?: QueryConfig<typeof getSystemUser>;
};

export const useGetSystemUser = ({ id, enabled, config }: UseGetSystemUser) =>
  useQueryWithCallback({
    ...config,
    queryKey: ["system-users", "detail", id],
    queryFn: () => getSystemUser(id as number | string),
    enabled: Boolean(id) && enabled !== false,
  });
