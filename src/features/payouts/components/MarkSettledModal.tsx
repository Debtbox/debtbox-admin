import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Info, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { useMarkPayoutSettled } from "../api/markPayoutSettled";
import { formatHalala } from "../utils";

const schema = z.object({
  amountTransferredSar: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
      { message: "Must be a positive number" },
    ),
  externalTransferReference: z.string().optional(),
  settlementNote: z.string().optional(),
  proofReference: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface MarkSettledModalProps {
  payoutId: number;
  netAmountHalala: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const MarkSettledModal = ({
  payoutId,
  netAmountHalala,
  onClose,
  onSuccess,
}: MarkSettledModalProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useMarkPayoutSettled();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    const amountHalala = values.amountTransferredSar
      ? Math.round(Number(values.amountTransferredSar) * 100)
      : undefined;

    mutate(
      {
        id: payoutId,
        data: {
          amountTransferredHalala: amountHalala,
          externalTransferReference: values.externalTransferReference || undefined,
          settlementNote: values.settlementNote || undefined,
          proofReference: values.proofReference || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("payouts.modals.markSettled.success", "Payout marked as settled"));
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("payouts.modals.markSettled.error", "Failed to mark payout as settled");
          toast.error(msg);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-lg w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("payouts.modals.markSettled.title", "Mark Payout as Settled")}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              {t(
                "payouts.modals.markSettled.description",
                "This records that the payout was manually settled outside of Debtbox. No bank transfer will be executed.",
              )}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {t("payouts.fields.netAmount", "Net Amount")}
            </p>
            <p className="text-lg font-bold text-gray-900">{formatHalala(netAmountHalala)}</p>
          </div>

          <Input
            label={t("payouts.modals.markSettled.amountLabel", "Amount Transferred (SAR)")}
            placeholder={t(
              "payouts.modals.markSettled.amountPlaceholder",
              "Leave empty to use full net amount",
            )}
            error={errors.amountTransferredSar}
            {...register("amountTransferredSar")}
          />

          <Input
            label={t(
              "payouts.modals.markSettled.refLabel",
              "External Transfer Reference",
            )}
            placeholder={t("payouts.modals.markSettled.refPlaceholder", "e.g. BANK-TRX-12345")}
            error={errors.externalTransferReference}
            {...register("externalTransferReference")}
          />

          <Textarea
            label={t("payouts.modals.markSettled.noteLabel", "Settlement Note")}
            rows={3}
            placeholder={t(
              "payouts.modals.markSettled.notePlaceholder",
              "e.g. Settled manually by accountant.",
            )}
            error={errors.settlementNote}
            {...register("settlementNote")}
          />

          <Input
            label={t("payouts.modals.markSettled.proofLabel", "Proof Reference")}
            placeholder={t(
              "payouts.modals.markSettled.proofPlaceholder",
              "e.g. oss://bucket/path/to/proof.pdf",
            )}
            error={errors.proofReference}
            {...register("proofReference")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {t("payouts.modals.markSettled.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isPending}>
              {t("payouts.modals.markSettled.confirm", "Mark as Settled")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
