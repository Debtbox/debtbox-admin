import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSupportTickets } from "../api/getSupportTickets";
import type { SupportTicketStatus, SupportTicketPriority, SupportTicketType, SupportTicketRequesterType } from "@/enums";
import { SupportTicketsStats, SupportTicketsFilters, SupportTicketsGrid } from "../components";
import { Button } from "@/components/shared/Button";
import { Plus } from "lucide-react";

export const SupportTickets = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    status?: SupportTicketStatus[];
    priority?: SupportTicketPriority[];
    type?: SupportTicketType[];
    requesterType?: SupportTicketRequesterType[];
  }>({});

  const itemsPerPage = 12;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const { data, isLoading, error } = useGetSupportTickets({
    params: {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm || undefined,
      status: filters.status?.map(s => s.toString()),
      priority: filters.priority?.map(p => p.toString()),
      type: filters.type?.map(t => t.toString()),
      requesterType: filters.requesterType?.map(r => r.toString()),
    },
  });

  const tickets = data?.data?.tickets || [];
  const totalTickets = data?.data?.total || 0;
  const totalPages = Math.ceil(totalTickets / itemsPerPage);

  // Calculate stats from current page data
  const stats = {
    total: totalTickets,
    open: tickets.filter(t => t.status === "OPEN" || t.status === "NEW" || t.status === "REOPENED").length,
    resolved: tickets.filter(t => t.status === "RESOLVED").length,
    closed: tickets.filter(t => t.status === "CLOSED").length,
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (ticketId: string) => {
    navigate(`/support-tickets/${ticketId}`);
  };

  const handleCreateTicket = () => {
    navigate('/support-tickets/create');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("supportTickets.title")}
            </h1>
            <p className="text-gray-600">
              {t("supportTickets.subtitle")}
            </p>
          </div>
          <Button onClick={handleCreateTicket} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            {t("supportTickets.createTicket", "Create Ticket")}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <SupportTicketsStats stats={stats} t={t} />

      {/* Filters */}
      <SupportTicketsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        t={t}
      />

      {/* Content Grid with partial loading */}
      <SupportTicketsGrid
        tickets={tickets}
        isLoading={isLoading}
        error={error}
        searchTerm={debouncedSearchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalTickets}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onViewDetails={handleViewDetails}
        t={t}
      />
    </div>
  );
};
