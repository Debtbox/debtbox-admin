import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { DebtDTO } from "@/types/DebtDTO";

export const getDebts = (params?: {
  page?: number;
  limit?: number;
  status?: (
    | "pending"
    | "active"
    | "paid"
    | "overdue"
    | "in_arrears"
    | "cancelled"
  )[];
  search?: string;
  merchantId?: number;
  customerId?: number;
  businessId?: number;
  createdFrom?: string;
  createdTo?: string;
  dueFrom?: string;
  dueTo?: string;
  amountMin?: number;
  amountMax?: number;
}): Promise<GetDebtsResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined)
    queryParams.append("limit", params.limit.toString());
  if (params?.status?.length)
    queryParams.append("status", params.status.join(","));

  if (params?.search) queryParams.append("search", params.search);

  if (params?.merchantId !== undefined)
    queryParams.append("merchantId", params.merchantId.toString());
  if (params?.customerId !== undefined)
    queryParams.append("customerId", params.customerId.toString());
  if (params?.businessId !== undefined)
    queryParams.append("businessId", params.businessId.toString());
  if (params?.createdFrom)
    queryParams.append("createdFrom", params.createdFrom);
  if (params?.createdTo) queryParams.append("createdTo", params.createdTo);
  if (params?.dueFrom) queryParams.append("dueFrom", params.dueFrom);
  if (params?.dueTo) queryParams.append("dueTo", params.dueTo);
  if (params?.amountMin !== undefined)
    queryParams.append("amountMin", params.amountMin.toString());
  if (params?.amountMax !== undefined)
    queryParams.append("amountMax", params.amountMax.toString());

  const url = `/admin/debts${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return axios.get(url, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export type GetDebtsResponse = {
  message: string;
  success: boolean;
  data: { data: DebtDTO[]; total: number; page: number; limit: number };
};

type UseGetDebts = {
  params?: {
    page?: number;
    limit?: number;
    status?: (
      | "pending"
      | "active"
      | "paid"
      | "overdue"
      | "in_arrears"
      | "cancelled"
    )[];

    search?: string;
    merchantId?: number;
    customerId?: number;
    businessId?: number;
    createdFrom?: string;
    createdTo?: string;
    dueFrom?: string;
    dueTo?: string;
    amountMin?: number;
    amountMax?: number;
  };
  config?: QueryConfig<typeof getDebts>;
  onSuccess?: (data: GetDebtsResponse) => void;
};

export const useGetDebts = ({ params, config, onSuccess }: UseGetDebts) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["debts", params],
    queryFn: () => getDebts(params),
    onSuccess,
  });
};
