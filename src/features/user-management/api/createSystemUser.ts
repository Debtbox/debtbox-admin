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

export const createSystemUser = (
  data: CreateSystemUserRequest,
): Promise<AppApiResponse<SystemUser>> =>
  axios.post("/admin/users", data, {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseCreateSystemUser = {
  config?: MutationConfig<typeof createSystemUser>;
};

export const useCreateSystemUser = ({ config }: UseCreateSystemUser = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: createSystemUser,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: systemUsersQueryKey });
      config?.onSuccess?.(...args);
    },
  });
};
