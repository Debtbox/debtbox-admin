import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { PayoutStatus } from "../utils";
import type { GroupedDebt } from "@/types/GroupedDebtDTO";

export interface PayoutItem {
  id: number;
  paymentId: number;
  paymentStatus: string;
  debt: {
    id: number;
    title: string;
    totalAmount: string;
  };
  merchantNetAmountHalala: number;
  debtboxFeeHalala: number;
  providerFeeTotalHalala: number;
  providerFeeIncludedInDebtboxFee: boolean;
  providerFeeTypeApplied: string;
  groupedDebt?: GroupedDebt | null;
}

export interface ManualSettlement {
  settledAt: string | null;
  settledByUserId: number | null;
  amountTransferredHalala: number | null;
  externalTransferReference: string | null;
  settlementNote: string | null;
  proofReference: string | null;
  proofPreviewUrl: string | null;
  proofDownloadUrl: string | null;
}

export interface PayoutDTO {
  id: number;
  status: PayoutStatus;
  payoutMethod: string;
  periodStart: string;
  periodEnd: string;
  merchantNetAmountHalala: number;
  merchant: {
    id: number;
    nameEn: string;
  };
  manualSettlement: ManualSettlement;
  items: PayoutItem[];
  receivableOffsets: unknown[];
}

export type GetPayoutsResponse = {
  message: string;
  success: boolean;
  data: { data: PayoutDTO[]; total: number; page: number; limit: number };
};

export const getPayouts = (params?: {
  page?: number;
  limit?: number;
  merchantId?: number;
  status?: PayoutStatus;
}): Promise<GetPayoutsResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.merchantId !== undefined) queryParams.append("merchantId", params.merchantId.toString());
  if (params?.status) queryParams.append("status", params.status);

  const url = `/admin/payouts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return axios.get(url, { headers: { "Accept-Language": language } });
};

type UseGetPayouts = {
  params?: {
    page?: number;
    limit?: number;
    merchantId?: number;
    status?: PayoutStatus;
  };
  config?: QueryConfig<typeof getPayouts>;
  onSuccess?: (data: GetPayoutsResponse) => void;
};

export const useGetPayouts = ({ params, config, onSuccess }: UseGetPayouts) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["payouts", params],
    queryFn: () => getPayouts(params),
    onSuccess,
  });
};
