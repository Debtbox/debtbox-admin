import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import {
  systemUsersQueryKey,
  type AppApiResponse,
  type SystemUser,
} from "./getSystemUsers";

export const deactivateSystemUser = (
  id: number | string,
): Promise<AppApiResponse<SystemUser>> =>
  axios.post(`/admin/users/${id}/deactivate`, undefined, {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseDeactivateSystemUser = {
  config?: MutationConfig<typeof deactivateSystemUser>;
};

export const useDeactivateSystemUser = ({
  config,
}: UseDeactivateSystemUser = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: deactivateSystemUser,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: systemUsersQueryKey });
      config?.onSuccess?.(...args);
    },
  });
};
