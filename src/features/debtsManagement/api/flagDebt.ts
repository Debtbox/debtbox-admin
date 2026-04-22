import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { createMutationHook } from "@/lib/react-query";

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

export const useFlagDebtForReview = createMutationHook(flagDebtForReview);
