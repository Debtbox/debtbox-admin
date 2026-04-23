import { axios } from "@/lib/axios";
import type { QueryConfig } from "@/lib/react-query";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type { SalesLeadDTO } from "@/types/SalesLeadDTO";

export const getSalesLead = ({
  id,
}: {
  id: string;
}): Promise<GetSalesLeadResponse> => {
  const language = getLanguageFromCookie();
  return axios.get(`/admin/sales/leads/${id}`, {
    headers: { "Accept-Language": language },
  });
};

export type GetSalesLeadResponse = {
  message: string;
  success: boolean;
  data: SalesLeadDTO;
};

type UseGetSalesLead = {
  id: string;
  config?: QueryConfig<typeof getSalesLead>;
};

export const useGetSalesLead = ({ id, config }: UseGetSalesLead) => {
  return useQueryWithCallback({
    ...config,
    queryKey: ["sales-leads", id],
    queryFn: () => getSalesLead({ id }),
  });
};
