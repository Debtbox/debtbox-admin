import { axios } from "@/lib/axios";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import type {
  LeadType,
  LeadSource,
  LeadStatus,
  SalesLeadDTO,
} from "@/types/SalesLeadDTO";

export interface CreateSalesLeadRequest {
  leadType: LeadType;
  fullName: string;
  phone?: string;
  email?: string;
  source: LeadSource;
  status?: LeadStatus;
  notes?: string;
  assignedSalesUserId?: number | null;
}

export const createSalesLead = (
  data: CreateSalesLeadRequest,
): Promise<CreateSalesLeadResponse> => {
  const language = getLanguageFromCookie();
  return axios.post("/admin/sales/leads", data, {
    headers: { "Accept-Language": language },
  });
};

export type CreateSalesLeadResponse = {
  message: string;
  success: boolean;
  data: SalesLeadDTO;
};

type UseCreateSalesLeadOptions = {
  config?: MutationConfig<typeof createSalesLead>;
};

export const useCreateSalesLead = ({
  config,
}: UseCreateSalesLeadOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: createSalesLead,
  });
};
