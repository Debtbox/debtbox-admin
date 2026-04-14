import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { MerchantDTO } from "@/types/MerchantDTO";

export const getMerchants = (
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
): Promise<GetMerchantsResponse> => {
    const language = getLanguageFromCookie();
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status?.length)
        queryParams.append("status", params.status.join(","));
    if (params?.verificationStatus?.length)
        queryParams.append("verificationStatus", params.verificationStatus.join(","));
    if (params?.search) queryParams.append("search", params.search);
    if (params?.createdFrom) queryParams.append("createdFrom", params.createdFrom);
    if (params?.createdTo) queryParams.append("createdTo", params.createdTo);

    const url = `/admin/merchants${queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

    return axios.get(url, {
        headers: {
            "Accept-Language": language,
        },
    });
};

export type GetMerchantsResponse = {
    message: string;
    success: boolean;
    data: { data: MerchantDTO[]; total: number; page: number; limit: number };
};

type UseGetMerchants = {
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
    config?: QueryConfig<typeof getMerchants>;
    onSuccess?: (data: GetMerchantsResponse) => void;
};

export const useGetMerchants = ({
    params,
    config,
    onSuccess,
}: UseGetMerchants) => {
    return useQueryWithCallback({
        ...config,
        queryKey: ["merchants", params],
        queryFn: () => getMerchants(params),
        onSuccess,
    });
};
