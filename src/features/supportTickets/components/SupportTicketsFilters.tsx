import { useTranslation } from 'react-i18next';
import { FilterBar, type FilterGroupDef } from '@/components/shared/FilterBar';
import type {
  SupportTicketStatus,
  SupportTicketPriority,
  SupportTicketType,
  SupportTicketRequesterType,
} from '@/enums';

type SupportTicketFilters = {
  status?: SupportTicketStatus[];
  priority?: SupportTicketPriority[];
  type?: SupportTicketType[];
  requesterType?: SupportTicketRequesterType[];
};

interface SupportTicketsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: SupportTicketFilters;
  onFiltersChange: (filters: SupportTicketFilters) => void;
}

export const SupportTicketsFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}: SupportTicketsFiltersProps) => {
  const { t } = useTranslation();

  const filterGroups: FilterGroupDef[] = [
    {
      key: 'status',
      label: t('supportTickets.status', 'Status'),
      options: [
        { value: 'NEW', label: t('supportTickets.statuses.NEW', 'New') },
        { value: 'OPEN', label: t('supportTickets.statuses.OPEN', 'Open') },
        { value: 'WAITING_ON_REQUESTER', label: t('supportTickets.statuses.WAITING_ON_REQUESTER', 'Waiting on Requester') },
        { value: 'WAITING_ON_INTERNAL', label: t('supportTickets.statuses.WAITING_ON_INTERNAL', 'Waiting on Internal') },
        { value: 'RESOLVED', label: t('supportTickets.statuses.RESOLVED', 'Resolved') },
        { value: 'CLOSED', label: t('supportTickets.statuses.CLOSED', 'Closed') },
        { value: 'REOPENED', label: t('supportTickets.statuses.REOPENED', 'Reopened') },
      ],
    },
    {
      key: 'priority',
      label: t('supportTickets.priority', 'Priority'),
      options: [
        { value: 'LOW', label: t('supportTickets.priorities.LOW', 'Low') },
        { value: 'MEDIUM', label: t('supportTickets.priorities.MEDIUM', 'Medium') },
        { value: 'HIGH', label: t('supportTickets.priorities.HIGH', 'High') },
        { value: 'URGENT', label: t('supportTickets.priorities.URGENT', 'Urgent') },
      ],
    },
    {
      key: 'type',
      label: t('supportTickets.type', 'Type'),
      options: [
        { value: 'GENERAL', label: t('supportTickets.types.GENERAL', 'General') },
        { value: 'DEBT', label: t('supportTickets.types.DEBT', 'Debt') },
        { value: 'PAYMENT', label: t('supportTickets.types.PAYMENT', 'Payment') },
        { value: 'TECHNICAL', label: t('supportTickets.types.TECHNICAL', 'Technical') },
        { value: 'ACCOUNTING', label: t('supportTickets.types.ACCOUNTING', 'Accounting') },
        { value: 'OTHER', label: t('supportTickets.types.OTHER', 'Other') },
      ],
    },
    {
      key: 'requesterType',
      label: t('supportTickets.requester', 'Requester'),
      options: [
        { value: 'MERCHANT', label: t('supportTickets.requesters.MERCHANT', 'Merchant') },
        { value: 'CUSTOMER', label: t('supportTickets.requesters.CUSTOMER', 'Customer') },
        { value: 'INTERNAL', label: t('supportTickets.requesters.INTERNAL', 'Internal') },
      ],
    },
  ];

  const values: Record<string, string | string[]> = {
    status: filters.status ?? [],
    priority: filters.priority ?? [],
    type: filters.type ?? [],
    requesterType: filters.requesterType ?? [],
  };

  const handleChange = (key: string, value: string | string[]) => {
    const arr = value as string[];
    onFiltersChange({
      ...filters,
      [key]: arr.length > 0 ? arr : undefined,
    });
  };

  const handleClearAll = () => {
    onFiltersChange({});
  };

  return (
    <FilterBar
      searchPlaceholder={t('supportTickets.searchPlaceholder', 'Search tickets...')}
      searchValue={searchTerm}
      onSearchChange={onSearchChange}
      filterGroups={filterGroups}
      values={values}
      onChange={handleChange}
      onClearAll={handleClearAll}
      className="mb-6"
    />
  );
};
