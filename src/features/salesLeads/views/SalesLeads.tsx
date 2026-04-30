import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";
import { useUserStore } from "@/stores/UserStore";
import type { LeadSource, LeadStatus, LeadType, SalesLead } from "@/types/SalesLeadDTO";
import {
  SalesLeadsFilters,
  SalesLeadsTable,
  CreateSalesLeadModal,
  AssignLeadModal,
  ConvertLeadModal,
  SalesSectionTabs,
  type SalesLeadsFiltersState,
} from "../components";
import { useListSalesLeads, useSalesLeadStats } from "../api/sales";
import { isSalesAdminRole } from "../utils";

const LEADS_PER_PAGE = 10;

const SalesLeads = () => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const canManageAllSales = isSalesAdminRole(user?.role?.slug);
  const canCreate = useCan(PERMISSIONS.SALES_LEAD_CREATE);
  const canRead = useCan(PERMISSIONS.SALES_LEAD_READ);
  const canUpdate = useCan(PERMISSIONS.SALES_LEAD_UPDATE);
  const canAssign = useCan(PERMISSIONS.SALES_LEAD_ASSIGN);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLead, setEditingLead] = useState<SalesLead | null>(null);
  const [assigningLead, setAssigningLead] = useState<SalesLead | null>(null);
  const [convertingLead, setConvertingLead] = useState<SalesLead | null>(null);
  const [filters, setFilters] = useState<SalesLeadsFiltersState & { page: number; limit: number }>({
    page: 0,
    limit: LEADS_PER_PAGE,
    search: "",
    status: [],
    leadType: [],
    source: [],
    assignedSalesUserId: "",
    crNumber: "",
    startDate: "",
    endDate: "",
  });

  const buildQuery = useCallback(() => ({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    status: filters.status.length ? (filters.status as LeadStatus[]) : undefined,
    leadType: filters.leadType[0] ? (filters.leadType[0] as LeadType) : undefined,
    source: filters.source.length ? (filters.source as LeadSource[]) : undefined,
    assignedSalesUserId:
      canManageAllSales && filters.assignedSalesUserId
        ? Number(filters.assignedSalesUserId)
        : undefined,
    crNumber: filters.crNumber || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  }), [canManageAllSales, filters]);

  const leadsQuery = useListSalesLeads({ query: buildQuery() });
  const statsQuery = useSalesLeadStats({ staleTime: 60_000 });

  const handleFiltersChange = (next: SalesLeadsFiltersState) => {
    setFilters((prev) => ({ ...prev, ...next, page: 0 }));
  };

  const stats = [
    {
      label: t("salesLeads.stats.total", "Total Leads"),
      value: statsQuery.data?.data.totalLeads ?? 0,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: t("salesLeads.stats.new", "New Leads"),
      value: statsQuery.data?.data.newLeads ?? 0,
      icon: <TrendingUp className="w-6 h-6 text-yellow-600" />,
      bg: "bg-yellow-50",
    },
    {
      label: t("salesLeads.stats.converted", "Converted"),
      value: statsQuery.data?.data.convertedLeads ?? 0,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="p-6">
      <SalesSectionTabs />
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("salesLeads.title", "Sales Leads")}
          </h1>
          <p className="text-gray-500 text-sm">
            {t("salesLeads.subtitle", "Track and manage your sales pipeline")}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 me-2" />
            {t("salesLeads.createButton", "Create Lead")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4">
            <div className={`${stat.bg} rounded-lg p-3`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <SalesLeadsFilters
          filters={filters}
          canManageAllSales={canManageAllSales}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <SalesLeadsTable
        data={leadsQuery.data?.data.leads ?? []}
        isLoading={leadsQuery.isLoading}
        pagination={{
          page: filters.page,
          limit: filters.limit,
          total: leadsQuery.data?.data.total ?? 0,
        }}
        canRead={canRead}
        canUpdate={canUpdate}
        canAssign={canAssign}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onEdit={setEditingLead}
        onAssign={setAssigningLead}
        onConvert={setConvertingLead}
      />

      {canCreate && showCreateModal && (
        <CreateSalesLeadModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}
      {canUpdate && editingLead && (
        <CreateSalesLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSuccess={() => setEditingLead(null)}
        />
      )}
      {canAssign && assigningLead && (
        <AssignLeadModal
          lead={assigningLead}
          canUnassign={canManageAllSales}
          onClose={() => setAssigningLead(null)}
        />
      )}
      {canUpdate && convertingLead && (
        <ConvertLeadModal lead={convertingLead} onClose={() => setConvertingLead(null)} />
      )}
    </div>
  );
};

export default SalesLeads;
