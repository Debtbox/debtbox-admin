import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from '@/lib/toast';
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { MerchantSelect } from "@/components/shared/MerchantSelect";
import { RecoverySectionTabs } from "../components/RecoverySectionTabs";
import { DryRunResultsCard } from "../components/DryRunResultsCard";
import { useReconcile } from "../api/reconcile";
import type { ReconcileReport } from "../types";

const schema = z.object({
  merchantId: z.string().min(1, "Merchant is required"),
  from: z.string().optional(),
  to: z.string().optional(),
  fixPayments: z.boolean(),
  fixPayouts: z.boolean(),
  fixReceivables: z.boolean(),
  fixDebtFeeSnapshots: z.boolean(),
  dryRun: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const ReconcileView = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = useReconcile();
  const [dryRunResult, setDryRunResult] = useState<ReconcileReport | null>(null);
  const [lastValues, setLastValues] = useState<FormValues | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      merchantId: "",
      fixPayments: true,
      fixPayouts: true,
      fixReceivables: true,
      fixDebtFeeSnapshots: false,
      dryRun: true,
    },
  });

  const watchedValues = watch();

  const runMutation = (values: FormValues) => {
    mutate(
      {
        merchantId: parseInt(values.merchantId),
        from: values.from || undefined,
        to: values.to || undefined,
        options: {
          fixPayments: values.fixPayments,
          fixPayouts: values.fixPayouts,
          fixReceivables: values.fixReceivables,
          fixDebtFeeSnapshots: values.fixDebtFeeSnapshots,
          dryRun: values.dryRun,
        },
      },
      {
        onSuccess: (res) => {
          if (values.dryRun) {
            setDryRunResult(res.data);
            setLastValues(values);
          } else {
            toast.success(
              t("recovery.reconcile.success", "Reconciliation complete."),
            );
            setDryRunResult(null);
            setLastValues(null);
            setShowConfirm(false);
          }
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ??
            t("recovery.reconcile.error", "Reconciliation failed.");
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

  const changed = dryRunResult
    ? dryRunResult.report.payments?.changed +
      dryRunResult.report.payouts?.changed +
      dryRunResult.report.receivables?.changed
    : 0;

  return (
    <div className="p-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("recovery.title", "Recovery Console")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t(
            "recovery.subtitle",
            "Superadmin repair tools for payment data integrity.",
          )}
        </p>
      </div>

      <RecoverySectionTabs />

      <div className="">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {t("recovery.tabs.reconcile", "Reconcile")}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={control}
              name="merchantId"
              render={({ field }) => (
                <MerchantSelect
                  value={field.value}
                  onChange={(id) => {
                    field.onChange(id);
                    setDryRunResult(null);
                  }}
                  label={t("recovery.fields.merchantId", "Merchant")}
                  required
                  error={errors.merchantId?.message}
                />
              )}
            />

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

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t("recovery.fields.fixOptions", "Fix Options")}
              </p>
              {[
                {
                  name: "fixPayments" as const,
                  label: t(
                    "recovery.options.fixPayments",
                    "Recompute Payments",
                  ),
                },
                {
                  name: "fixPayouts" as const,
                  label: t(
                    "recovery.options.fixPayouts",
                    "Rebuild Payout Ledger",
                  ),
                },
                {
                  name: "fixReceivables" as const,
                  label: t(
                    "recovery.options.fixReceivables",
                    "Rebuild Receivables",
                  ),
                },
                {
                  name: "fixDebtFeeSnapshots" as const,
                  label: t(
                    "recovery.options.fixDebtFeeSnapshots",
                    "Rebuild Debt Fee Snapshots",
                  ),
                },
              ].map((opt) => (
                <label
                  key={opt.name}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    {...register(opt.name)}
                    className="rounded border-gray-300"
                    onChange={() => setDryRunResult(null)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-amber-700 cursor-pointer pt-2">
              <input
                type="checkbox"
                {...register("dryRun")}
                className="rounded border-gray-300"
              />
              {t("recovery.dryRunCheck", "Dry run (preview only, no writes)")}
            </label>

            <Button
              type="submit"
              loading={isPending && watchedValues.dryRun}
              fullWidth
            >
              {watchedValues.dryRun
                ? t("recovery.previewChanges", "Preview Changes")
                : t("recovery.applyChanges", "Apply Changes")}
            </Button>
          </form>
        </div>

        {dryRunResult && (
          <DryRunResultsCard
            result={dryRunResult}
            onRunForReal={handleRunForReal}
            isExecuting={isPending && !watchedValues.dryRun}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && dryRunResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("recovery.confirmModal.title", "Confirm Reconciliation")}
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
                <div className="text-sm text-amber-800">
                  <p className="font-medium">
                    {t(
                      "recovery.confirmModal.warning",
                      "This will write changes to the database.",
                    )}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs">
                    {dryRunResult.report.payments.changed > 0 && (
                      <li>
                        {t("recovery.results.changed", "Changed")}{" "}
                        {dryRunResult.report.payments.changed}{" "}
                        {t("recovery.confirmModal.payments", "payments")}
                      </li>
                    )}
                    {dryRunResult.report.payouts.changed > 0 && (
                      <li>
                        {t("recovery.results.changed", "Changed")}{" "}
                        {dryRunResult.report.payouts.changed}{" "}
                        {t("recovery.confirmModal.payouts", "payouts")}
                      </li>
                    )}
                    {dryRunResult.report.receivables.changed > 0 && (
                      <li>
                        {t("recovery.results.changed", "Changed")}{" "}
                        {dryRunResult.report.receivables.changed}{" "}
                        {t("recovery.confirmModal.receivables", "receivables")}
                      </li>
                    )}
                  </ul>
                  <p className="mt-2 font-semibold">
                    {t("recovery.confirmModal.total", "Total")}: {changed}{" "}
                    {t("recovery.changes", "changes")}
                  </p>
                </div>
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
                  {t(
                    "recovery.confirmModal.confirm",
                    "Apply {count} Changes",
                  ).replace("{count}", String(changed))}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReconcileView;
