import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import {
  systemUsersQueryKey,
  type AppApiResponse,
  type SystemUser,
} from "./getSystemUsers";

export const unlockSystemUser = (
  id: number | string,
): Promise<AppApiResponse<SystemUser>> =>
  axios.post(`/admin/users/${id}/unlock`, undefined, {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseUnlockSystemUser = {
  config?: MutationConfig<typeof unlockSystemUser>;
};

export const useUnlockSystemUser = ({ config }: UseUnlockSystemUser = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: unlockSystemUser,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: systemUsersQueryKey });
      config?.onSuccess?.(...args);
    },
  });
};
