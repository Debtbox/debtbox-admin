import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Info, Layers, X } from "lucide-react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { useSettleReceivable } from "../api/settleReceivable";
import { formatHalala } from "../utils";

const schema = z.object({
  amountSar: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),
  externalReference: z.string().min(1, "Reference is required"),
  settlementNote: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface SettleReceivableModalProps {
  receivableId: string;
  amountOutstandingHalala: number;
  isGrouped?: boolean;
  groupDebtsCount?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const SettleReceivableModal = ({
  receivableId,
  amountOutstandingHalala,
  isGrouped = false,
  groupDebtsCount,
  onClose,
  onSuccess,
}: SettleReceivableModalProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useSettleReceivable();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    const amountHalala = Math.round(Number(values.amountSar) * 100);

    if (amountHalala > amountOutstandingHalala) {
      setError("amountSar", {
        message: t(
          "receivables.modals.settle.amountExceedsOutstanding",
          "Amount cannot exceed outstanding balance",
        ),
      });
      return;
    }

    mutate(
      {
        id: receivableId,
        data: {
          amountHalala,
          externalReference: values.externalReference,
          settlementNote: values.settlementNote || undefined,
        },
      },
      {
        onSuccess: (res) => {
          const settled = res?.data?.isGrouped
            ? t("receivables.modals.settle.successGrouped", "Group receivable settled ({{count}} debts)", { count: res.data.debtIds?.length ?? groupDebtsCount ?? 1 })
            : t("receivables.modals.settle.success", "Receivable settled successfully");
          toast.success(settled);
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("receivables.modals.settle.error", "Failed to settle receivable");
          toast.error(msg);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("receivables.modals.settle.title", "Settle Receivable")}
            </h2>
            {isGrouped && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                <Layers className="w-3 h-3" />
                {t("groupedDebt.label", "Grouped debt")}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {isGrouped ? (
            <div className="flex gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <Layers className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-700">
                {t(
                  "receivables.modals.settle.groupedDescription",
                  "This receivable belongs to a grouped debt. Settlement will apply to all {{count}} debts in the group.",
                  { count: groupDebtsCount ?? 0 },
                )}
              </p>
            </div>
          ) : (
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                {t(
                  "receivables.modals.settle.description",
                  "Record a manual settlement for this receivable. Partial settlements set status to Partially Settled.",
                )}
              </p>
            </div>
          )}

          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {t("receivables.modals.settle.outstandingLabel", "Outstanding Amount")}
            </p>
            <p className="text-lg font-bold text-gray-900">{formatHalala(amountOutstandingHalala)}</p>
          </div>

          <Input
            label={t("receivables.modals.settle.amountLabel", "Amount to Settle (SAR)")}
            placeholder={t("receivables.modals.settle.amountPlaceholder", "e.g. 25.00")}
            error={errors.amountSar}
            {...register("amountSar")}
          />

          <Input
            label={t("receivables.modals.settle.refLabel", "External Reference")}
            placeholder={t("receivables.modals.settle.refPlaceholder", "e.g. BANK-TRX-1234")}
            error={errors.externalReference}
            {...register("externalReference")}
          />

          <Textarea
            label={t("receivables.modals.settle.noteLabel", "Settlement Note")}
            rows={3}
            placeholder={t(
              "receivables.modals.settle.notePlaceholder",
              "e.g. Collected by bank transfer.",
            )}
            error={errors.settlementNote}
            {...register("settlementNote")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {t("receivables.modals.settle.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isPending}>
              {t("receivables.modals.settle.confirm", "Settle")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
