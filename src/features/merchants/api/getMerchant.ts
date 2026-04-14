import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { MerchantDTO } from "@/types/MerchantDTO";

export const getMerchant = (
    id: number | string
): Promise<GetMerchantResponse> => {
    const language = getLanguageFromCookie();
    return axios.get(`/admin/merchants/${id}`, {
        headers: {
            "Accept-Language": language,
        },
    });
};

export type GetMerchantResponse = {
    message: string;
    success: boolean;
    data: MerchantDTO;
};

type UseGetMerchant = {
    id: number | string;
    config?: QueryConfig<typeof getMerchant>;
    onSuccess?: (data: GetMerchantResponse) => void;
};

export const useGetMerchant = ({
    id,
    config,
    onSuccess,
}: UseGetMerchant) => {
    return useQueryWithCallback({
        ...config,
        queryKey: ["merchant", id],
        queryFn: () => getMerchant(id),
        onSuccess,
    });
};
