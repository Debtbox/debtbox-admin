import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, AlertCircle, Calendar, Clock, MessageSquare, Tag, User, Edit, Settings, Plus, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useGetSupportTicketDetails } from "../api/getSupportTicketDetails";
import { useUpdateSupportTicket } from "../api/updateSupportTicket";
import { useChangeSupportTicketStatus } from "../api/changeSupportTicketStatus";
import { useAddSupportTicketMessage } from "../api/addSupportTicketMessage";
import { getStatusColor, getPriorityColor, formatDate } from "../utils";
import { Button, Input, Textarea, Select } from "@/components/shared";
import type { ApiError } from "@/types/ApiError";
import type { SupportTicketDTO, SupportTicketMessageDTO } from "@/types/SupportTicketDTO";
import type { UpdateSupportTicketRequest } from "../api/updateSupportTicket";
import type { AddSupportTicketMessageRequest } from "../api/addSupportTicketMessage";
import type { SupportTicketPriority, SupportTicketType, SupportTicketStatus, RelatedEntityType } from "@/enums";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan, useCanAny } from "@/auth/rbac";

export const SupportTicketDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for modals and forms
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const canUpdate = useCan(PERMISSIONS.TICKET_UPDATE);
  const canChangeStatus = useCan(PERMISSIONS.TICKET_CHANGE_STATUS);
  const canAddReply = useCan(PERMISSIONS.TICKET_ADD_REPLY);
  const canAddInternalNote = useCan(PERMISSIONS.TICKET_ADD_INTERNAL_NOTE);
  const canViewInternalNotes = useCan(PERMISSIONS.TICKET_VIEW_INTERNAL_NOTES);
  const canUseActions = useCanAny([
    PERMISSIONS.TICKET_UPDATE,
    PERMISSIONS.TICKET_CHANGE_STATUS,
    PERMISSIONS.TICKET_ADD_REPLY,
    PERMISSIONS.TICKET_ADD_INTERNAL_NOTE,
  ]);

  const { data, isLoading, error, refetch } = useGetSupportTicketDetails({
    id: id!,
  });

  // Mutation hooks
  const updateTicketMutation = useUpdateSupportTicket({
    config: {
      onSuccess: () => {
        refetch();
        setShowEditModal(false);
      },
    },
  });

  const changeStatusMutation = useChangeSupportTicketStatus({
    config: {
      onSuccess: () => {
        refetch();
        setShowStatusModal(false);
      },
    },
  });

  const addMessageMutation = useAddSupportTicketMessage({
    config: {
      onSuccess: () => {
        refetch();
        setShowMessageModal(false);
      },
    },
  });

  const ticket = data?.data.ticket;
  const messages = (data?.data.messages || []).filter(
    (message) => !message.isInternalNote || canViewInternalNotes,
  );
  const requester = data?.data.requester;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <MessageSquare className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("supportTickets.error")}
          </h3>
          <p className="text-gray-500">
            {(error as ApiError)?.message || "Ticket not found"}
          </p>
          <Button
            onClick={() => navigate('/support-tickets')}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back", "Back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={() => navigate('/support-tickets')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back", "Back")}
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-gray-500">
            #{ticket.code}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
            {t(`supportTickets.statuses.${ticket.status}`)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{ticket.subject}</h1>

        {/* Action Buttons */}
        {canUseActions && (
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {canUpdate && (
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                {t("common.edit", "Edit")}
              </Button>
            )}
            {canChangeStatus && (
              <Button
                onClick={() => setShowStatusModal(true)}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t("supportTickets.changeStatus", "Change Status")}
              </Button>
            )}
            {(canAddReply || canAddInternalNote) && (
              <Button
                onClick={() => setShowMessageModal(true)}
                variant="primary"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("supportTickets.addMessage", "Add Message")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("supportTickets.description")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Messages */}
          {messages.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t("supportTickets.messages", "Messages")}
              </h2>
              <div className="space-y-4">
                {messages.map((message: SupportTicketMessageDTO) => (
                  <div key={message.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        {message.isInternalNote ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                        <span>
                          {message.isInternalNote
                            ? t("supportTickets.internalNote", "Internal Note")
                            : t("supportTickets.publicMessage", "Public Message")
                          }
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {message.body}
                    </p>
                    {message.senderType && (
                      <div className="mt-2 text-xs text-gray-500">
                        {t("supportTickets.sentBy", "Sent by")}: {message.senderType}
                        {message.senderUserId && ` (User ID: ${message.senderUserId})`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("supportTickets.additionalInfo", "Additional Information")}
            </h2>
            <div className="space-y-4">
              {ticket.channel && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span>
                    {t("supportTickets.channel", "Channel")}: {ticket.channel}
                  </span>
                </div>
              )}

              {ticket.lastMessageAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>
                    {t("supportTickets.lastMessage", "Last Message")}: {formatDate(ticket.lastMessageAt)}
                  </span>
                </div>
              )}

              {ticket.resolvedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {t("supportTickets.resolvedAt", "Resolved At")}: {formatDate(ticket.resolvedAt)}
                  </span>
                </div>
              )}

              {ticket.closedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {t("supportTickets.closedAt", "Closed At")}: {formatDate(ticket.closedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("supportTickets.ticketInfo", "Ticket Information")}
            </h3>
            <div className="space-y-4">
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
                    {formatDate(ticket.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Requester Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {t("supportTickets.requesterInfo")}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span>
                  {t("supportTickets.requesterType", "Requester Type")}: {requester?.type || ticket.requesterType}
                </span>
              </div>
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
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

          {/* Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                {t("supportTickets.tags", "Tags")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag: string) => (
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
      </div>

      {/* Edit Ticket Modal */}
      {canUpdate && showEditModal && (
        <EditTicketModal
          ticket={ticket}
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => updateTicketMutation.mutate({ id: ticket.id, data })}
          isLoading={updateTicketMutation.isPending}
        />
      )}

      {/* Change Status Modal */}
      {canChangeStatus && showStatusModal && (
        <ChangeStatusModal
          currentStatus={ticket.status}
          onClose={() => setShowStatusModal(false)}
          onSubmit={(status) => changeStatusMutation.mutate({ id: ticket.id, data: { status } })}
          isLoading={changeStatusMutation.isPending}
        />
      )}

      {/* Add Message Modal */}
      {(canAddReply || canAddInternalNote) && showMessageModal && (
        <AddMessageModal
          onClose={() => setShowMessageModal(false)}
          onSubmit={(data) => addMessageMutation.mutate({ id: ticket.id, data })}
          isLoading={addMessageMutation.isPending}
          canAddInternalNote={canAddInternalNote}
        />
      )}
    </div>
  );
};

// Edit Ticket Modal Component
const EditTicketModal = ({
  ticket,
  onClose,
  onSubmit,
  isLoading
}: {
  ticket: SupportTicketDTO;
  onClose: () => void;
  onSubmit: (data: UpdateSupportTicketRequest) => void;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateSupportTicketRequest>({
    defaultValues: {
      type: ticket.type,
      priority: ticket.priority,
      tags: ticket.tags || [],
      relatedEntityType: ticket.relatedEntityType || undefined,
      relatedEntityId: ticket.relatedEntityId || undefined,
    },
  });

  const typeOptions: { value: SupportTicketType; label: string }[] = [
    { value: "GENERAL", label: t("supportTickets.types.GENERAL") },
    { value: "DEBT", label: t("supportTickets.types.DEBT") },
    { value: "PAYMENT", label: t("supportTickets.types.PAYMENT") },
    { value: "TECHNICAL", label: t("supportTickets.types.TECHNICAL") },
    { value: "ACCOUNTING", label: t("supportTickets.types.ACCOUNTING") },
    { value: "OTHER", label: t("supportTickets.types.OTHER") },
  ];

  const priorityOptions: { value: SupportTicketPriority; label: string }[] = [
    { value: "LOW", label: t("supportTickets.priorities.LOW") },
    { value: "MEDIUM", label: t("supportTickets.priorities.MEDIUM") },
    { value: "HIGH", label: t("supportTickets.priorities.HIGH") },
    { value: "URGENT", label: t("supportTickets.priorities.URGENT") },
  ];

  const relatedEntityTypeOptions: { value: RelatedEntityType | ""; label: string }[] = [
    { value: "", label: t("supportTickets.selectEntityType", "Select Entity Type") },
    { value: "DEBT", label: t("supportTickets.relatedEntityTypes.DEBT", "Debt") },
    { value: "PAYMENT", label: t("supportTickets.relatedEntityTypes.PAYMENT", "Payment") },
    { value: "MERCHANT", label: t("supportTickets.relatedEntityTypes.MERCHANT", "Merchant") },
    { value: "CUSTOMER", label: t("supportTickets.relatedEntityTypes.CUSTOMER", "Customer") },
    { value: "BUSINESS", label: t("supportTickets.relatedEntityTypes.BUSINESS", "Business") },
    { value: "SANAD", label: t("supportTickets.relatedEntityTypes.SANAD", "Sanad") },
    { value: "OTHER", label: t("supportTickets.relatedEntityTypes.OTHER", "Other") },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("supportTickets.editTicket", "Edit Ticket")}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Select
              label={t("supportTickets.type")}
              options={typeOptions}
              error={errors.type}
              {...register("type")}
            />

            <Select
              label={t("supportTickets.priority")}
              options={priorityOptions}
              error={errors.priority}
              {...register("priority")}
            />

            <Select
              label={t("supportTickets.entityType", "Entity Type")}
              options={relatedEntityTypeOptions}
              error={errors.relatedEntityType}
              {...register("relatedEntityType")}
            />

            <Input
              label={t("supportTickets.entityId", "Entity ID")}
              placeholder={t("supportTickets.entityIdPlaceholder", "Enter entity ID")}
              error={errors.relatedEntityId}
              {...register("relatedEntityId")}
            />

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" variant="primary" loading={isLoading}>
                {t("common.save", "Save")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Change Status Modal Component
const ChangeStatusModal = ({
  currentStatus,
  onClose,
  onSubmit,
  isLoading
}: {
  currentStatus: SupportTicketStatus;
  onClose: () => void;
  onSubmit: (status: SupportTicketStatus) => void;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ status: SupportTicketStatus }>({
    defaultValues: {
      status: currentStatus,
    },
  });

  const statusOptions = [
    { value: "NEW", label: t("supportTickets.statuses.NEW", "New") },
    { value: "OPEN", label: t("supportTickets.statuses.OPEN", "Open") },
    { value: "WAITING_ON_REQUESTER", label: t("supportTickets.statuses.WAITING_ON_REQUESTER", "Waiting on Requester") },
    { value: "WAITING_ON_INTERNAL", label: t("supportTickets.statuses.WAITING_ON_INTERNAL", "Waiting on Internal") },
    { value: "RESOLVED", label: t("supportTickets.statuses.RESOLVED", "Resolved") },
    { value: "CLOSED", label: t("supportTickets.statuses.CLOSED", "Closed") },
    { value: "REOPENED", label: t("supportTickets.statuses.REOPENED", "Reopened") },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("supportTickets.changeStatus", "Change Status")}
          </h2>

          <form onSubmit={handleSubmit((data) => onSubmit(data.status))} className="space-y-4">
            <Select
              label={t("supportTickets.status")}
              options={statusOptions}
              error={errors.status}
              {...register("status")}
            />

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" variant="primary" loading={isLoading}>
                {t("common.save", "Save")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add Message Modal Component
const AddMessageModal = ({
  onClose,
  onSubmit,
  isLoading,
  canAddInternalNote,
}: {
  onClose: () => void;
  onSubmit: (data: AddSupportTicketMessageRequest) => void;
  isLoading: boolean;
  canAddInternalNote: boolean;
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<AddSupportTicketMessageRequest>({
    defaultValues: {
      body: "",
      isInternalNote: false,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("supportTickets.addMessage", "Add Message")}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              label={t("supportTickets.message", "Message")}
              placeholder={t("supportTickets.messagePlaceholder", "Enter your message")}
              rows={4}
              error={errors.body}
              {...register("body", { required: "Message is required" })}
            />

            {canAddInternalNote && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isInternalNote"
                  {...register("isInternalNote")}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isInternalNote" className="text-sm text-gray-700">
                  {t("supportTickets.internalNote", "Internal Note")}
                </label>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" variant="primary" loading={isLoading}>
                {t("supportTickets.sendMessage", "Send Message")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
