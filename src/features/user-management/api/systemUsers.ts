import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { MutationConfig, QueryConfig } from "@/lib/react-query";
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

export interface CreateSystemUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  status?: UserStatus;
  forcePasswordChange?: boolean;
}

export interface UpdateSystemUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  roleId?: number;
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

const languageHeaders = () => ({
  "Accept-Language": getLanguageFromCookie(),
});

export const systemUsersQueryKey = ["system-users"] as const;
export const systemRolesQueryKey = ["system-roles"] as const;

export const getSystemUsers = (params: {
  page: number;
  limit: number;
}): Promise<GetSystemUsersResponse> => {
  return axios.get("/admin/users", {
    params,
    headers: languageHeaders(),
  });
};

export const useGetSystemUsers = ({
  params,
  config,
}: {
  params: Parameters<typeof getSystemUsers>[0];
  config?: QueryConfig<typeof getSystemUsers>;
}) => {
  return useQuery({
    ...config,
    queryKey: [...systemUsersQueryKey, params],
    queryFn: () => getSystemUsers(params),
  });
};

export const getSystemUser = (
  id: number | string,
): Promise<AppApiResponse<SystemUser>> => {
  return axios.get(`/admin/users/${id}`, {
    headers: languageHeaders(),
  });
};

export const useGetSystemUser = ({
  id,
  enabled,
  config,
}: {
  id?: number | string | null;
  enabled?: boolean;
  config?: QueryConfig<typeof getSystemUser>;
}) => {
  return useQuery({
    ...config,
    queryKey: [...systemUsersQueryKey, "detail", id],
    queryFn: () => getSystemUser(id as number | string),
    enabled: Boolean(id) && enabled !== false,
  });
};

export const getSystemRoles = (): Promise<AppApiResponse<SystemRole[]>> => {
  return axios.get("/admin/roles", {
    headers: languageHeaders(),
  });
};

export const useGetSystemRoles = ({
  config,
}: {
  config?: QueryConfig<typeof getSystemRoles>;
} = {}) => {
  return useQuery({
    ...config,
    queryKey: systemRolesQueryKey,
    queryFn: getSystemRoles,
  });
};

export const createSystemUser = (
  data: CreateSystemUserRequest,
): Promise<AppApiResponse<SystemUser>> => {
  return axios.post("/admin/users", data, {
    headers: languageHeaders(),
  });
};

export const useCreateSystemUser = ({
  config,
}: {
  config?: MutationConfig<typeof createSystemUser>;
} = {}) => {
  return useMutation({
    ...config,
    mutationFn: createSystemUser,
  });
};

export const updateSystemUser = ({
  id,
  data,
}: {
  id: number | string;
  data: UpdateSystemUserRequest;
}): Promise<AppApiResponse<SystemUser>> => {
  return axios.patch(`/admin/users/${id}`, data, {
    headers: languageHeaders(),
  });
};

export const useUpdateSystemUser = ({
  config,
}: {
  config?: MutationConfig<typeof updateSystemUser>;
} = {}) => {
  return useMutation({
    ...config,
    mutationFn: updateSystemUser,
  });
};

export const activateSystemUser = (
  id: number | string,
): Promise<AppApiResponse<SystemUser>> => {
  return axios.post(`/admin/users/${id}/activate`, undefined, {
    headers: languageHeaders(),
  });
};

export const deactivateSystemUser = (
  id: number | string,
): Promise<AppApiResponse<SystemUser>> => {
  return axios.post(`/admin/users/${id}/deactivate`, undefined, {
    headers: languageHeaders(),
  });
};

export const unlockSystemUser = (
  id: number | string,
): Promise<AppApiResponse<SystemUser>> => {
  return axios.post(`/admin/users/${id}/unlock`, undefined, {
    headers: languageHeaders(),
  });
};

export const resetSystemUserPassword = ({
  id,
  newPassword,
}: {
  id: number | string;
  newPassword: string;
}): Promise<AppApiResponse<null>> => {
  return axios.post(
    `/admin/users/${id}/reset-password`,
    { newPassword },
    { headers: languageHeaders() },
  );
};

export const deleteSystemUser = (
  id: number | string,
): Promise<AppApiResponse<null>> => {
  return axios.delete(`/admin/users/${id}`, {
    headers: languageHeaders(),
  });
};

export const useActivateSystemUser = ({
  config,
}: {
  config?: MutationConfig<typeof activateSystemUser>;
} = {}) => {
  return useMutation({
    ...config,
    mutationFn: activateSystemUser,
  });
};

export const useDeactivateSystemUser = ({
  config,
}: {
  config?: MutationConfig<typeof deactivateSystemUser>;
} = {}) => {
  return useMutation({
    ...config,
    mutationFn: deactivateSystemUser,
  });
};

export const useUnlockSystemUser = ({
  config,
}: {
  config?: MutationConfig<typeof unlockSystemUser>;
} = {}) => {
  return useMutation({
    ...config,
    mutationFn: unlockSystemUser,
  });
};

export const useResetSystemUserPassword = ({
  config,
}: {
  config?: MutationConfig<typeof resetSystemUserPassword>;
} = {}) => {
  return useMutation({
    ...config,
    mutationFn: resetSystemUserPassword,
  });
};

export const useDeleteSystemUser = ({
  config,
}: {
  config?: MutationConfig<typeof deleteSystemUser>;
} = {}) => {
  return useMutation({
    ...config,
    mutationFn: deleteSystemUser,
  });
};
