import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Users, TrendingUp, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/shared/Button";
import { useGetSalesLeads } from "../api/getSalesLeads";
import {
  SalesLeadsFilters,
  SalesLeadsTable,
  CreateSalesLeadModal,
  type SalesLeadsFiltersState,
} from "../components";

const LEADS_PER_PAGE = 10;

const SalesLeads = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [filters, setFilters] = useState<
    SalesLeadsFiltersState & { page: number; limit: number }
  >({
    page: 0,
    limit: LEADS_PER_PAGE,
    search: "",
    status: [],
    leadType: [],
    source: [],
    startDate: "",
    endDate: "",
  });

  const buildParams = useCallback(
    (overrides?: Partial<typeof filters>) => {
      const f = { ...filters, ...overrides };
      return {
        page: f.page,
        limit: f.limit,
        search: f.search || undefined,
        status: f.status.length
          ? (f.status as (
              | "NEW"
              | "CONTACTED"
              | "INTERESTED"
              | "CONVERTED"
              | "LOST"
            )[])
          : undefined,
        leadType: f.leadType.length
          ? (f.leadType as ("MERCHANT" | "CUSTOMER")[])
          : undefined,
        source: f.source.length
          ? (f.source as (
              | "REFERRAL"
              | "CAMPAIGN"
              | "COLD"
              | "EVENT"
              | "OTHER"
            )[])
          : undefined,
        startDate: f.startDate || undefined,
        endDate: f.endDate || undefined,
      };
    },
    [filters],
  );

  const leadsQuery = useGetSalesLeads({ params: buildParams() });

  const totalQ = useGetSalesLeads({
    params: { page: 0, limit: 1 },
    config: { staleTime: 60_000 },
  });
  const newQ = useGetSalesLeads({
    params: { page: 0, limit: 1, status: ["NEW"] },
    config: { staleTime: 60_000 },
  });
  const convertedQ = useGetSalesLeads({
    params: { page: 0, limit: 1, status: ["CONVERTED"] },
    config: { staleTime: 60_000 },
  });

  const handleFiltersChange = (f: SalesLeadsFiltersState) => {
    setFilters((prev) => ({ ...prev, ...f, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    void queryClient.invalidateQueries({ queryKey: ["sales-leads"] });
  };

  const stats = [
    {
      label: t("salesLeads.stats.total", "Total Leads"),
      value: totalQ.data?.data.total ?? 0,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: t("salesLeads.stats.new", "New Leads"),
      value: newQ.data?.data.total ?? 0,
      icon: <TrendingUp className="w-6 h-6 text-yellow-600" />,
      bg: "bg-yellow-50",
    },
    {
      label: t("salesLeads.stats.converted", "Converted"),
      value: convertedQ.data?.data.total ?? 0,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("salesLeads.title", "Sales Leads")}
          </h1>
          <p className="text-gray-500 text-sm">
            {t("salesLeads.subtitle", "Track and manage your sales pipeline")}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 me-2" />
          {t("salesLeads.createButton", "Create Lead")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4"
          >
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
        onPageChange={handlePageChange}
      />

      {showCreateModal && (
        <CreateSalesLeadModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default SalesLeads;
