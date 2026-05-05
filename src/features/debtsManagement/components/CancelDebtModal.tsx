import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { AlertTriangle, X } from "lucide-react";
import { toast } from '@/lib/toast';
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { useCancelDebt } from "../api/cancelDebt";

const schema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters").max(500),
});

type FormValues = z.infer<typeof schema>;

interface CancelDebtModalProps {
  debtId: number;
  debtTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelDebtModal = ({ debtId, debtTitle, onClose, onSuccess }: CancelDebtModalProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useCancelDebt();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    mutate(
      { id: debtId, data: { reason: values.reason } },
      {
        onSuccess: () => {
          toast.success(t("debts.modals.cancel.success", "Debt cancelled successfully"));
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("debts.modals.cancel.error", "Failed to cancel debt");
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("debts.modals.cancel.title", "Cancel Debt")}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              {t(
                "debts.modals.cancel.warning",
                `This action is irreversible. The debt "${debtTitle}" will be permanently cancelled.`
              )}
            </p>
          </div>

          <Textarea
            label={t("debts.modals.cancel.reasonLabel", "Cancellation Reason")}
            rows={4}
            placeholder={t("debts.modals.cancel.reasonPlaceholder", "Explain why this debt is being cancelled...")}
            error={errors.reason}
            {...register("reason")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="submit"
              loading={isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {t("debts.modals.cancel.confirmButton", "Cancel Debt")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
