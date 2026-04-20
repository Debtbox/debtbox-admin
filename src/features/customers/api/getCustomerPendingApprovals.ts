import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { CustomerDTO } from "@/types/CustomerDTO";

export const getCustomerPendingApprovals = (
  params?: {
    page?: number;
    limit?: number;
    status?: ("active" | "inactive" | "pending" | "banned")[];
    verificationStatus?: (
      | "pending_nafath"
      | "pending_email_verification"
      | "pending_admin_approval"
      | "approved"
      | "rejected"
    )[];
    search?: string;
    createdFrom?: string;
    createdTo?: string;
  },
): Promise<GetCustomerPendingApprovalsResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.status?.length) queryParams.append("status", params.status.join(","));
  if (params?.verificationStatus?.length)
    queryParams.append("verificationStatus", params.verificationStatus.join(","));
  if (params?.search) queryParams.append("search", params.search);
  if (params?.createdFrom) queryParams.append("createdFrom", params.createdFrom);
  if (params?.createdTo) queryParams.append("createdTo", params.createdTo);

  const url = `/admin/customers/pending-manual-approvals${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return axios.get(url, { headers: { "Accept-Language": language } });
};

export type GetCustomerPendingApprovalsResponse = {
  message: string;
  success: boolean;
  data: { data: CustomerDTO[]; total: number; page: number; limit: number };
};

type UseGetCustomerPendingApprovals = {
  params?: Parameters<typeof getCustomerPendingApprovals>[0];
  config?: QueryConfig<typeof getCustomerPendingApprovals>;
  onSuccess?: (data: GetCustomerPendingApprovalsResponse) => void;
};

export const useGetCustomerPendingApprovals = ({
  params,
  config,
  onSuccess,
}: UseGetCustomerPendingApprovals) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["customer-pending-approvals", params],
    queryFn: () => getCustomerPendingApprovals(params),
    onSuccess,
  });
};
