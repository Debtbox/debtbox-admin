import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { RecoverySectionTabs } from "../components/RecoverySectionTabs";
import { DryRunResultsCard } from "../components/DryRunResultsCard";
import { useRebuildPayoutLedger } from "../api/rebuildPayoutLedger";
import type { RecoverySummary } from "../types";

const schema = z.object({
  paymentId: z.string().optional(),
  merchantId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  includeInstantOnly: z.boolean(),
  dryRun: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const PayoutLedgerView = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = useRebuildPayoutLedger();
  const [dryRunResult, setDryRunResult] = useState<RecoverySummary | null>(null);
  const [lastValues, setLastValues] = useState<FormValues | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { includeInstantOnly: false, dryRun: true },
  });

  const watchDryRun = watch("dryRun");

  const runMutation = (values: FormValues) => {
    mutate(
      {
        paymentId: values.paymentId ? parseInt(values.paymentId) : undefined,
        merchantId: values.merchantId ? parseInt(values.merchantId) : undefined,
        from: values.from || undefined,
        to: values.to || undefined,
        options: {
          dryRun: values.dryRun,
          includeInstantOnly: values.includeInstantOnly,
        },
      },
      {
        onSuccess: (res) => {
          if (values.dryRun) {
            setDryRunResult(res.data);
            setLastValues(values);
          } else {
            toast.success(t("recovery.payoutLedger.success", "Payout ledger rebuilt successfully."));
            setDryRunResult(null);
            setLastValues(null);
            setShowConfirm(false);
          }
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("recovery.payoutLedger.error", "Rebuild failed.");
          toast.error(msg);
          setShowConfirm(false);
        },
      },
    );
  };

  const onSubmit = (values: FormValues) => {
    setDryRunResult(null);
    runMutation(values);
  };

  const handleRunForReal = () => setShowConfirm(true);

  const handleConfirmRun = () => {
    if (!lastValues) return;
    runMutation({ ...lastValues, dryRun: false });
  };

  return (
    <div className="p-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("recovery.title", "Recovery Console")}
        </h1>
      </div>

      <RecoverySectionTabs />

      <div className="">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {t("recovery.tabs.payoutLedger", "Payout Ledger")}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("recovery.fields.paymentId", "Payment ID")}
                </label>
                <input
                  type="number"
                  {...register("paymentId")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                  onChange={() => setDryRunResult(null)}
                />
                {errors.paymentId && (
                  <p className="mt-1 text-xs text-red-600">{errors.paymentId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("recovery.fields.merchantId", "Merchant ID")}
                </label>
                <input
                  type="number"
                  {...register("merchantId")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                  onChange={() => setDryRunResult(null)}
                />
                {errors.merchantId && (
                  <p className="mt-1 text-xs text-red-600">{errors.merchantId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("recovery.fields.from", "From")}
                </label>
                <input
                  type="date"
                  {...register("from")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={() => setDryRunResult(null)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("recovery.fields.to", "To")}
                </label>
                <input
                  type="date"
                  {...register("to")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={() => setDryRunResult(null)}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                {...register("includeInstantOnly")}
                className="rounded border-gray-300"
                onChange={() => setDryRunResult(null)}
              />
              {t("recovery.options.includeInstantOnly", "Include instant payouts only")}
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-amber-700 cursor-pointer">
              <input
                type="checkbox"
                {...register("dryRun")}
                className="rounded border-gray-300"
              />
              {t("recovery.dryRunCheck", "Dry run (preview only, no writes)")}
            </label>

            <Button type="submit" loading={isPending && watchDryRun} fullWidth>
              {watchDryRun
                ? t("recovery.previewChanges", "Preview Changes")
                : t("recovery.applyChanges", "Apply Changes")}
            </Button>
          </form>
        </div>

        {dryRunResult && (
          <DryRunResultsCard
            result={dryRunResult}
            onRunForReal={handleRunForReal}
            isExecuting={isPending && !watchDryRun}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && dryRunResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("recovery.confirmModal.title", "Confirm Rebuild")}
              </h2>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  {t("recovery.confirmModal.warning", "This will write changes to the database.")}
                  {" "}{dryRunResult.changed} {t("recovery.changes", "changes")} {t("recovery.confirmModal.willBeApplied", "will be applied.")}
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  disabled={isPending}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button
                  type="button"
                  loading={isPending}
                  onClick={handleConfirmRun}
                  className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                >
                  {t("recovery.confirmModal.confirm", "Apply")} {dryRunResult.changed} {t("recovery.changes", "changes")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutLedgerView;
