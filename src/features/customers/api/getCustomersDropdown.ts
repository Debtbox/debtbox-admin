import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";

export interface CustomerDropdownItem {
  id: number;
  full_name_en: string | null;
}

export type GetCustomersDropdownResponse = {
  message: string;
  success: boolean;
  data: { data: CustomerDropdownItem[]; total: number; page: number; limit: number };
};

export const getCustomersDropdown = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetCustomersDropdownResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  const url = `/admin/customers/dropdown${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return axios.get(url, { headers: { "Accept-Language": language } });
};

type UseGetCustomersDropdown = {
  params?: { page?: number; limit?: number; search?: string };
  config?: QueryConfig<typeof getCustomersDropdown>;
};

export const useGetCustomersDropdown = ({ params, config }: UseGetCustomersDropdown = {}) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["customers-dropdown", params],
    queryFn: () => getCustomersDropdown(params),
  });
};
