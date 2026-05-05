import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from '@/lib/toast';
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { MerchantSelect } from "@/components/shared/MerchantSelect";
import { DebtSelect } from "@/components/shared/DebtSelect";
import { RecoverySectionTabs } from "../components/RecoverySectionTabs";
import { DryRunResultsCard } from "../components/DryRunResultsCard";
import { useRebuildDebtSnapshots } from "../api/rebuildDebtSnapshots";
import type { RecoverySummary } from "../types";

const schema = z.object({
  debtId: z.string().optional(),
  merchantId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  dryRun: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const DebtSnapshotsView = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = useRebuildDebtSnapshots();
  const [dryRunResult, setDryRunResult] = useState<RecoverySummary | null>(null);
  const [lastValues, setLastValues] = useState<FormValues | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scopeError, setScopeError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { debtId: "", merchantId: "", dryRun: true },
  });

  const watchDryRun = watch("dryRun");
  const watchedMerchantId = watch("merchantId");

  const runMutation = (values: FormValues) => {
    mutate(
      {
        debtId: values.debtId ? parseInt(values.debtId) : undefined,
        merchantId: values.merchantId ? parseInt(values.merchantId) : undefined,
        from: values.from || undefined,
        to: values.to || undefined,
        options: { dryRun: values.dryRun },
      },
      {
        onSuccess: (res) => {
          if (values.dryRun) {
            setDryRunResult(res.data);
            setLastValues(values);
          } else {
            toast.success(t("recovery.debtSnapshots.success", "Debt fee snapshots rebuilt successfully."));
            setDryRunResult(null);
            setLastValues(null);
            setShowConfirm(false);
          }
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("recovery.debtSnapshots.error", "Rebuild failed.");
          toast.error(msg);
          setShowConfirm(false);
        },
      },
    );
  };

  const onSubmit = (values: FormValues) => {
    if (!values.debtId && !values.merchantId && !values.from && !values.to) {
      setScopeError("At least one scope field (Debt, Merchant, From, or To) is required.");
      return;
    }
    setScopeError(null);
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
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            {t("recovery.tabs.debtSnapshots", "Debt Snapshots")}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {t("recovery.debtSnapshots.description", "At least one scope field is required.")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="merchantId"
                render={({ field }) => (
                  <MerchantSelect
                    value={field.value ?? ""}
                    onChange={(id) => {
                      field.onChange(id);
                      setDryRunResult(null);
                      setScopeError(null);
                    }}
                    label={t("recovery.fields.merchantId", "Merchant")}
                    placeholder={t("common.optional", "Optional")}
                  />
                )}
              />
              <Controller
                control={control}
                name="debtId"
                render={({ field }) => (
                  <DebtSelect
                    value={field.value ?? ""}
                    onChange={(id) => {
                      field.onChange(id);
                      setDryRunResult(null);
                      setScopeError(null);
                    }}
                    merchantId={watchedMerchantId}
                    label={t("recovery.fields.debtId", "Debt")}
                    placeholder={t("common.optional", "Optional")}
                  />
                )}
              />
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

            {scopeError && (
              <p className="text-xs text-red-600">{scopeError}</p>
            )}

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
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
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

export default DebtSnapshotsView;
