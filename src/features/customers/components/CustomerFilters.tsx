import { useTranslation } from "react-i18next";
import { FilterBar, type FilterGroupDef, type DateRangeDef } from "@/components/shared/FilterBar";

interface CustomerFiltersProps {
  filters: {
    page: number;
    limit: number;
    search: string;
    status: ("active" | "inactive" | "pending" | "banned")[];
    verificationStatus: ("pending_nafath" | "pending_email_verification" | "pending_admin_approval" | "approved" | "rejected")[];
    createdFrom: string;
    createdTo: string;
  };
  onFiltersChange: (filters: CustomerFiltersProps["filters"]) => void;
  activeTab: "customers" | "approvals";
}

export const CustomerFilters = ({ filters, onFiltersChange, activeTab }: CustomerFiltersProps) => {
  const { t } = useTranslation();

  const statusGroup: FilterGroupDef = {
    key: "status",
    label: t("customers.filters.status", "Status"),
    options: [
      { value: "active", label: t("customers.statusLabel.active", "Active") },
      { value: "inactive", label: t("customers.statusLabel.inactive", "Inactive") },
      { value: "pending", label: t("customers.statusLabel.pending", "Pending") },
      { value: "banned", label: t("customers.statusLabel.banned", "Banned") },
    ],
  };

  const verificationGroup: FilterGroupDef = {
    key: "verificationStatus",
    label: t("customers.filters.verification", "Verification"),
    options: [
      { value: "pending_nafath", label: t("customers.verificationStatus.pendingNafath", "Pending Nafath") },
      { value: "pending_email_verification", label: t("customers.verificationStatus.pendingEmail", "Pending Email") },
      { value: "pending_admin_approval", label: t("customers.verificationStatus.pendingAdminApproval", "Pending Approval") },
      { value: "approved", label: t("customers.verificationStatus.approved", "Approved") },
      { value: "rejected", label: t("customers.verificationStatus.rejected", "Rejected") },
    ],
  };

  const filterGroups: FilterGroupDef[] =
    activeTab === "customers" ? [statusGroup, verificationGroup] : [statusGroup];

  const dateRange: DateRangeDef = {
    fromKey: "createdFrom",
    toKey: "createdTo",
    label: t("customers.filters.dateRange", "Created Date"),
    fromLabel: t("customers.createdFrom", "From"),
    toLabel: t("customers.createdTo", "To"),
  };

  const values: Record<string, string | string[]> = {
    status: filters.status,
    verificationStatus: filters.verificationStatus,
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
  };

  const handleChange = (key: string, value: string | string[]) => {
    onFiltersChange({ ...filters, [key]: value, page: 0 });
  };

  const handleClearAll = () => {
    onFiltersChange({
      page: 0,
      limit: filters.limit,
      search: "",
      status: [],
      verificationStatus: [],
      createdFrom: "",
      createdTo: "",
    });
  };

  return (
    <FilterBar
      searchPlaceholder={t("customers.search", "Search customers...")}
      searchValue={filters.search}
      onSearchChange={(v) => onFiltersChange({ ...filters, search: v, page: 0 })}
      filterGroups={filterGroups}
      dateRange={dateRange}
      values={values}
      onChange={handleChange}
      onClearAll={handleClearAll}
    />
  );
};
