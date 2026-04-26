import { axios } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { systemUsersQueryKey, type AppApiResponse } from "./getSystemUsers";

export const deleteSystemUser = (
  id: number | string,
): Promise<AppApiResponse<null>> =>
  axios.delete(`/admin/users/${id}`, {
    headers: { "Accept-Language": getLanguageFromCookie() },
  });

type UseDeleteSystemUser = {
  config?: MutationConfig<typeof deleteSystemUser>;
};

export const useDeleteSystemUser = ({ config }: UseDeleteSystemUser = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: deleteSystemUser,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: systemUsersQueryKey });
      config?.onSuccess?.(...args);
    },
  });
};
