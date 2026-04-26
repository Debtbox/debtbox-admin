import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import {
  systemUsersQueryKey,
  type AppApiResponse,
  type SystemUser,
} from "./getSystemUsers";

export const activateSystemUser = (
  id: number | string,
): Promise<AppApiResponse<SystemUser>> =>
  axios.post(`/admin/users/${id}/activate`, undefined, {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseActivateSystemUser = {
  config?: MutationConfig<typeof activateSystemUser>;
};

export const useActivateSystemUser = ({
  config,
}: UseActivateSystemUser = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: activateSystemUser,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: systemUsersQueryKey });
      config?.onSuccess?.(...args);
    },
  });
};
