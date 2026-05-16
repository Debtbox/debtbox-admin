import type { ReactNode } from "react";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ReceiptText,
  Building2,
  FileText,
  CheckCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { GroupedDebtBadge } from "@/components/shared/GroupedDebtBadge";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";
import { useGetReceivable } from "../api/getReceivable";
import { ReceivableStatusBadge } from "../components/ReceivableStatusBadge";
import { SettleReceivableModal } from "../components/SettleReceivableModal";
import { formatHalala, formatDate, SETTLEABLE_STATUSES } from "../utils";

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

const ReceivableDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canProcess = useCan(PERMISSIONS.PAYMENT_PROCESS);

  const { data, isLoading, isError, refetch } = useGetReceivable({ id: id! });
  const receivable = data?.data;

  const [showSettleModal, setShowSettleModal] = useState(false);

  const handleActionSuccess = () => {
    void refetch();
    setShowSettleModal(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError || !receivable) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/receivables")}>
          <ArrowLeft className="w-4 h-4 me-1" />
          {t("common.back", "Back")}
        </Button>
        <div className="mt-6 text-center text-gray-500">
          {t("receivables.errorLoadingDetail", "Failed to load receivable details.")}
        </div>
      </div>
    );
  }

  const isSettleable = SETTLEABLE_STATUSES.includes(receivable.status);

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/receivables")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 me-1" />
        {t("common.back", "Back")}
      </Button>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("receivables.title", "Receivable")} #{receivable.id.slice(0, 8)}
          </h1>
          <ReceivableStatusBadge status={receivable.status} />
          {receivable.groupedDebt?.isGrouped && (
            <GroupedDebtBadge count={receivable.groupedDebt.debtsCount} size="md" />
          )}
        </div>
        <p className="text-sm text-gray-500">{formatDate(receivable.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Receivable Details */}
          <SectionCard
            icon={<ReceiptText className="w-5 h-5" />}
            title={t("receivables.sections.receivableDetails", "Receivable Details")}
          >
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("receivables.fields.amountTotal", "Total Amount")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatHalala(receivable.amountTotalHalala)}
                </p>
              </div>
              <div
                className={`rounded-lg border p-4 ${
                  receivable.amountOutstandingHalala > 0
                    ? "border-red-100 bg-red-50"
                    : "border-green-100 bg-green-50"
                }`}
              >
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("receivables.fields.amountOutstanding", "Outstanding")}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    receivable.amountOutstandingHalala > 0 ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {formatHalala(receivable.amountOutstandingHalala)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("receivables.fields.status", "Status")}
                value={<ReceivableStatusBadge status={receivable.status} />}
              />
              <Field label={t("receivables.fields.createdAt", "Created At")} value={formatDate(receivable.createdAt)} />
              <Field
                label={t("receivables.fields.settledAt", "Settled At")}
                value={receivable.settledAt ? formatDate(receivable.settledAt) : null}
              />
            </div>
          </SectionCard>

          {/* Merchant & Business */}
          <SectionCard
            icon={<Building2 className="w-5 h-5" />}
            title={t("receivables.sections.merchantDetails", "Merchant & Business")}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("receivables.fields.merchant", "Merchant")}
                value={receivable.merchant.nameEn || receivable.merchant.nameAr}
              />
              <Field label="Merchant ID" value={`#${receivable.merchant.id}`} />
              <Field
                label={t("receivables.fields.business", "Business")}
                value={receivable.business.nameEn || receivable.business.nameAr}
              />
              <Field label="Business ID" value={`#${receivable.business.id}`} />
            </div>
          </SectionCard>

          {/* Debt Details */}
          <SectionCard
            icon={<FileText className="w-5 h-5" />}
            title={t("receivables.sections.debtDetails", "Debt Details")}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("receivables.fields.debt", "Debt")}
                value={
                  <Link
                    to={`/debts-management/${receivable.debt.id}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {receivable.debt.title}
                  </Link>
                }
              />
              <Field label="Debt ID" value={`#${receivable.debt.id}`} />
              <Field
                label={t("receivables.fields.debtAmount", "Debt Amount")}
                value={`SAR ${receivable.debt.amount}`}
              />
              <Field
                label={t("receivables.fields.debtStatus", "Debt Status")}
                value={receivable.debt.status}
              />
              <Field
                label={t("receivables.fields.dueDate", "Due Date")}
                value={formatDate(receivable.debt.dueDate)}
              />
            </div>
          </SectionCard>

          {/* Customer */}
          <SectionCard
            icon={<User className="w-5 h-5" />}
            title={t("receivables.fields.customer", "Customer")}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("receivables.fields.customer", "Customer")}
                value={receivable.debt.customer.nameEn || receivable.debt.customer.nameAr}
              />
              <Field label="Customer ID" value={`#${receivable.debt.customer.id}`} />
            </div>
          </SectionCard>

          {/* Allocations */}
          {receivable.allocations.length > 0 && (
            <SectionCard
              icon={<CheckCircle className="w-5 h-5" />}
              title={t("receivables.sections.allocations", "Settlement Allocations")}
              className="border-l-4 border-l-green-400"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("receivables.fields.amountApplied", "Amount Applied")}
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("receivables.fields.appliedAt", "Applied At")}
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("receivables.fields.settledBy", "Settled By")}
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("receivables.fields.payoutId", "Source")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {receivable.allocations.map((alloc) => (
                      <tr key={alloc.id} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-green-700">
                          {formatHalala(alloc.amountAppliedHalala)}
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">{formatDate(alloc.appliedAt)}</td>
                        <td className="py-2.5 px-3 text-gray-500 font-mono text-xs">
                          {alloc.createdBy}
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">
                          {alloc.payoutId ? (
                            <Link
                              to={`/payouts/${alloc.payoutId}`}
                              className="text-blue-600 hover:text-blue-800 underline text-xs font-mono"
                            >
                              {t("receivables.payout", "Payout")} #{alloc.payoutId.slice(0, 8)}
                            </Link>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              {t("receivables.directSettlement", "Direct settlement")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t("receivables.sections.quickInfo", "Quick Info")}
            </h3>
            <div className="space-y-3">
              <Field
                label={t("receivables.fields.status", "Status")}
                value={<ReceivableStatusBadge status={receivable.status} />}
              />
              <Field
                label={t("receivables.fields.amountTotal", "Total")}
                value={
                  <span className="font-semibold">{formatHalala(receivable.amountTotalHalala)}</span>
                }
              />
              <Field
                label={t("receivables.fields.amountOutstanding", "Outstanding")}
                value={
                  <span
                    className={`font-semibold ${
                      receivable.amountOutstandingHalala > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatHalala(receivable.amountOutstandingHalala)}
                  </span>
                }
              />
              <Field
                label={t("receivables.fields.merchant", "Merchant")}
                value={receivable.merchant.nameEn || receivable.merchant.nameAr}
              />
              <Field
                label={t("receivables.fields.createdAt", "Created At")}
                value={formatDate(receivable.createdAt)}
              />
            </div>
          </div>

          {/* Actions */}
          {canProcess && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {t("receivables.sections.actions", "Actions")}
              </h3>
              {isSettleable ? (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowSettleModal(true)}
                  className="justify-start gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t("receivables.actions.settle", "Settle Receivable")}
                </Button>
              ) : (
                <p className="text-sm text-gray-400">
                  {t("receivables.noActionsAvailable", "No actions available for this receivable.")}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {canProcess && showSettleModal && (
        <SettleReceivableModal
          receivableId={receivable.id}
          amountOutstandingHalala={receivable.amountOutstandingHalala}
          isGrouped={receivable.groupedDebt?.isGrouped ?? false}
          groupDebtsCount={receivable.groupedDebt?.debtsCount}
          onClose={() => setShowSettleModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
};

export default ReceivableDetails;
