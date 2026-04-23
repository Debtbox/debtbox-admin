import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Textarea } from "@/components/shared/Textarea";
import { useCreateSalesLead } from "../api/createSalesLead";

const schema = z.object({
  leadType: z.enum(["MERCHANT", "CUSTOMER"], {
    message: "Lead type is required",
  }),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  source: z.enum(["REFERRAL", "CAMPAIGN", "COLD", "EVENT", "OTHER"], {
    message: "Source is required",
  }),
  status: z
    .enum(["NEW", "CONTACTED", "INTERESTED", "CONVERTED", "LOST"])
    .optional(),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateSalesLeadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateSalesLeadModal = ({
  onClose,
  onSuccess,
}: CreateSalesLeadModalProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useCreateSalesLead();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: "NEW" },
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        leadType: values.leadType,
        fullName: values.fullName,
        phone: values.phone || undefined,
        email: values.email || undefined,
        source: values.source,
        status: values.status,
        notes: values.notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            t(
              "salesLeads.modals.create.success",
              "Sales lead created successfully",
            ),
          );
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ??
            t("salesLeads.modals.create.error", "Failed to create sales lead");
          toast.error(msg);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("salesLeads.modals.create.title", "Create Sales Lead")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={t("salesLeads.fields.leadType", "Lead Type") + " *"}
              placeholder={t("salesLeads.fields.selectLeadType", "Select type")}
              error={errors.leadType}
              options={[
                {
                  value: "MERCHANT",
                  label: t("salesLeads.leadTypes.MERCHANT", "Merchant"),
                },
                {
                  value: "CUSTOMER",
                  label: t("salesLeads.leadTypes.CUSTOMER", "Customer"),
                },
              ]}
              {...register("leadType")}
            />

            <Select
              label={t("salesLeads.fields.source", "Source") + " *"}
              placeholder={t("salesLeads.fields.selectSource", "Select source")}
              error={errors.source}
              options={[
                {
                  value: "REFERRAL",
                  label: t("salesLeads.sources.REFERRAL", "Referral"),
                },
                {
                  value: "CAMPAIGN",
                  label: t("salesLeads.sources.CAMPAIGN", "Campaign"),
                },
                { value: "COLD", label: t("salesLeads.sources.COLD", "Cold") },
                {
                  value: "EVENT",
                  label: t("salesLeads.sources.EVENT", "Event"),
                },
                {
                  value: "OTHER",
                  label: t("salesLeads.sources.OTHER", "Other"),
                },
              ]}
              {...register("source")}
            />
          </div>

          <Input
            label={t("salesLeads.fields.fullName", "Full Name") + " *"}
            placeholder={t(
              "salesLeads.fields.fullNamePlaceholder",
              "e.g. Ahmad Al Saleh",
            )}
            error={errors.fullName}
            {...register("fullName")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("salesLeads.fields.phone", "Phone")}
              placeholder="+966512345678"
              error={errors.phone}
              {...register("phone")}
            />

            <Input
              label={t("salesLeads.fields.email", "Email")}
              type="email"
              placeholder="ahmad@example.com"
              error={errors.email}
              {...register("email")}
            />
          </div>

          <Select
            label={t("salesLeads.fields.status", "Status")}
            error={errors.status}
            options={[
              { value: "NEW", label: t("salesLeads.statuses.NEW", "New") },
              {
                value: "CONTACTED",
                label: t("salesLeads.statuses.CONTACTED", "Contacted"),
              },
              {
                value: "INTERESTED",
                label: t("salesLeads.statuses.INTERESTED", "Interested"),
              },
              {
                value: "CONVERTED",
                label: t("salesLeads.statuses.CONVERTED", "Converted"),
              },
              { value: "LOST", label: t("salesLeads.statuses.LOST", "Lost") },
            ]}
            {...register("status")}
          />

          <Textarea
            label={t("salesLeads.fields.notes", "Notes")}
            rows={3}
            placeholder={t(
              "salesLeads.fields.notesPlaceholder",
              "Any additional notes...",
            )}
            error={errors.notes}
            {...register("notes")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isPending}>
              {t("salesLeads.modals.create.confirmButton", "Create Lead")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
