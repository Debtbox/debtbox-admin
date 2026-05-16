import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Flag, X } from "lucide-react";
import { toast } from '@/lib/toast';
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { useFlagDebtForReview } from "../api/flagDebt";

const schema = z.object({
  reason: z.string().min(10, "Flag reason must be at least 10 characters").max(500),
});

type FormValues = z.infer<typeof schema>;

interface FlagDebtModalProps {
  debtId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const FlagDebtModal = ({ debtId, onClose, onSuccess }: FlagDebtModalProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useFlagDebtForReview();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    mutate(
      { id: debtId, data: { reason: values.reason } },
      {
        onSuccess: (res) => {
          const count = res?.data?.affectedCount ?? 1;
          const msg = count > 1
            ? t("debts.modals.flag.successGrouped", "Debt flagged for review ({{count}} debts in the group were affected)", { count })
            : t("debts.modals.flag.success", "Debt flagged for review");
          toast.success(msg);
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("debts.modals.flag.error", "Failed to flag debt");
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
            <Flag className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("debts.modals.flag.title", "Flag for Review")}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="flex gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <Flag className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-700">
              {t(
                "debts.modals.flag.info",
                "Flagging this debt will mark it for manual review by the admin team."
              )}
            </p>
          </div>

          <Textarea
            label={t("debts.modals.flag.reasonLabel", "Flag Reason")}
            rows={3}
            placeholder={t("debts.modals.flag.reasonPlaceholder", "Describe the reason for flagging this debt...")}
            error={errors.reason}
            {...register("reason")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isPending}>
              {t("debts.modals.flag.confirmButton", "Flag for Review")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
