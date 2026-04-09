import { useState, useRef, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import type { TFunction } from "i18next";
import type {
  SupportTicketStatus,
  SupportTicketPriority,
  SupportTicketType,
  SupportTicketRequesterType,
} from "@/enums";

interface SupportTicketsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    status?: SupportTicketStatus[];
    priority?: SupportTicketPriority[];
    type?: SupportTicketType[];
    requesterType?: SupportTicketRequesterType[];
  };
  onFiltersChange: (filters: SupportTicketsFiltersProps["filters"]) => void;
  t: TFunction;
}

export const SupportTicketsFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  t,
}: SupportTicketsFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFiltersOpen(false);
      }
    };

    if (isFiltersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isFiltersOpen]);

  const statusOptions: { value: SupportTicketStatus; label: string }[] = [
    { value: "NEW", label: t("supportTickets.statuses.NEW") },
    { value: "OPEN", label: t("supportTickets.statuses.OPEN") },
    {
      value: "WAITING_ON_REQUESTER",
      label: t("supportTickets.statuses.WAITING_ON_REQUESTER"),
    },
    {
      value: "WAITING_ON_INTERNAL",
      label: t("supportTickets.statuses.WAITING_ON_INTERNAL"),
    },
    { value: "RESOLVED", label: t("supportTickets.statuses.RESOLVED") },
    { value: "CLOSED", label: t("supportTickets.statuses.CLOSED") },
    { value: "REOPENED", label: t("supportTickets.statuses.REOPENED") },
  ];

  const priorityOptions: { value: SupportTicketPriority; label: string }[] = [
    { value: "LOW", label: t("supportTickets.priorities.LOW") },
    { value: "MEDIUM", label: t("supportTickets.priorities.MEDIUM") },
    { value: "HIGH", label: t("supportTickets.priorities.HIGH") },
    { value: "URGENT", label: t("supportTickets.priorities.URGENT") },
  ];

  const typeOptions: { value: SupportTicketType; label: string }[] = [
    { value: "GENERAL", label: t("supportTickets.types.GENERAL") },
    { value: "DEBT", label: t("supportTickets.types.DEBT") },
    { value: "PAYMENT", label: t("supportTickets.types.PAYMENT") },
    { value: "TECHNICAL", label: t("supportTickets.types.TECHNICAL") },
    { value: "ACCOUNTING", label: t("supportTickets.types.ACCOUNTING") },
    { value: "OTHER", label: t("supportTickets.types.OTHER") },
  ];

  const requesterOptions: {
    value: SupportTicketRequesterType;
    label: string;
  }[] = [
    { value: "MERCHANT", label: t("supportTickets.requesters.MERCHANT") },
    { value: "CUSTOMER", label: t("supportTickets.requesters.CUSTOMER") },
    { value: "INTERNAL", label: t("supportTickets.requesters.INTERNAL") },
  ];

  const handleFilterChange = <
    T extends keyof SupportTicketsFiltersProps["filters"],
  >(
    filterType: T,
    value:
      | SupportTicketStatus
      | SupportTicketPriority
      | SupportTicketType
      | SupportTicketRequesterType,
    checked: boolean,
  ) => {
    const currentFilters = filters[filterType] || [];
    let newFilters: (
      | SupportTicketStatus
      | SupportTicketPriority
      | SupportTicketType
      | SupportTicketRequesterType
    )[];

    if (checked) {
      newFilters = [...currentFilters, value];
    } else {
      newFilters = currentFilters.filter((f) => f !== value);
    }

    onFiltersChange({
      ...filters,
      [filterType]: newFilters.length > 0 ? newFilters : undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter && filter.length > 0,
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={t("supportTickets.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="relative" ref={filterRef}>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
            hasActiveFilters
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Filter className="w-4 h-4" />
          {t("common.filters", "Filters")}
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              {Object.values(filters).reduce(
                (count, filter) => count + (filter?.length || 0),
                0,
              )}
            </span>
          )}
        </button>

        {/* Filter Dropdown */}
        {isFiltersOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t("common.filters", "Filters")}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {t("common.clearAll", "Clear All")}
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t("supportTickets.status")}
                </h4>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          filters.status?.includes(option.value) || false
                        }
                        onChange={(e) =>
                          handleFilterChange(
                            "status",
                            option.value,
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t("supportTickets.priority")}
                </h4>
                <div className="space-y-2">
                  {priorityOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          filters.priority?.includes(option.value) || false
                        }
                        onChange={(e) =>
                          handleFilterChange(
                            "priority",
                            option.value,
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t("supportTickets.type")}
                </h4>
                <div className="space-y-2">
                  {typeOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(option.value) || false}
                        onChange={(e) =>
                          handleFilterChange(
                            "type",
                            option.value,
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Requester Type Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t("supportTickets.requester")}
                </h4>
                <div className="space-y-2">
                  {requesterOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          filters.requesterType?.includes(option.value) || false
                        }
                        onChange={(e) =>
                          handleFilterChange(
                            "requesterType",
                            option.value,
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
