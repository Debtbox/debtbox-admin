import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Input, MultiSelect, Button } from "@/components/shared";

interface MerchantFiltersProps {
  filters: {
    page: number;
    limit: number;
    search: string;
    status: string[];
    verificationStatus: string[];
    createdFrom: string;
    createdTo: string;
  };
  onFiltersChange: (filters: any) => void;
  activeTab: 'merchants' | 'approvals';
}

export const MerchantFilters = ({
  filters,
  onFiltersChange,
  activeTab
}: MerchantFiltersProps) => {
  const { t } = useTranslation();

  const statusOptions = [
    { value: 'active', label: t('merchants.status.active', 'Active') },
    { value: 'inactive', label: t('merchants.status.inactive', 'Inactive') },
    { value: 'pending', label: t('merchants.status.pending', 'Pending') },
    { value: 'banned', label: t('merchants.status.banned', 'Banned') },
  ];

  const verificationStatusOptions = [
    { value: 'pending_nafath', label: t('merchants.verificationStatus.pendingNafath', 'Pending Nafath') },
    { value: 'pending_email_verification', label: t('merchants.verificationStatus.pendingEmail', 'Pending Email') },
    { value: 'pending_admin_approval', label: t('merchants.verificationStatus.pendingAdminApproval', 'Pending Admin Approval') },
    { value: 'approved', label: t('merchants.verificationStatus.approved', 'Approved') },
    { value: 'rejected', label: t('merchants.verificationStatus.rejected', 'Rejected') },
  ];

  const handleStatusChange = (status: string[]) => {
    onFiltersChange({ ...filters, status, page: 0 });
  };

  const handleVerificationStatusChange = (verificationStatus: string[]) => {
    onFiltersChange({ ...filters, verificationStatus, page: 0 });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 0,
      limit: 10,
      search: '',
      status: [],
      verificationStatus: [],
      createdFrom: '',
      createdTo: '',
    });
  };

  const hasActiveFilters = filters.search || filters.status.length > 0 || filters.verificationStatus.length > 0 || filters.createdFrom || filters.createdTo;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('merchants.filters', 'Filters')}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            {t('common.clearFilters', 'Clear Filters')}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={t('merchants.search', 'Search merchants...')}
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value, page: 0 })}
              className="pl-10 h-11"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <MultiSelect
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
            placeholder={t('merchants.selectStatus', 'Select status')}
          />
        </div>

        {/* Verification Status Filter */}
        {activeTab === 'merchants' && (
          <div>
            <MultiSelect
              label="Verification Status"
              options={verificationStatusOptions}
              value={filters.verificationStatus}
              onChange={handleVerificationStatusChange}
              placeholder={t('merchants.selectVerificationStatus', 'Select verification status')}
            />
          </div>
        )}

        {/* Date Range - From */}
        <div>
          <Input
            type="date"
            label={t('merchants.createdFrom', 'From')}
            value={filters.createdFrom}
            onChange={(e) => onFiltersChange({ ...filters, createdFrom: e.target.value, page: 0 })}
            className="h-11"
          />
        </div>

        {/* Date Range - To */}
        <div>
          <Input
            type="date"
            label={t('merchants.createdTo', 'To')}
            value={filters.createdTo}
            onChange={(e) => onFiltersChange({ ...filters, createdTo: e.target.value, page: 0 })}
            className="h-11"
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {t('merchants.search', 'Search')}: "{filters.search}"
              </span>
            )}
            {filters.status.map(status => (
              <span key={status} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Status: {t(`merchants.status.${status}`, status)}
              </span>
            ))}
            {filters.verificationStatus.map(status => (
              <span key={status} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Verification: {t(`merchants.verificationStatus.${status}`, status)}
              </span>
            ))}
            {filters.createdFrom && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                {t('merchants.createdFrom', 'From')}: {filters.createdFrom}
              </span>
            )}
            {filters.createdTo && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                {t('merchants.createdTo', 'To')}: {filters.createdTo}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};