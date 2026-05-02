import { CheckCircle, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import { Button } from "@/components/shared/Button";
import type {
  RecoverySummary,
  ReconcileReport,
  RecoveryResultItem,
  RecoveryAction,
} from "../types";

interface NormalizedResult {
  dryRun: boolean;
  total: number;
  changed: number;
  unchanged: number;
  notFound: number;
  errors: number;
  groups: { label: string; items: RecoveryResultItem[] }[];
}

function normalize(
  result: RecoverySummary | ReconcileReport,
): NormalizedResult {
  if ("report" in result) {
    const r = result.report;
    const groups = [
      { label: "Payments", items: r.payments?.items },
      { label: "Payouts", items: r.payouts?.items },
      { label: "Receivables", items: r.receivables?.items },
    ].filter((g) => g.items?.length > 0);

    const allItems = [
      ...(r.payments?.items || []),
      ...(r.payouts?.items || []),
      ...(r.receivables?.items || []),
    ];
    const changed =
      (r.payments?.changed || 0) +
      (r.payouts?.changed || 0) +
      (r.receivables?.changed || 0);
    const notFound = allItems.filter((i) => i.action === "not_found").length;
    return {
      dryRun: result.dryRun,
      total: allItems.length,
      changed,
      unchanged: allItems.length - changed - notFound,
      notFound,
      errors: 0,
      groups,
    };
  }

  return {
    dryRun: result.dryRun,
    total: result.total,
    changed: result.changed,
    unchanged: result.unchanged,
    notFound: result.notFound,
    errors: result.errors,
    groups: [{ label: "", items: result.items }],
  };
}

const ACTION_COLORS: Record<string, string> = {
  would_update: "bg-amber-100 text-amber-800 border-amber-200",
  would_create: "bg-amber-100 text-amber-800 border-amber-200",
  updated: "bg-green-100 text-green-800 border-green-200",
  created_payout_and_item: "bg-green-100 text-green-800 border-green-200",
  created_item_for_existing_payout:
    "bg-green-100 text-green-800 border-green-200",
  no_change: "bg-gray-100 text-gray-600 border-gray-200",
  skipped_existing_payout_item: "bg-gray-100 text-gray-600 border-gray-200",
  skipped_existing_receivable: "bg-gray-100 text-gray-600 border-gray-200",
  skipped_invalid_state: "bg-gray-100 text-gray-600 border-gray-200",
  not_found: "bg-red-100 text-red-700 border-red-200",
};

const ActionBadge = ({ action }: { action: RecoveryAction }) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        ACTION_COLORS[action] ?? "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {t(`recovery.actions.${action}`, action)}
    </span>
  );
};

interface DryRunResultsCardProps {
  result: RecoverySummary | ReconcileReport;
  onRunForReal?: () => void;
  isExecuting?: boolean;
  runLabel?: string;
}

export const DryRunResultsCard = ({
  result,
  onRunForReal,
  isExecuting,
  runLabel,
}: DryRunResultsCardProps) => {
  const { t } = useTranslation();
  const norm = normalize(result);

  const nothingToFix = norm.changed === 0 && norm.notFound === 0;

  return (
    <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("recovery.results.title", "Recovery Results")}
          </h3>
          {norm.dryRun && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3 h-3" />
              {t("recovery.dryRun", "DRY RUN — no changes written")}
            </span>
          )}
        </div>

        {/* Summary pills */}
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {t("recovery.results.total", "Total")}: {norm.total}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
            {t("recovery.results.changed", "Changed")}: {norm.changed}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
            {t("recovery.results.unchanged", "Unchanged")}: {norm.unchanged}
          </span>
          {norm.notFound > 0 && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
              {t("recovery.results.notFound", "Not Found")}: {norm.notFound}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {nothingToFix ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800 font-medium">
              {t(
                "recovery.results.nothingToFix",
                "Everything looks correct. No changes needed.",
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {norm.groups.map((group, gi) => (
              <div key={gi}>
                {group.label && (
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {t(`recovery.groups.${group.label.toLowerCase()}`, group.label)}
                  </p>
                )}
                {group.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {t("recovery.results.id", "ID")}
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {t("recovery.results.action", "Action")}
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {t("recovery.results.diffs", "Changes")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {group.items.map((item, idx) => {
                          const idKey = Object.keys(item).find(
                            (k) =>
                              k.endsWith("Id") && typeof item[k] === "number",
                          );
                          const displayId = idKey
                            ? `#${item[idKey] as number}`
                            : `#${idx + 1}`;
                          return (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-2.5 px-3 font-mono text-xs text-gray-500">
                                {displayId}
                              </td>
                              <td className="py-2.5 px-3">
                                <ActionBadge action={item.action} />
                              </td>
                              <td className="py-2.5 px-3">
                                {item.diffs &&
                                item.diffs.filter((d) => d.changed).length >
                                  0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {item.diffs
                                      .filter((d) => d.changed)
                                      .map((d) => (
                                        <span
                                          key={d.field}
                                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-100"
                                        >
                                          {d.field}
                                        </span>
                                      ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    —
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-2">
                    {t("recovery.results.noItems", "No items.")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Run for Real button */}
        {norm.dryRun && norm.changed > 0 && onRunForReal && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <Button
              variant="outline"
              onClick={onRunForReal}
              loading={isExecuting}
              className="border-amber-400 text-amber-700 hover:bg-amber-50"
            >
              {runLabel ?? t("recovery.runForReal", "Run for Real")} (
              {norm.changed} {t("recovery.changes", "changes")})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
