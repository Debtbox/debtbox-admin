import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast } from '@/lib/toast';
import { AlertTriangle, X, Search } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { RecoverySectionTabs } from "../components/RecoverySectionTabs";
import { DryRunResultsCard } from "../components/DryRunResultsCard";
import { useInspectPaymentRecovery } from "../api/inspectPaymentRecovery";
import { useRecomputePayment } from "../api/recomputePayment";
import type { RecoverySummary, FieldDiff } from "../types";

const inspectSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
});

const recomputeSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  recomputeFees: z.boolean(),
  fixPaidFields: z.boolean(),
  dryRun: z.boolean(),
});

type InspectForm = z.infer<typeof inspectSchema>;
type RecomputeForm = z.infer<typeof recomputeSchema>;

const DiffRow = ({ diff }: { diff: FieldDiff }) => {
  const { t } = useTranslation();
  return (
    <tr className="hover:bg-gray-50">
      <td className="py-2.5 px-3 text-sm font-mono text-gray-600">{diff.field}</td>
      <td className="py-2.5 px-3 text-sm text-red-600">{String(diff.current ?? "—")}</td>
      <td className="py-2.5 px-3 text-sm text-green-700">{String(diff.expected ?? "—")}</td>
      <td className="py-2.5 px-3">
        {diff.changed ? (
          <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
            {t("recovery.results.changed", "changed")}
          </span>
        ) : (
          <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
            {t("recovery.results.same", "same")}
          </span>
        )}
      </td>
    </tr>
  );
};

const PaymentRecoveryView = () => {
  const { t } = useTranslation();
  const [inspectId, setInspectId] = useState<number | null>(null);
  const [dryRunResult, setDryRunResult] = useState<RecoverySummary | null>(null);
  const [lastRecomputeValues, setLastRecomputeValues] = useState<RecomputeForm | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: inspectData, isLoading: isInspecting, isError: isInspectError } =
    useInspectPaymentRecovery({ id: inspectId });

  const { mutate: recompute, isPending: isRecomputing } = useRecomputePayment();

  const inspectForm = useForm<InspectForm>({
    resolver: zodResolver(inspectSchema),
  });

  const recomputeForm = useForm<RecomputeForm>({
    resolver: zodResolver(recomputeSchema),
    defaultValues: { recomputeFees: true, fixPaidFields: true, dryRun: true },
  });

  const watchDryRun = recomputeForm.watch("dryRun");

  const onInspect = (values: InspectForm) => {
    setInspectId(parseInt(values.paymentId));
  };

  const runRecompute = (values: RecomputeForm) => {
    recompute(
      {
        paymentId: parseInt(values.paymentId),
        options: {
          recomputeFees: values.recomputeFees,
          fixPaidFields: values.fixPaidFields,
          dryRun: values.dryRun,
        },
      },
      {
        onSuccess: (res) => {
          if (values.dryRun) {
            setDryRunResult(res.data);
            setLastRecomputeValues(values);
          } else {
            toast.success(t("recovery.recompute.success", "Payment recomputed successfully."));
            setDryRunResult(null);
            setLastRecomputeValues(null);
            setShowConfirm(false);
          }
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("recovery.recompute.error", "Recompute failed.");
          toast.error(msg);
          setShowConfirm(false);
        },
      },
    );
  };

  const onRecomputeSubmit = (values: RecomputeForm) => {
    setDryRunResult(null);
    runRecompute(values);
  };

  const handleRunForReal = () => setShowConfirm(true);

  const handleConfirmRun = () => {
    if (!lastRecomputeValues) return;
    runRecompute({ ...lastRecomputeValues, dryRun: false });
  };

  const inspect = inspectData?.data;

  return (
    <div className="p-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("recovery.title", "Recovery Console")}
        </h1>
      </div>

      <RecoverySectionTabs />

      <div className="space-y-6">
        {/* Inspect Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {t("recovery.paymentRecovery.inspect", "Inspect Payment")}
          </h2>
          <form
            onSubmit={inspectForm.handleSubmit(onInspect)}
            className="flex gap-3 items-end"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("recovery.fields.paymentId", "Payment ID")}
              </label>
              <input
                type="number"
                {...inspectForm.register("paymentId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 123"
              />
              {inspectForm.formState.errors.paymentId && (
                <p className="mt-1 text-xs text-red-600">
                  {inspectForm.formState.errors.paymentId.message}
                </p>
              )}
            </div>
            <Button type="submit" loading={isInspecting} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              {t("recovery.inspect", "Inspect")}
            </Button>
          </form>

          {isInspectError && (
            <p className="mt-4 text-sm text-red-600">
              {t("recovery.inspectNotFound", "Payment not found or inspection failed.")}
            </p>
          )}

          {inspect && (
            <div className="mt-4">
              {inspect.differences.length === 0 ? (
                <p className="text-sm text-green-700 font-medium">
                  {t("recovery.inspectOk", "No differences found. Payment data looks correct.")}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t("recovery.results.field", "Field")}
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t("recovery.results.current", "Current")}
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t("recovery.results.expected", "Expected")}
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t("recovery.results.status", "Status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {inspect.differences.map((d, i) => (
                        <DiffRow key={i} diff={d} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recompute Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {t("recovery.paymentRecovery.recompute", "Recompute Payment")}
          </h2>

          <form
            onSubmit={recomputeForm.handleSubmit(onRecomputeSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("recovery.fields.paymentId", "Payment ID")} *
              </label>
              <input
                type="number"
                {...recomputeForm.register("paymentId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 123"
                onChange={() => setDryRunResult(null)}
              />
              {recomputeForm.formState.errors.paymentId && (
                <p className="mt-1 text-xs text-red-600">
                  {recomputeForm.formState.errors.paymentId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  {...recomputeForm.register("recomputeFees")}
                  className="rounded border-gray-300"
                  onChange={() => setDryRunResult(null)}
                />
                {t("recovery.options.recomputeFees", "Recompute fees")}
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  {...recomputeForm.register("fixPaidFields")}
                  className="rounded border-gray-300"
                  onChange={() => setDryRunResult(null)}
                />
                {t("recovery.options.fixPaidFields", "Fix paid fields")}
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-amber-700 cursor-pointer">
              <input
                type="checkbox"
                {...recomputeForm.register("dryRun")}
                className="rounded border-gray-300"
              />
              {t("recovery.dryRunCheck", "Dry run (preview only, no writes)")}
            </label>

            <Button type="submit" loading={isRecomputing && watchDryRun} fullWidth>
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
            isExecuting={isRecomputing && !watchDryRun}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && dryRunResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("recovery.confirmModal.title", "Confirm Recompute")}
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
                  disabled={isRecomputing}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button
                  type="button"
                  loading={isRecomputing}
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

export default PaymentRecoveryView;
