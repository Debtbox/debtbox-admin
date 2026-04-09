import { AlertCircle, Calendar, Clock, MessageSquare, Tag, User } from "lucide-react";
import type { TFunction } from "i18next";
import type { SupportTicketDTO } from "@/types/SupportTicketDTO";
import type { SupportTicketPriority } from "@/enums";
import { getStatusColor, getPriorityColor, formatDate } from "../utils";

const getPriorityIcon = (priority: SupportTicketPriority) => {
  switch (priority) {
    case "LOW":
      return <Clock className="w-3 h-3" />;
    case "MEDIUM":
      return <AlertCircle className="w-3 h-3" />;
    case "HIGH":
      return <AlertCircle className="w-3 h-3" />;
    case "URGENT":
      return <AlertCircle className="w-3 h-3" />;
    default:
      return <Clock className="w-3 h-3" />;
  }
};

interface SupportTicketsCardProps {
  ticket: SupportTicketDTO;
  t: TFunction;
  onViewDetails?: (ticketId: string) => void;
}

export const SupportTicketsCard = ({ ticket, t, onViewDetails }: SupportTicketsCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500">
              #{ticket.code}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
              {t(`supportTickets.statuses.${ticket.status}`)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}>
            {ticket.subject}
          </h3>
          <p className="text-sm text-gray-600 overflow-hidden mb-3" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}>
            {ticket.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {t(`supportTickets.requesters.${ticket.requesterType}`)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {t(`supportTickets.types.${ticket.type}`)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
            {getPriorityIcon(ticket.priority)}
            {t(`supportTickets.priorities.${ticket.priority}`)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(ticket.created_at)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails?.(ticket.id)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          {t("supportTickets.viewDetails")}
        </button>
      </div>
    </div>
  );
};