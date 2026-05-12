import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  DollarSign,
  Building2,
  Link as LinkIcon,
  Wrench,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/shared/Button";
import { GroupedDebtBadge } from "@/components/shared/GroupedDebtBadge";
import { useGetPayment } from "../api/getPayment";
import { formatHalala, formatDate } from "../utils";
import { useIsSuperadmin } from "@/auth/rbac";

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

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const colors: Record<string, string> = {
    succeeded: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        colors[status] ?? "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {t(`payments.statuses.${status}`, status)}
    </span>
  );
};

const PaymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSuperadmin = useIsSuperadmin();

  const { data, isLoading, isError } = useGetPayment({ id: id! });
  const payment = data?.data;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError || !payment) {
    return (
      <div className="p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/payments")}>
          <ArrowLeft className="w-4 h-4 me-1" />
          {t("common.back", "Back")}
        </Button>
        <div className="mt-6 text-center text-gray-500">
          {t("payments.errorLoading", "Failed to load payment details.")}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/payments")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 me-1" />
        {t("common.back", "Back")}
      </Button>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("payments.paymentId", "Payment")} #{payment.id}
          </h1>
          <PaymentStatusBadge status={payment.status} />
          {payment.groupedDebt?.isGrouped && (
            <GroupedDebtBadge count={payment.groupedDebt.debtsCount} size="md" />
          )}
        </div>
        <p className="text-sm text-gray-500 capitalize">
          {payment.paymentMethod} · {payment.payoutMethod}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fee Breakdown */}
          <SectionCard
            icon={<DollarSign className="w-5 h-5" />}
            title={t("payments.sections.feeBreakdown", "Fee Breakdown")}
          >
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("payments.fields.grossAmount", "Gross Amount")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatHalala(payment.grossAmountHalala)}
                </p>
              </div>
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("payments.fields.merchantNet", "Merchant Net")}
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {formatHalala(payment.merchantNetAmountHalala)}
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              <div className="py-2 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {t("payments.fields.debtboxFee", "Debtbox Fee")}
                </span>
                <span className="text-sm font-medium text-red-600">
                  -{formatHalala(payment.debtboxFeeHalala)}
                </span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-600">
                    {t("payments.fields.providerFee", "Provider Fee")}
                  </span>
                  {payment.providerFeeIncludedInDebtboxFee && (
                    <span className="ms-2 text-xs text-gray-400">
                      {t("payments.fields.includedInFee", "incl. in Debtbox fee")}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatHalala(payment.providerFeeTotalHalala)}
                </span>
              </div>
              {payment.instantPayoutFeesHalala > 0 && (
                <div className="py-2 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t("payments.fields.instantPayoutFee", "Instant Payout Fee")}
                  </span>
                  <span className="text-sm font-medium text-red-600">
                    -{formatHalala(payment.instantPayoutFeesHalala)}
                  </span>
                </div>
              )}
              <div className="py-2 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  {t("payments.fields.totalDeductions", "Total Deductions")}
                </span>
                <span className="text-sm font-bold text-red-600">
                  -{formatHalala(payment.merchantVisibleTotalDeductionsHalala)}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <Field
                label={t("payments.fields.paymentMethod", "Payment Method")}
                value={payment.paymentMethod}
              />
              <Field
                label={t("payments.fields.payoutMethod", "Payout Method")}
                value={<span className="capitalize">{payment.payoutMethod}</span>}
              />
              {payment.paymentBrand && (
                <Field
                  label={t("payments.fields.brand", "Card Brand")}
                  value={payment.paymentBrand}
                />
              )}
              <Field
                label={t("payments.fields.paidAt", "Paid At")}
                value={formatDate(payment.paidAt) ?? "—"}
              />
              <Field
                label={t("payments.fields.providerFeeType", "Provider Fee Type")}
                value={payment.providerFeeTypeApplied}
              />
              <Field
                label={t("payments.fields.currency", "Currency")}
                value={payment.currency}
              />
            </div>
          </SectionCard>

          {/* Payout Links */}
          {payment.payouts.length > 0 && (
            <SectionCard
              icon={<LinkIcon className="w-5 h-5" />}
              title={t("payments.sections.payoutLinks", "Payout Links")}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payments.columns.payoutId", "Payout ID")}
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payments.columns.payoutStatus", "Status")}
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {t("payments.columns.payoutNet", "Net Amount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payment.payouts.map((p) => (
                      <tr key={p.payoutItemId} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3">
                          <Link
                            to={`/payouts/${p.payoutId}`}
                            className="text-blue-600 hover:text-blue-800 font-mono text-xs"
                          >
                            #{p.payoutId}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3 text-gray-700">{p.payoutStatus}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-green-700">
                          {formatHalala(p.merchantNetAmountHalala)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {/* Grouped Debt Summary */}
          {payment.groupedDebt?.isGrouped && (
            <SectionCard
              icon={<Layers className="w-5 h-5" />}
              title={t("groupedDebt.summaryTitle", "Grouped Debt Breakdown")}
              className="border-l-4 border-l-indigo-400"
            >
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {t("groupedDebt.fields.debtsCount", "Child Debts")}
                  </p>
                  <p className="text-lg font-bold text-indigo-700">
                    {payment.groupedDebt.debtsCount}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {t("groupedDebt.fields.groupAmount", "Group Amount")}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    SAR {Number(payment.groupedDebt.groupAmount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {t("groupedDebt.fields.groupStatus", "Group Status")}
                  </p>
                  <p className="text-lg font-bold text-gray-900 capitalize">
                    {payment.groupedDebt.groupStatus}
                  </p>
                </div>
              </div>
              {payment.groupedDebt.debtIds.length > 0 && (
                <p className="mb-3 text-xs text-gray-500 font-mono">
                  {t("groupedDebt.debtIds", "Debt IDs")}:{" "}
                  {payment.groupedDebt.debtIds.join(", ")}
                </p>
              )}
              {payment.groupedDebt.debts.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          ID
                        </th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          {t("debts.columns.title", "Title")}
                        </th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          {t("debts.columns.amount", "Amount")}
                        </th>
                        <th className="text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          {t("debts.columns.status", "Status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {payment.groupedDebt.debts.map((child) => (
                        <tr key={child.id}>
                          <td className="px-3 py-2 font-mono text-xs text-gray-500">
                            <Link
                              to={`/debts-management/${child.id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              #{child.id}
                            </Link>
                          </td>
                          <td className="px-3 py-2 text-gray-800 max-w-[260px] truncate">
                            {child.title ?? "—"}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {child.amount != null
                              ? `SAR ${Number(child.amount).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}`
                              : "—"}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 capitalize">
                            {child.status ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          )}

          {/* Debt & Merchant */}
          <SectionCard
            icon={<Building2 className="w-5 h-5" />}
            title={t("payments.sections.debtMerchant", "Debt & Merchant")}
          >
            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("payments.fields.debt", "Debt")}
                value={
                  <span>
                    {payment.debt.title}{" "}
                    <span className="text-xs text-gray-400">#{payment.debt.id}</span>
                  </span>
                }
              />
              <Field
                label={t("payments.fields.debtStatus", "Debt Status")}
                value={payment.debt.status}
              />
              <Field
                label={t("payments.fields.merchant", "Merchant")}
                value={
                  <span>
                    {payment.merchant.nameEn}{" "}
                    <span className="text-xs text-gray-400">#{payment.merchant.id}</span>
                  </span>
                }
              />
              <Field
                label={t("payments.fields.customer", "Customer")}
                value={
                  <Link
                    to={`/customers/${payment.customer.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {payment.customer.nameEn}{" "}
                    <span className="text-xs text-gray-400">#{payment.customer.id}</span>
                  </Link>
                }
              />
            </div>
          </SectionCard>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t("payments.sections.quickInfo", "Payment Information")}
            </h3>
            <div className="space-y-3">
              <Field
                label={t("payments.fields.status", "Status")}
                value={<PaymentStatusBadge status={payment.status} />}
              />
              <Field
                label={t("payments.fields.grossAmount", "Gross Amount")}
                value={<span className="font-semibold">{formatHalala(payment.grossAmountHalala)}</span>}
              />
              <Field
                label={t("payments.fields.merchantNet", "Merchant Net")}
                value={
                  <span className="font-semibold text-green-700">
                    {formatHalala(payment.merchantNetAmountHalala)}
                  </span>
                }
              />
              <Field
                label={t("payments.fields.paidAt", "Paid At")}
                value={formatDate(payment.paidAt) ?? "—"}
              />
              <Field
                label={t("payments.fields.merchant", "Merchant")}
                value={payment.merchant.nameEn}
              />
            </div>
          </div>

          {/* Recovery Tools — superadmin only */}
          {isSuperadmin && (
            <div className="bg-white rounded-lg border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-semibold text-gray-900">
                  {t("recovery.title", "Recovery Tools")}
                </h3>
              </div>
              <Link
                to={`/recovery/payments?paymentId=${payment.id}`}
                className="inline-flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Wrench className="w-4 h-4" />
                {t("recovery.inspectPayment", "Inspect & Repair Payment")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
