import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import {
  systemUsersQueryKey,
  type AppApiResponse,
  type SystemUser,
  type UserStatus,
} from "./getSystemUsers";

export interface UpdateSystemUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  roleId?: number;
}

export const updateSystemUser = ({
  id,
  data,
}: {
  id: number | string;
  data: UpdateSystemUserRequest;
}): Promise<AppApiResponse<SystemUser>> =>
  axios.patch(`/admin/users/${id}`, data, {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseUpdateSystemUser = {
  config?: MutationConfig<typeof updateSystemUser>;
};

export const useUpdateSystemUser = ({ config }: UseUpdateSystemUser = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: updateSystemUser,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: systemUsersQueryKey });
      config?.onSuccess?.(...args);
    },
  });
};
