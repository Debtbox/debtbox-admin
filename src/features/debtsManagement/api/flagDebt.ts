import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export interface FlagDebtForReviewRequest {
  reason: string;
}

export const flagDebtForReview = ({
  id,
  data,
}: {
  id: number | string;
  data: FlagDebtForReviewRequest;
}): Promise<FlagDebtForReviewResponse> => {
  const language = getLanguageFromCookie();
  return axios.post(`/admin/debts/${id}/actions/flag-review`, data, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type FlagDebtForReviewResponse = {
  message: string;
  success: boolean;
  data: null;
};

type UseFlagDebtForReviewOptions = {
  config?: MutationConfig<typeof flagDebtForReview>;
};

export const useFlagDebtForReview = ({
  config,
}: UseFlagDebtForReviewOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: flagDebtForReview,
  });
};
