import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | string;

export interface SystemRole {
  id: number;
  userType?: string;
  name: string;
  slug: string;
  description?: string | null;
  is_system_role?: boolean;
  permissions?: unknown[];
}

export interface SystemUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: UserStatus;
  role?: SystemRole | null;
  mfa_enabled?: boolean;
  force_password_change?: boolean;
  last_login_at?: string | null;
  password_changed_at?: string | null;
  locked_until?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type AppApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type GetSystemUsersResponse = AppApiResponse<{
  users: SystemUser[];
  total: number;
}>;

export const systemUsersQueryKey = ["system-users"] as const;

export const getSystemUsers = (params: {
  page: number;
  limit: number;
}): Promise<GetSystemUsersResponse> =>
  axios.get("/admin/users", {
    params,
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseGetSystemUsers = {
  params: Parameters<typeof getSystemUsers>[0];
  config?: QueryConfig<typeof getSystemUsers>;
  onSuccess?: (data: GetSystemUsersResponse) => void;
};

export const useGetSystemUsers = ({
  params,
  config,
  onSuccess,
}: UseGetSystemUsers) =>
  useQueryWithCallback({
    ...config,
    queryKey: [...systemUsersQueryKey, params],
    queryFn: () => getSystemUsers(params),
    onSuccess,
  });
