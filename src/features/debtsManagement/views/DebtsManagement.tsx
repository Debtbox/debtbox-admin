import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGetDebts } from "../api/getDebts";
import { useGetDebtsStats } from "../api/getDebtsStats";
import {
  DebtsStats,
  DebtFilters,
  DebtsTable,
  type DebtFiltersState,
} from "../components";

const DEBTS_PER_PAGE = 10;

const DebtsManagement = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<DebtFiltersState & { page: number; limit: number }>({
    page: 0,
    limit: DEBTS_PER_PAGE,
    search: "",
    status: [],
    createdFrom: "",
    createdTo: "",
    dueFrom: "",
    dueTo: "",
  });

  const buildParams = useCallback(
    (overrides?: Partial<typeof filters>) => {
      const f = { ...filters, ...overrides };
      return {
        page: f.page,
        limit: f.limit,
        search: f.search || undefined,
        status: f.status.length
          ? (f.status as ("pending" | "active" | "paid" | "overdue" | "in_arrears" | "cancelled")[])
          : undefined,
        createdFrom: f.createdFrom || undefined,
        createdTo: f.createdTo || undefined,
        dueFrom: f.dueFrom || undefined,
        dueTo: f.dueTo || undefined,
      };
    },
    [filters]
  );

  const debtsQuery = useGetDebts({ params: buildParams() });
  const statsQuery = useGetDebtsStats({ config: { staleTime: 60_000 } });

  const handleFiltersChange = (f: DebtFiltersState) => {
    setFilters((prev) => ({ ...prev, ...f, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{t("debts.title")}</h1>
        <p className="text-gray-500 text-sm">{t("debts.subtitle")}</p>
      </div>

      <DebtsStats
        total={statsQuery.data?.data.totalDebts ?? 0}
        active={statsQuery.data?.data.activeDebts ?? 0}
        overdue={statsQuery.data?.data.overdueDebts ?? 0}
        paid={statsQuery.data?.data.paidDebts ?? 0}
        isLoading={statsQuery.isLoading}
        t={t}
      />

      <div className="mb-6">
        <DebtFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <DebtsTable
        data={debtsQuery.data?.data.data ?? []}
        isLoading={debtsQuery.isLoading}
        pagination={{
          page: debtsQuery.data?.data.page ?? 0,
          limit: debtsQuery.data?.data.limit ?? DEBTS_PER_PAGE,
          total: debtsQuery.data?.data.total ?? 0,
        }}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DebtsManagement;
