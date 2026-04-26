import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Users, Clock } from "lucide-react";
import { useGetCustomers } from "../api/getCustomers";
import { useGetCustomerPendingApprovals } from "../api/getCustomerPendingApprovals";
import { CustomersTable } from "../components/CustomersTable";
import { CustomerApprovalsTable } from "../components/CustomerApprovalsTable";
import { CustomerFilters } from "../components/CustomerFilters";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan, useCanAny } from "@/auth/rbac";

const Customers = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const canList = useCan(PERMISSIONS.CUSTOMER_LIST);
  const canReview = useCanAny([PERMISSIONS.CUSTOMER_APPROVE, PERMISSIONS.CUSTOMER_REJECT]);

  const [activeTab, setActiveTab] = useState<"customers" | "approvals">(
    (searchParams.get("tab") as "customers" | "approvals") || (canList ? "customers" : "approvals"),
  );

  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    search: string;
    status: ("active" | "inactive" | "pending" | "banned")[];
    verificationStatus: (
      | "pending_nafath"
      | "pending_email_verification"
      | "pending_admin_approval"
      | "approved"
      | "rejected"
    )[];
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

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", activeTab);
    setSearchParams(newParams, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  useEffect(() => {
    if (activeTab === "approvals" && !canReview) setActiveTab("customers");
    if (activeTab === "customers" && !canList && canReview) setActiveTab("approvals");
  }, [activeTab, canList, canReview]);

  const customersQuery = useGetCustomers({
    params: activeTab === "customers" ? filters : undefined,
  });

  const approvalsQuery = useGetCustomerPendingApprovals({
    params: activeTab === "approvals" ? filters : undefined,
  });

  const tabs = [
    {
      id: "customers" as const,
      label: t("customers.customers", "Customers"),
      icon: Users,
      count: customersQuery.data?.data.total || 0,
      visible: canList,
    },
    {
      id: "approvals" as const,
      label: t("customers.approvals", "Pending Approvals"),
      icon: Clock,
      count: approvalsQuery.data?.data.total || 0,
      visible: canReview,
    },
  ].filter((tab) => tab.visible);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("customers.title", "Customers")}
        </h1>
        <p className="text-gray-600">
          {t("customers.subtitle", "Manage customers and their approvals")}
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
        <CustomerFilters
          filters={filters}
          onFiltersChange={setFilters}
          activeTab={activeTab}
        />
      </div>

      {/* Content */}
      {activeTab === "customers" && canList && (
        <CustomersTable
          data={customersQuery.data?.data.data || []}
          isLoading={customersQuery.isLoading}
          pagination={{
            page: customersQuery.data?.data.page || 0,
            limit: customersQuery.data?.data.limit || 10,
            total: customersQuery.data?.data.total || 0,
          }}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      )}

      {activeTab === "approvals" && canReview && (
        <CustomerApprovalsTable
          data={approvalsQuery.data?.data.data || []}
          isLoading={approvalsQuery.isLoading}
          pagination={{
            page: approvalsQuery.data?.data.page || 0,
            limit: approvalsQuery.data?.data.limit || 10,
            total: approvalsQuery.data?.data.total || 0,
          }}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onRefresh={() => {
            approvalsQuery.refetch();
            queryClient.invalidateQueries({ queryKey: ["customers"] });
          }}
        />
      )}
    </div>
  );
};

export default Customers;
