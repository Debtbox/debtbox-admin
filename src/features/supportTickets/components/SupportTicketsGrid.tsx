import { MessageSquare } from "lucide-react";
import type { TFunction } from "i18next";
import type { SupportTicketDTO } from "@/types/SupportTicketDTO";
import { SupportTicketsCard } from "./SupportTicketsCard";
import { Pagination } from "@/components/shared/Pagination";
import type { ApiError } from "@/types/ApiError";

interface SupportTicketsGridProps {
  tickets: SupportTicketDTO[];
  isLoading: boolean;
  error: ApiError | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewDetails?: (ticketId: string) => void;
  t: TFunction;
}

export const SupportTicketsGrid = ({
  tickets,
  isLoading,
  error,
  searchTerm,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewDetails,
  t,
}: SupportTicketsGridProps) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <MessageSquare className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("supportTickets.error")}
        </h3>
        <p className="text-gray-500">
          {error.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("supportTickets.noTickets")}
        </h3>
        <p className="text-gray-500">
          {searchTerm
            ? "Try adjusting your search terms or filters"
            : "No support tickets found"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <SupportTicketsCard
            key={ticket.id}
            ticket={ticket}
            t={t}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          showItemsInfo={true}
          className="justify-center"
        />
      </div>
    </>
  );
};
