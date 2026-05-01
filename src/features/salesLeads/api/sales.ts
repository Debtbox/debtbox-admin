import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { useQueryWithCallback } from "@/lib/hooks/useQueryWithCallback";
import type { MutationConfig, QueryConfig } from "@/lib/react-query";
import { getLanguageFromCookie } from "@/utils/getLanguageFromCookies";
import type {
  CreateSalesLeadPayload,
  ListSalesAssignmentsQuery,
  ListSalesLeadsQuery,
  SalesAssignment,
  SalesDashboard,
  SalesLead,
  SalesLeadStats,
  SalesPerformance,
  UpdateSalesLeadPayload,
} from "@/types/SalesLeadDTO";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
};

const headers = () => ({ "Accept-Language": getLanguageFromCookie() });

const appendQuery = (
  params: URLSearchParams,
  key: string,
  value: string | number | boolean | string[] | undefined,
) => {
  if (value === undefined || value === "") return;
  params.append(key, Array.isArray(value) ? value.join(",") : String(value));
};

const cleanLeadPayload = <T extends CreateSalesLeadPayload | UpdateSalesLeadPayload>(
  payload: T,
): T => {
  const next = { ...payload };
  if ((next as { status?: string }).status === "CONVERTED") delete next.status;
  return next;
};

export const salesQueryKeys = {
  leads: ["sales-leads"] as const,
  lead: (id: string) => ["sales-leads", id] as const,
  stats: ["sales-leads-stats"] as const,
  assignments: ["sales-assignments"] as const,
  performance: ["sales-performance"] as const,
  dashboard: ["sales-dashboard"] as const,
};

export const createSalesLead = (
  payload: CreateSalesLeadPayload,
): Promise<ApiResponse<SalesLead>> =>
  axios.post("/admin/sales/leads", cleanLeadPayload(payload), {
    headers: headers(),
  });

export const listSalesLeads = (
  query?: ListSalesLeadsQuery,
): Promise<ApiResponse<{ leads: SalesLead[]; total: number }>> => {
  const params = new URLSearchParams();
  appendQuery(params, "page", query?.page);
  appendQuery(params, "limit", query?.limit);
  appendQuery(params, "status", query?.status);
  appendQuery(params, "leadType", query?.leadType);
  appendQuery(params, "source", query?.source);
  appendQuery(params, "assignedSalesUserId", query?.assignedSalesUserId);
  appendQuery(params, "crNumber", query?.crNumber);
  appendQuery(params, "search", query?.search);
  appendQuery(params, "startDate", query?.startDate);
  appendQuery(params, "endDate", query?.endDate);

  return axios.get(`/admin/sales/leads${params.toString() ? `?${params}` : ""}`, {
    headers: headers(),
  });
};

export const getSalesLeadStats = (): Promise<ApiResponse<SalesLeadStats>> =>
  axios.get("/admin/sales/leads/stats", { headers: headers() });

export const getSalesLead = (id: string): Promise<ApiResponse<SalesLead>> =>
  axios.get(`/admin/sales/leads/${id}`, { headers: headers() });

export const updateSalesLead = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateSalesLeadPayload;
}): Promise<ApiResponse<SalesLead>> =>
  axios.patch(`/admin/sales/leads/${id}`, cleanLeadPayload(payload), {
    headers: headers(),
  });

export const assignSalesLead = ({
  id,
  assignedSalesUserId,
}: {
  id: string;
  assignedSalesUserId: number | null;
}): Promise<ApiResponse<SalesLead>> =>
  axios.post(
    `/admin/sales/leads/${id}/assign`,
    { assignedSalesUserId },
    { headers: headers() },
  );

export const convertSalesLead = ({
  id,
  payload,
}: {
  id: string;
  payload: { convertedEntityType: "MERCHANT" | "CUSTOMER"; convertedEntityId: string };
}): Promise<ApiResponse<SalesLead>> =>
  axios.post(`/admin/sales/leads/${id}/convert`, payload, { headers: headers() });

export const createSalesAssignment = (payload: {
  salesUserId: number;
  entityType: "MERCHANT" | "CUSTOMER";
  entityId: string;
}): Promise<ApiResponse<SalesAssignment>> =>
  axios.post("/admin/sales/assignments", payload, { headers: headers() });

export const listSalesAssignments = (
  query?: ListSalesAssignmentsQuery,
): Promise<ApiResponse<{ assignments: SalesAssignment[]; total: number }>> => {
  const params = new URLSearchParams();
  appendQuery(params, "page", query?.page);
  appendQuery(params, "limit", query?.limit);
  appendQuery(params, "salesUserId", query?.salesUserId);
  appendQuery(params, "entityType", query?.entityType);
  appendQuery(params, "isActive", query?.isActive);
  appendQuery(params, "entityId", query?.entityId);
  appendQuery(params, "startDate", query?.startDate);
  appendQuery(params, "endDate", query?.endDate);

  return axios.get(
    `/admin/sales/assignments${params.toString() ? `?${params}` : ""}`,
    { headers: headers() },
  );
};

export const deactivateSalesAssignment = (
  id: string,
): Promise<ApiResponse<SalesAssignment>> =>
  axios.post(`/admin/sales/assignments/${id}/deactivate`, undefined, {
    headers: headers(),
  });

export const getSalesPerformance = (query: {
  month: string;
  salesUserId?: number;
}): Promise<ApiResponse<SalesPerformance>> =>
  axios.get("/admin/sales/performance", {
    params: query,
    headers: headers(),
  });

export const getSalesDashboard = (): Promise<ApiResponse<SalesDashboard>> =>
  axios.get("/admin/dashboards/sales", { headers: headers() });

export const useListSalesLeads = ({
  query,
  config,
}: {
  query?: ListSalesLeadsQuery;
  config?: QueryConfig<typeof listSalesLeads>;
}) =>
  useQueryWithCallback({
    ...config,
    queryKey: [...salesQueryKeys.leads, query],
    queryFn: () => listSalesLeads(query),
  });

export const useSalesLeadStats = (config?: QueryConfig<typeof getSalesLeadStats>) =>
  useQueryWithCallback({
    ...config,
    queryKey: salesQueryKeys.stats,
    queryFn: getSalesLeadStats,
  });

export const useSalesLead = (id: string, config?: QueryConfig<typeof getSalesLead>) =>
  useQueryWithCallback({
    ...config,
    queryKey: salesQueryKeys.lead(id),
    queryFn: () => getSalesLead(id),
  });

const invalidateSales = (queryClient: ReturnType<typeof useQueryClient>) => {
  void queryClient.invalidateQueries({ queryKey: salesQueryKeys.leads });
  void queryClient.invalidateQueries({ queryKey: salesQueryKeys.stats });
  void queryClient.invalidateQueries({ queryKey: salesQueryKeys.dashboard });
  void queryClient.invalidateQueries({ queryKey: salesQueryKeys.performance });
  void queryClient.invalidateQueries({ queryKey: salesQueryKeys.assignments });
};

export const useCreateSalesLeadMutation = (
  config?: MutationConfig<typeof createSalesLead>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: createSalesLead,
    onSuccess: (...args) => {
      invalidateSales(queryClient);
      config?.onSuccess?.(...args);
    },
  });
};

export const useUpdateSalesLeadMutation = (
  config?: MutationConfig<typeof updateSalesLead>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: updateSalesLead,
    onSuccess: (...args) => {
      invalidateSales(queryClient);
      config?.onSuccess?.(...args);
    },
  });
};

export const useAssignSalesLeadMutation = (
  config?: MutationConfig<typeof assignSalesLead>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: assignSalesLead,
    onSuccess: (...args) => {
      invalidateSales(queryClient);
      config?.onSuccess?.(...args);
    },
  });
};

export const useConvertSalesLeadMutation = (
  config?: MutationConfig<typeof convertSalesLead>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: convertSalesLead,
    onSuccess: (...args) => {
      invalidateSales(queryClient);
      config?.onSuccess?.(...args);
    },
  });
};

export const useListSalesAssignments = ({
  query,
  config,
}: {
  query?: ListSalesAssignmentsQuery;
  config?: QueryConfig<typeof listSalesAssignments>;
}) =>
  useQueryWithCallback({
    ...config,
    queryKey: [...salesQueryKeys.assignments, query],
    queryFn: () => listSalesAssignments(query),
  });

export const useCreateSalesAssignmentMutation = (
  config?: MutationConfig<typeof createSalesAssignment>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: createSalesAssignment,
    onSuccess: (...args) => {
      invalidateSales(queryClient);
      config?.onSuccess?.(...args);
    },
  });
};

export const useDeactivateSalesAssignmentMutation = (
  config?: MutationConfig<typeof deactivateSalesAssignment>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: deactivateSalesAssignment,
    onSuccess: (...args) => {
      invalidateSales(queryClient);
      config?.onSuccess?.(...args);
    },
  });
};

export const useSalesPerformance = ({
  query,
  config,
}: {
  query: { month: string; salesUserId?: number };
  config?: QueryConfig<typeof getSalesPerformance>;
}) =>
  useQueryWithCallback({
    ...config,
    queryKey: [...salesQueryKeys.performance, query],
    queryFn: () => getSalesPerformance(query),
  });

export const useSalesDashboard = (config?: QueryConfig<typeof getSalesDashboard>) =>
  useQueryWithCallback({
    ...config,
    queryKey: salesQueryKeys.dashboard,
    queryFn: getSalesDashboard,
  });
