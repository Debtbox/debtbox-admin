import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { toast } from '@/lib/toast';
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Textarea } from "@/components/shared/Textarea";
import { useUserStore } from "@/stores/UserStore";
import type { SalesLead } from "@/types/SalesLeadDTO";
import {
  useCreateSalesLeadMutation,
  useUpdateSalesLeadMutation,
} from "../api/sales";
import { SalesUserSelect } from "./SalesUserSelect";
import { isSalesAdminRole } from "../utils";

const schema = z
  .object({
    leadType: z.enum(["MERCHANT", "CUSTOMER"], {
      message: "Lead type is required",
    }),
    fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
    phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    crNumber: z.string().optional(),
    source: z.enum(["REFERRAL", "CAMPAIGN", "COLD", "EVENT", "OTHER"], {
      message: "Source is required",
    }),
    status: z.enum(["NEW", "CONTACTED", "INTERESTED", "LOST"]).optional(),
    notes: z.string().max(1000).optional(),
    assignedSalesUserId: z.string().optional(),
  })
  .refine((values) => values.phone || values.email || values.crNumber, {
    message: "Phone, email, or CR number is required",
    path: ["phone"],
  });

type FormValues = z.infer<typeof schema>;

interface CreateSalesLeadModalProps {
  lead?: SalesLead;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateSalesLeadModal = ({
  lead,
  onClose,
  onSuccess,
}: CreateSalesLeadModalProps) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const canManageAssignee = isSalesAdminRole(user?.role?.slug);
  const createMutation = useCreateSalesLeadMutation();
  const updateMutation = useUpdateSalesLeadMutation();
  const isEdit = Boolean(lead);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: "NEW" },
  });

  useEffect(() => {
    if (!lead) return;
    reset({
      leadType: lead.leadType,
      fullName: lead.fullName,
      phone: lead.phone ?? "",
      email: lead.email ?? "",
      crNumber: lead.crNumber ?? "",
      source: lead.source,
      status: lead.status === "CONVERTED" ? "INTERESTED" : lead.status,
      notes: lead.notes ?? "",
      assignedSalesUserId: lead.assignedSalesUserId
        ? String(lead.assignedSalesUserId)
        : "",
    });
  }, [lead, reset]);

  const onSubmit = (values: FormValues) => {
    const assignedSalesUserId =
      canManageAssignee && values.assignedSalesUserId
        ? Number(values.assignedSalesUserId)
        : undefined;
    const payload = {
      leadType: values.leadType,
      fullName: values.fullName,
      phone: values.phone || undefined,
      email: values.email || undefined,
      crNumber: values.crNumber || undefined,
      source: values.source,
      status: values.status,
      notes: values.notes || undefined,
      ...(canManageAssignee ? { assignedSalesUserId } : {}),
    };
    if (isEdit) {
      updateMutation.mutate({ id: lead!.id, payload }, {
        onSuccess: () => {
          toast.success(t("salesLeads.modals.edit.success", "Sales lead updated successfully"));
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data
              ?.message ??
            t("salesLeads.modals.create.error", "Failed to save sales lead");
          toast.error(msg);
        },
      });
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t("salesLeads.modals.create.success", "Sales lead created successfully"));
        onSuccess();
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ??
          t("salesLeads.modals.create.error", "Failed to save sales lead");
        toast.error(msg);
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit
              ? t("salesLeads.modals.edit.title", "Edit Sales Lead")
              : t("salesLeads.modals.create.title", "Create Sales Lead")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={`${t("salesLeads.fields.leadType", "Lead Type")} *`}
              placeholder={t("salesLeads.fields.selectLeadType", "Select type")}
              error={errors.leadType}
              options={[
                { value: "MERCHANT", label: t("salesLeads.leadTypes.MERCHANT", "Merchant") },
                { value: "CUSTOMER", label: t("salesLeads.leadTypes.CUSTOMER", "Customer") },
              ]}
              {...register("leadType")}
            />
            <Select
              label={`${t("salesLeads.fields.source", "Source")} *`}
              placeholder={t("salesLeads.fields.selectSource", "Select source")}
              error={errors.source}
              options={["REFERRAL", "CAMPAIGN", "COLD", "EVENT", "OTHER"].map((source) => ({
                value: source,
                label: t(`salesLeads.sources.${source}`, source),
              }))}
              {...register("source")}
            />
          </div>

          <Input
            label={`${t("salesLeads.fields.fullName", "Full Name")} *`}
            error={errors.fullName}
            {...register("fullName")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label={t("salesLeads.fields.phone", "Phone")} error={errors.phone} {...register("phone")} />
            <Input label={t("salesLeads.fields.email", "Email")} type="email" error={errors.email} {...register("email")} />
            <Input label={t("salesLeads.fields.crNumber", "CR Number")} error={errors.crNumber} {...register("crNumber")} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={t("salesLeads.fields.status", "Status")}
              error={errors.status}
              options={["NEW", "CONTACTED", "INTERESTED", "LOST"].map((status) => ({
                value: status,
                label: t(`salesLeads.statuses.${status}`, status),
              }))}
              {...register("status")}
            />
            {canManageAssignee && (
              <Controller
                control={control}
                name="assignedSalesUserId"
                render={({ field }) => (
                  <SalesUserSelect
                    value={field.value}
                    onChange={field.onChange}
                    allowUnassigned
                    error={errors.assignedSalesUserId}
                  />
                )}
              />
            )}
          </div>

          <Textarea
            label={t("salesLeads.fields.notes", "Notes")}
            rows={3}
            error={errors.notes}
            {...register("notes")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isPending}>
              {isEdit
                ? t("common.save", "Save")
                : t("salesLeads.modals.create.confirmButton", "Create Lead")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
