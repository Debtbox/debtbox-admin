import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type {
  SalesLeadDTO,
  LeadStatus,
  LeadSource,
  LeadType,
} from "@/types/SalesLeadDTO";

export const getSalesLeads = (params?: {
  page?: number;
  limit?: number;
  status?: LeadStatus[];
  leadType?: LeadType[];
  source?: LeadSource[];
  assignedSalesUserId?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}): Promise<GetSalesLeadsResponse> => {
  const language = getLanguageFromCookie();
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params?.limit !== undefined)
    queryParams.append("limit", params.limit.toString());
  if (params?.status?.length)
    queryParams.append("status", params.status.join(","));
  if (params?.leadType?.length)
    queryParams.append("leadType", params.leadType.join(","));
  if (params?.source?.length)
    queryParams.append("source", params.source.join(","));
  if (params?.assignedSalesUserId !== undefined)
    queryParams.append(
      "assignedSalesUserId",
      params.assignedSalesUserId.toString(),
    );
  if (params?.search) queryParams.append("search", params.search);
  if (params?.startDate) queryParams.append("startDate", params.startDate);
  if (params?.endDate) queryParams.append("endDate", params.endDate);

  const url = `/admin/sales/leads${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  return axios.get(url, {
    headers: { "Accept-Language": language },
  });
};

export type GetSalesLeadsResponse = {
  message: string;
  success: boolean;
  data: { leads: SalesLeadDTO[]; total: number };
};

type UseGetSalesLeads = {
  params?: {
    page?: number;
    limit?: number;
    status?: LeadStatus[];
    leadType?: LeadType[];
    source?: LeadSource[];
    assignedSalesUserId?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  };
  config?: QueryConfig<typeof getSalesLeads>;
  onSuccess?: (data: GetSalesLeadsResponse) => void;
};

export const useGetSalesLeads = ({
  params,
  config,
  onSuccess,
}: UseGetSalesLeads) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["sales-leads", params],
    queryFn: () => getSalesLeads(params),
    onSuccess,
  });
};
