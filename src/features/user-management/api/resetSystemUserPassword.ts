import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { AppApiResponse } from "./getSystemUsers";

export const resetSystemUserPassword = ({
  id,
  newPassword,
}: {
  id: number | string;
  newPassword: string;
}): Promise<AppApiResponse<null>> =>
  axios.post(
    `/admin/users/${id}/reset-password`,
    { newPassword },
    { headers: { "Accept-Language": getLanguageFromCookie() } },
  );

type UseResetSystemUserPassword = {
  config?: MutationConfig<typeof resetSystemUserPassword>;
};

export const useResetSystemUserPassword = ({
  config,
}: UseResetSystemUserPassword = {}) =>
  useMutation({
    ...config,
    mutationFn: resetSystemUserPassword,
  });
