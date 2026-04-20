import { useTranslation } from 'react-i18next';
import { FilterBar, type FilterGroupDef, type DateRangeDef } from '@/components/shared/FilterBar';

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
  onFiltersChange: (filters: MerchantFiltersProps['filters']) => void;
  activeTab: 'merchants' | 'approvals';
}

export const MerchantFilters = ({ filters, onFiltersChange, activeTab }: MerchantFiltersProps) => {
  const { t } = useTranslation();

  const statusGroup: FilterGroupDef = {
    key: 'status',
    label: t('merchants.filters.status', 'Status'),
    options: [
      { value: 'active', label: t('merchants.status.active', 'Active') },
      { value: 'inactive', label: t('merchants.status.inactive', 'Inactive') },
      { value: 'pending', label: t('merchants.status.pending', 'Pending') },
      { value: 'banned', label: t('merchants.status.banned', 'Banned') },
    ],
  };

  const verificationGroup: FilterGroupDef = {
    key: 'verificationStatus',
    label: t('merchants.filters.verification', 'Verification'),
    options: [
      { value: 'pending_nafath', label: t('merchants.verificationStatus.pendingNafath', 'Pending Nafath') },
      { value: 'pending_email_verification', label: t('merchants.verificationStatus.pendingEmail', 'Pending Email') },
      { value: 'pending_admin_approval', label: t('merchants.verificationStatus.pendingAdminApproval', 'Pending Approval') },
      { value: 'approved', label: t('merchants.verificationStatus.approved', 'Approved') },
      { value: 'rejected', label: t('merchants.verificationStatus.rejected', 'Rejected') },
    ],
  };

  const filterGroups: FilterGroupDef[] = activeTab === 'merchants'
    ? [statusGroup, verificationGroup]
    : [statusGroup];

  const dateRange: DateRangeDef = {
    fromKey: 'createdFrom',
    toKey: 'createdTo',
    label: t('merchants.filters.dateRange', 'Created Date'),
    fromLabel: t('merchants.createdFrom', 'From'),
    toLabel: t('merchants.createdTo', 'To'),
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
      search: '',
      status: [],
      verificationStatus: [],
      createdFrom: '',
      createdTo: '',
    });
  };

  return (
    <FilterBar
      searchPlaceholder={t('merchants.search', 'Search merchants...')}
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
