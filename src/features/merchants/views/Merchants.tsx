import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, Clock } from "lucide-react";
import { useGetMerchants } from "../api/getMerchants";
import { useGetMerchantPendingApprovals } from "../api/getMerchantPendingApprovals";
import { MerchantsTable } from "../components/MerchantsTable";
import { MerchantApprovalsTable } from "../components/MerchantApprovalsTable";
import { MerchantFilters } from "../components/MerchantFilters";

export const Merchants = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<"merchants" | "approvals">(
    (searchParams.get('tab') as "merchants" | "approvals") || "merchants"
  );

  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    search: string;
    status: ("active" | "inactive" | "pending" | "banned")[];
    verificationStatus: ("pending_nafath" | "pending_email_verification" | "pending_admin_approval" | "approved" | "rejected")[];
    createdFrom: string;
    createdTo: string;
  }>({
    page: 0,
    limit: 10,
    search: "",
    status: [],
    verificationStatus: [],
    createdFrom: "",
    createdTo: "",
  });

  // Update URL when tab changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', activeTab);
    setSearchParams(newSearchParams, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  const merchantsQuery = useGetMerchants({
    params: activeTab === "merchants" ? filters : undefined,
  });

  const approvalsQuery = useGetMerchantPendingApprovals({
    params: activeTab === "approvals" ? filters : undefined,
  });

  const tabs = [
    {
      id: "merchants" as const,
      label: t("merchants.merchants", "Merchants"),
      icon: Building2,
      count: merchantsQuery.data?.data.total || 0,
    },
    {
      id: "approvals" as const,
      label: t("merchants.approvals", "Pending Approvals"),
      icon: Clock,
      count: approvalsQuery.data?.data.total || 0,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("merchants.title", "Merchants")}
        </h1>
        <p className="text-gray-600">
          {t("merchants.subtitle", "Manage merchants and their approvals")}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <MerchantFilters
          filters={filters}
          onFiltersChange={setFilters}
          activeTab={activeTab}
        />
      </div>

      {/* Content */}
      {activeTab === "merchants" && (
        <MerchantsTable
          data={merchantsQuery.data?.data.data || []}
          isLoading={merchantsQuery.isLoading}
          pagination={{
            page: merchantsQuery.data?.data.page || 0,
            limit: merchantsQuery.data?.data.limit || 10,
            total: merchantsQuery.data?.data.total || 0,
          }}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      )}

      {activeTab === "approvals" && (
        <MerchantApprovalsTable
          data={approvalsQuery.data?.data.data || []}
          isLoading={approvalsQuery.isLoading}
          pagination={{
            page: approvalsQuery.data?.data.page || 0,
            limit: approvalsQuery.data?.data.limit || 10,
            total: approvalsQuery.data?.data.total || 0,
          }}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onRefresh={() => approvalsQuery.refetch()}
        />
      )}
    </div>
  );
};

export default Merchants;
