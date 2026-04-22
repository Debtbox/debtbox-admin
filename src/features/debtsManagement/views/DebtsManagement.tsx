import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useGetDebts } from "../api/getDebts";
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

  const totalQ = useGetDebts({
    params: { page: 0, limit: 1 },
    config: { staleTime: 60_000 },
  });
  const activeQ = useGetDebts({
    params: { page: 0, limit: 1, status: ["active"] },
    config: { staleTime: 60_000 },
  });
  const overdueQ = useGetDebts({
    params: { page: 0, limit: 1, status: ["overdue"] },
    config: { staleTime: 60_000 },
  });
  const arrearsQ = useGetDebts({
    params: { page: 0, limit: 1, status: ["in_arrears"] },
    config: { staleTime: 60_000 },
  });

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
        total={totalQ.data?.data.total ?? 0}
        active={activeQ.data?.data.total ?? 0}
        overdue={overdueQ.data?.data.total ?? 0}
        inArrears={arrearsQ.data?.data.total ?? 0}
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
