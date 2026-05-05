import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export interface MerchantDropdownItem {
  id: number;
  full_name_en: string | null;
}

export type GetMerchantsDropdownResponse = {
  message: string;
  success: boolean;
  data: { data: MerchantDropdownItem[]; total: number; page: number; limit: number };
};

export const getMerchantsDropdown = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetMerchantsDropdownResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  const url = `/admin/merchants/dropdown${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return axios.get(url, { headers: { "Accept-Language": language } });
};

type UseGetMerchantsDropdown = {
  params?: { page?: number; limit?: number; search?: string };
  config?: QueryConfig<typeof getMerchantsDropdown>;
};

export const useGetMerchantsDropdown = ({ params, config }: UseGetMerchantsDropdown = {}) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["merchants-dropdown", params],
    queryFn: () => getMerchantsDropdown(params),
  });
};
