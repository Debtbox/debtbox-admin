import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { useCreateSupportTicket, type CreateSupportTicketRequest, type CreateSupportTicketResponse } from "../api/createSupportTicket";
import { Input, Textarea, Select, Button } from "@/components/shared";
import type { SupportTicketPriority, SupportTicketRequesterType, SupportTicketType } from "@/enums";
import type { ApiError } from "@/types/ApiError";
import { toast } from "sonner";

const createTicketSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(255, "Subject must be less than 255 characters"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  type: z.enum(["GENERAL", "DEBT", "PAYMENT", "TECHNICAL", "ACCOUNTING", "OTHER"] as const),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"] as const),
  channel: z.string().optional(),
  requesterType: z.enum(["MERCHANT", "CUSTOMER", "INTERNAL"] as const),
  requesterMerchantId: z.number().optional(),
  requesterCustomerId: z.number().optional(),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
  assigneeUserId: z.union([z.string(), z.number()]).optional().refine((val) => {
    if (val === undefined || val === "") return true;
    if (typeof val === "string") return !isNaN(Number(val)) && Number(val) > 0;
    return typeof val === "number" && !isNaN(val) && val > 0;
  }, "Assignee User ID must be a valid number"),
  assignedTeam: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

export const CreateSupportTicket = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const createTicketMutation = useCreateSupportTicket({
    config: {
      onSuccess: (response: CreateSupportTicketResponse) => {
        if (response.success) {
          navigate(`/support-tickets/${response.data.id}`);
        }
      },
      onError: (error: ApiError) => {
        toast.error(error.response?.data?.message || "Failed to create ticket. Please try again.");
      },
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      type: "GENERAL",
      priority: "MEDIUM",
      requesterType: "INTERNAL",
      tags: [],
    },
  });

  const requesterType = watch("requesterType");

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

  const requesterOptions: { value: SupportTicketRequesterType; label: string }[] = [
    { value: "MERCHANT", label: t("supportTickets.requesters.MERCHANT") },
    { value: "CUSTOMER", label: t("supportTickets.requesters.CUSTOMER") },
    { value: "INTERNAL", label: t("supportTickets.requesters.INTERNAL") },
  ];

  const onSubmit = (data: CreateTicketFormData) => {
    // Clean up the data based on requester type and filter out empty values
    const submitData: CreateSupportTicketRequest = {
      subject: data.subject,
      description: data.description,
      type: data.type,
      priority: data.priority,
      requesterType: data.requesterType,
      // Only include optional fields if they have valid values
      ...(data.channel && { channel: data.channel }),
      ...(data.requesterType === "MERCHANT" && data.requesterMerchantId && { requesterMerchantId: data.requesterMerchantId }),
      ...(data.requesterType === "CUSTOMER" && data.requesterCustomerId && { requesterCustomerId: data.requesterCustomerId }),
      ...(data.relatedEntityType && { relatedEntityType: data.relatedEntityType }),
      ...(data.relatedEntityId && { relatedEntityId: data.relatedEntityId }),
      ...(data.assigneeUserId && { assigneeUserId: Number(data.assigneeUserId) }),
      ...(data.assignedTeam && { assignedTeam: data.assignedTeam }),
      ...(data.tags && data.tags.length > 0 && { tags: data.tags }),
    };

    createTicketMutation.mutate(submitData);
  };

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
          <Plus className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {t("supportTickets.createTicket", "Create Support Ticket")}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("supportTickets.basicInfo", "Basic Information")}
            </h2>

            <div className="space-y-4">
              <Input
                label={t("supportTickets.subject")}
                placeholder={t("supportTickets.subjectPlaceholder", "Enter ticket subject")}
                error={errors.subject}
                {...register("subject")}
              />

              <Textarea
                label={t("supportTickets.description")}
                placeholder={t("supportTickets.descriptionPlaceholder", "Describe the issue in detail")}
                rows={4}
                error={errors.description}
                {...register("description")}
              />

              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>
          </div>

          {/* Requester Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("supportTickets.requesterInfo")}
            </h2>

            <div className="space-y-4">
              <Select
                label={t("supportTickets.requester")}
                options={requesterOptions}
                error={errors.requesterType}
                {...register("requesterType")}
              />

              {requesterType === "MERCHANT" && (
                <Input
                  label={t("supportTickets.merchantId", "Merchant ID")}
                  type="number"
                  placeholder={t("supportTickets.merchantIdPlaceholder", "Enter merchant ID")}
                  error={errors.requesterMerchantId}
                  {...register("requesterMerchantId", { valueAsNumber: true })}
                />
              )}

              {requesterType === "CUSTOMER" && (
                <Input
                  label={t("supportTickets.customerId", "Customer ID")}
                  type="number"
                  placeholder={t("supportTickets.customerIdPlaceholder", "Enter customer ID")}
                  error={errors.requesterCustomerId}
                  {...register("requesterCustomerId", { valueAsNumber: true })}
                />
              )}

              <Input
                label={t("supportTickets.channel", "Channel")}
                placeholder={t("supportTickets.channelPlaceholder", "e.g., WEB, MOBILE, EMAIL")}
                error={errors.channel}
                {...register("channel")}
              />
            </div>
          </div>

          {/* Assignment Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("supportTickets.assignment", "Assignment")}
            </h2>

            <div className="space-y-4">
              <Input
                label={t("supportTickets.assigneeUserId", "Assignee User ID")}
                type="number"
                placeholder={t("supportTickets.assigneePlaceholder", "Enter assignee user ID")}
                error={errors.assigneeUserId}
                {...register("assigneeUserId")}
              />

              <Input
                label={t("supportTickets.assignedTeam", "Assigned Team")}
                placeholder={t("supportTickets.teamPlaceholder", "e.g., SUPPORT, TECH")}
                error={errors.assignedTeam}
                {...register("assignedTeam")}
              />
            </div>
          </div>

          {/* Related Entity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {t("supportTickets.relatedEntity", "Related Entity")}
            </h2>

            <div className="space-y-4">
              <Input
                label={t("supportTickets.entityType", "Entity Type")}
                placeholder={t("supportTickets.entityTypePlaceholder", "e.g., DEBT, PAYMENT")}
                error={errors.relatedEntityType}
                {...register("relatedEntityType")}
              />

              <Input
                label={t("supportTickets.entityId", "Entity ID")}
                placeholder={t("supportTickets.entityIdPlaceholder", "Enter entity ID")}
                error={errors.relatedEntityId}
                {...register("relatedEntityId")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/support-tickets')}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createTicketMutation.isPending}
            >
              {t("supportTickets.createTicket", "Create Ticket")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};