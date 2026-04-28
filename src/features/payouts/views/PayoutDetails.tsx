import type { ReactNode } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Wallet,
  Building2,
  Receipt,
  CheckCircle,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";
import { useGetPayout } from "../api/getPayout";
import { PayoutStatusBadge } from "../components/PayoutStatusBadge";
import { MarkSettledModal } from "../components/MarkSettledModal";
import { formatHalala, formatDate } from "../utils";

const Field = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
    <div className="text-sm text-gray-900">{value ?? <span className="text-gray-400">—</span>}</div>
  </div>
);

const SectionCard = ({
  icon,
  title,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className ?? ""}`}>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-400">{icon}</span>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const SETTLEABLE_STATUSES = ["READY", "PROCESSING", "PARTIALLY_SETTLED"];

const PayoutDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canProcess = useCan(PERMISSIONS.PAYMENT_PROCESS);

  const { data, isLoading, isError, refetch } = useGetPayout({ id: id! });
  const payout = data?.data;

  const [showMarkSettled, setShowMarkSettled] = useState(false);

  const handleActionSuccess = () => {
    void refetch();
    setShowMarkSettled(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError || !payout) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/payouts")}>
          <ArrowLeft className="w-4 h-4 me-1" />
          {t("common.back", "Back")}
        </Button>
        <div className="mt-6 text-center text-gray-500">
          {t("payouts.errorLoading", "Failed to load payout details.")}
        </div>
      </div>
    );
  }

  const isSettleable = SETTLEABLE_STATUSES.includes(payout.status);
  const hasSettlement = !!payout.manualSettlement?.settledAt;

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/payouts")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 me-1" />
        {t("common.back", "Back")}
      </Button>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("payouts.payoutId", "Payout")} #{payout.id}
          </h1>
          <PayoutStatusBadge status={payout.status} />
        </div>
        <p className="text-sm text-gray-500 capitalize">{payout.payoutMethod}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payout Details */}
          <SectionCard
            icon={<Wallet className="w-5 h-5" />}
            title={t("payouts.sections.payoutDetails", "Payout Details")}
          >
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("payouts.fields.netAmount", "Net Amount")}
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {formatHalala(payout.merchantNetAmountHalala)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("payouts.fields.payoutMethod", "Payout Method")}
                </p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{payout.payoutMethod}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t("payouts.fields.periodStart", "Period Start")} value={formatDate(payout.periodStart)} />
              <Field label={t("payouts.fields.periodEnd", "Period End")} value={formatDate(payout.periodEnd)} />
              <Field
                label={t("payouts.fields.status", "Status")}
                value={<PayoutStatusBadge status={payout.status} />}
              />
            </div>
          </SectionCard>

          {/* Merchant */}
          <SectionCard
            icon={<Building2 className="w-5 h-5" />}
            title={t("payouts.sections.merchant", "Merchant")}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label={t("payouts.fields.merchantName", "Merchant")} value={payout.merchant.nameEn} />
              <Field label="ID" value={payout.merchant.id} />
            </div>
          </SectionCard>

          {/* Payment Items */}
          {payout.items.length > 0 && (
            <SectionCard
              icon={<Receipt className="w-5 h-5" />}
              title={t("payouts.sections.items", "Payment Items")}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payouts.fields.paymentId", "Payment ID")}
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payouts.fields.debt", "Debt")}
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payouts.fields.paymentStatus", "Status")}
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payouts.fields.merchantNet", "Net")}
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payouts.fields.debtboxFee", "Debtbox Fee")}
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payouts.fields.providerFee", "Provider Fee")}
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payouts.fields.feeType", "Fee Type")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payout.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-mono text-xs text-gray-500">
                          #{item.paymentId}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="text-sm text-gray-900 max-w-[160px] truncate">{item.debt.title}</p>
                          <p className="text-xs text-gray-400">
                            SAR {item.debt.totalAmount} · ID: {item.debt.id}
                          </p>
                        </td>
                        <td className="py-2.5 px-3 text-gray-700">{item.paymentStatus}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-green-700">
                          {formatHalala(item.merchantNetAmountHalala)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-600">
                          {formatHalala(item.debtboxFeeHalala)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-gray-600">
                          <span>{formatHalala(item.providerFeeTotalHalala)}</span>
                          {item.providerFeeIncludedInDebtboxFee && (
                            <span className="block text-xs text-gray-400">
                              {t("payouts.fields.includedInFee", "incl. in fee")}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-500">
                          {item.providerFeeTypeApplied}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {/* Settlement Details */}
          {hasSettlement && (
            <SectionCard
              icon={<CheckCircle className="w-5 h-5" />}
              title={t("payouts.sections.settlement", "Settlement Details")}
              className="border-l-4 border-l-green-400"
            >
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label={t("payouts.fields.settledAt", "Settled At")}
                  value={formatDate(payout.manualSettlement.settledAt)}
                />
                <Field
                  label={t("payouts.fields.settledBy", "Settled By (User ID)")}
                  value={
                    payout.manualSettlement.settledByUserId
                      ? `#${payout.manualSettlement.settledByUserId}`
                      : null
                  }
                />
                <Field
                  label={t("payouts.fields.amountTransferred", "Amount Transferred")}
                  value={formatHalala(payout.manualSettlement.amountTransferredHalala)}
                />
                <Field
                  label={t("payouts.fields.externalRef", "External Reference")}
                  value={payout.manualSettlement.externalTransferReference}
                />
                <Field
                  label={t("payouts.fields.note", "Settlement Note")}
                  value={payout.manualSettlement.settlementNote}
                />
                <Field
                  label={t("payouts.fields.proof", "Proof")}
                  value={
                    payout.manualSettlement.proofPreviewUrl ||
                    payout.manualSettlement.proofDownloadUrl ? (
                      <div className="flex items-center gap-3">
                        {payout.manualSettlement.proofPreviewUrl && (
                          <a
                            href={payout.manualSettlement.proofPreviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {t("payouts.fields.proofPreview", "Preview")}
                          </a>
                        )}
                        {payout.manualSettlement.proofDownloadUrl && (
                          <a
                            href={payout.manualSettlement.proofDownloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {t("payouts.fields.proofDownload", "Download")}
                          </a>
                        )}
                      </div>
                    ) : payout.manualSettlement.proofReference ?? null
                  }
                />
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t("payouts.sections.quickInfo", "Payout Information")}
            </h3>
            <div className="space-y-3">
              <Field
                label={t("payouts.fields.status", "Status")}
                value={<PayoutStatusBadge status={payout.status} />}
              />
              <Field
                label={t("payouts.fields.netAmount", "Net Amount")}
                value={
                  <span className="font-semibold text-green-700">
                    {formatHalala(payout.merchantNetAmountHalala)}
                  </span>
                }
              />
              <Field
                label={t("payouts.fields.payoutMethod", "Method")}
                value={<span className="capitalize">{payout.payoutMethod}</span>}
              />
              <Field
                label={t("payouts.fields.periodStart", "Period Start")}
                value={formatDate(payout.periodStart)}
              />
              <Field
                label={t("payouts.fields.periodEnd", "Period End")}
                value={formatDate(payout.periodEnd)}
              />
              <Field
                label={t("payouts.columns.merchant", "Merchant")}
                value={payout.merchant.nameEn}
              />
            </div>
          </div>

          {/* Actions */}
          {canProcess && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {t("payouts.sections.actions", "Actions")}
              </h3>
              {isSettleable ? (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowMarkSettled(true)}
                  className="justify-start gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t("payouts.actions.markSettled", "Mark as Settled")}
                </Button>
              ) : (
                <p className="text-sm text-gray-400">
                  {t("payouts.noActionsAvailable", "No actions available for this payout.")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {canProcess && showMarkSettled && (
        <MarkSettledModal
          payoutId={payout.id}
          netAmountHalala={payout.merchantNetAmountHalala}
          onClose={() => setShowMarkSettled(false)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
};

export default PayoutDetails;
