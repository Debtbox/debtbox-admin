import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { MerchantPendingApprovalsDTO } from "@/types/MerchantDTO";

export const getMerchantPendingApprovals = (
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
    }
): Promise<GetMerchantPendingApprovalsResponse> => {
    const language = getLanguageFromCookie();
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append("page", params.page.toString());
    if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
    if (params?.status?.length)
        queryParams.append("status", params.status.join(","));
    if (params?.verificationStatus?.length)
        queryParams.append("verificationStatus", params.verificationStatus.join(","));
    if (params?.search) queryParams.append("search", params.search);
    if (params?.createdFrom) queryParams.append("createdFrom", params.createdFrom);
    if (params?.createdTo) queryParams.append("createdTo", params.createdTo);

    const url = `/admin/merchants/pending-manual-approvals${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    return axios.get(url, {
        headers: {
            "Accept-Language": language,
        },
    });
};

export type GetMerchantPendingApprovalsResponse = {
    message: string;
    success: boolean;
    data: { data: MerchantPendingApprovalsDTO[]; total: number; page: number; limit: number };
};

type UseGetMerchantPendingApprovals = {
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
    };
    config?: QueryConfig<typeof getMerchantPendingApprovals>;
    onSuccess?: (data: GetMerchantPendingApprovalsResponse) => void;
};

export const useGetMerchantPendingApprovals = ({
    params,
    config,
    onSuccess,
}: UseGetMerchantPendingApprovals) => {
    return useQueryWithCallback({
        ...config,
        queryKey: ["merchant-pending-approvals", params],
        queryFn: () => getMerchantPendingApprovals(params),
        onSuccess,
    });
};
