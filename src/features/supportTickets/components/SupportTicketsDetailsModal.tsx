import { X, AlertCircle, Calendar, Clock, MessageSquare, Tag, User } from "lucide-react";
import type { TFunction } from "i18next";
import type { SupportTicketDTO } from "@/types/SupportTicketDTO";
import { getStatusColor, getPriorityColor, formatDate } from "../utils";

interface SupportTicketsDetailsModalProps {
  ticket: SupportTicketDTO | null;
  isOpen: boolean;
  onClose: () => void;
  t: TFunction;
}

export const SupportTicketsDetailsModal = ({
  ticket,
  isOpen,
  onClose,
  t,
}: SupportTicketsDetailsModalProps) => {
  if (!isOpen || !ticket) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    #{ticket.code}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                    {t(`supportTickets.statuses.${ticket.status}`)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{ticket.subject}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {t("supportTickets.description")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    {t("supportTickets.status")}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                      {t(`supportTickets.statuses.${ticket.status}`)}
                    </span>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    {t("supportTickets.priority")}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      <AlertCircle className="w-3 h-3" />
                      {t(`supportTickets.priorities.${ticket.priority}`)}
                    </span>
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    {t("supportTickets.type")}
                  </label>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {t(`supportTickets.types.${ticket.type}`)}
                    </span>
                  </div>
                </div>

                {/* Requester Type */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    {t("supportTickets.requester")}
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {t(`supportTickets.requesters.${ticket.requesterType}`)}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    {t("supportTickets.created")}
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>
                </div>

                {/* Updated Date */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                    {t("supportTickets.updated")}
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {formatDate(ticket.updated_at || ticket.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Requester Info (if available) */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {t("supportTickets.requesterInfo")}
                </h3>
                <div className="space-y-2">
                  {ticket.requesterType === "MERCHANT" && ticket.requesterMerchantId && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span>
                        {t("supportTickets.requesters.MERCHANT")}: {ticket.requesterMerchantId}
                      </span>
                    </div>
                  )}
                  {ticket.requesterType === "CUSTOMER" && ticket.requesterCustomerId && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>
                        {t("supportTickets.requesters.CUSTOMER")}: {ticket.requesterCustomerId}
                      </span>
                    </div>
                  )}
                  {ticket.channel && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span>
                        {t("supportTickets.channel", "Channel")}: {ticket.channel}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Entity Info */}
              {ticket.relatedEntityId && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {t("supportTickets.relatedEntity", "Related Entity")}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span>
                        {t("supportTickets.entityType", "Entity Type")}: {ticket.relatedEntityType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>
                        {t("supportTickets.entityId", "Entity ID")}: {ticket.relatedEntityId}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignment Info */}
              {ticket.assigneeUserId && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {t("supportTickets.assignment", "Assignment")}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>
                        {t("supportTickets.assignedTo", "Assigned To")}: {ticket.assigneeUserId}
                      </span>
                    </div>
                    {ticket.assignedTeam && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span>
                          {t("supportTickets.team", "Team")}: {ticket.assignedTeam}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tags (if available) */}
              {ticket.tags && ticket.tags.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {t("supportTickets.tags", "Tags")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t("common.close", "Close")}
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                {t("supportTickets.replyToTicket", "Reply to Ticket")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
