import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Info, X, Upload } from "lucide-react";
import { toast } from '@/lib/toast';
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { useMarkPayoutSettled } from "../api/markPayoutSettled";
import { formatHalala } from "../utils";

const schema = z.object({
  amountTransferredSar: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),
  externalTransferReference: z.string().min(1, "Reference is required"),
  settlementNote: z.string().optional(),
  proofFile: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Proof file is required"),
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const selectedFile = watch("proofFile");
  const fileName = selectedFile?.[0]?.name;

  const onSubmit = (values: FormValues) => {
    const amountHalala = Math.round(Number(values.amountTransferredSar) * 100);

    mutate(
      {
        id: payoutId,
        data: {
          amountTransferredHalala: amountHalala,
          externalTransferReference: values.externalTransferReference,
          settlementNote: values.settlementNote || undefined,
          proofFile: values.proofFile[0],
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

  const fileRegister = register("proofFile");

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
            placeholder={t("payouts.modals.markSettled.amountPlaceholder", "e.g. 173.90")}
            error={errors.amountTransferredSar}
            {...register("amountTransferredSar")}
          />

          <Input
            label={t("payouts.modals.markSettled.refLabel", "External Transfer Reference")}
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

          {/* File upload */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">
              {t("payouts.modals.markSettled.proofLabel", "Proof Document")}
              <span className="text-red-500 ms-0.5">*</span>
            </p>
            <div
              className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {fileName ? (
                  <p className="text-sm text-gray-900 truncate">{fileName}</p>
                ) : (
                  <p className="text-sm text-gray-400">
                    {t("payouts.modals.markSettled.proofPlaceholder", "Click to upload proof file")}
                  </p>
                )}
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              ref={(el) => {
                fileRegister.ref(el);
                (fileInputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
              }}
              name={fileRegister.name}
              onChange={fileRegister.onChange}
              onBlur={fileRegister.onBlur}
            />
            {errors.proofFile && (
              <p className="mt-1 text-xs text-red-500">{errors.proofFile.message}</p>
            )}
          </div>

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
