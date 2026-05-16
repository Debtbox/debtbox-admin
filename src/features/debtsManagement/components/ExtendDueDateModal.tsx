import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { CalendarClock, X } from "lucide-react";
import { toast } from '@/lib/toast';
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { useExtendDebtDueDate } from "../api/extendDebtDueDate";

const schema = z.object({
  newDueDate: z
    .string()
    .min(1, "New due date is required")
    .refine((v) => new Date(v) > new Date(), "Due date must be in the future"),
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
});

type FormValues = z.infer<typeof schema>;

interface ExtendDueDateModalProps {
  debtId: number;
  currentDueDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExtendDueDateModal = ({
  debtId,
  currentDueDate,
  onClose,
  onSuccess,
}: ExtendDueDateModalProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useExtendDebtDueDate();

  const today = new Date().toISOString().split("T")[0];

  const formattedCurrent = new Date(currentDueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    mutate(
      { id: debtId, data: { newDueDate: values.newDueDate, reason: values.reason } },
      {
        onSuccess: (res) => {
          const count = res?.data?.affectedCount ?? 1;
          const msg = count > 1
            ? t("debts.modals.extend.successGrouped", "Due date extended ({{count}} debts in the group were affected)", { count })
            : t("debts.modals.extend.success", "Due date extended successfully");
          toast.success(msg);
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("debts.modals.extend.error", "Failed to extend due date");
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("debts.modals.extend.title", "Extend Due Date")}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            {t("debts.modals.extend.currentDueDate", "Current due date")}:{" "}
            <span className="font-medium text-gray-900">{formattedCurrent}</span>
          </p>

          <Input
            type="date"
            label={t("debts.modals.extend.newDueDateLabel", "New Due Date")}
            min={today}
            error={errors.newDueDate}
            {...register("newDueDate")}
          />

          <Textarea
            label={t("debts.modals.extend.reasonLabel", "Reason for Extension")}
            rows={3}
            placeholder={t("debts.modals.extend.reasonPlaceholder", "Explain why the due date is being extended...")}
            error={errors.reason}
            {...register("reason")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isPending}>
              {t("debts.modals.extend.confirmButton", "Extend Due Date")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
