import type { ReactNode } from "react";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  User,
  Receipt,
  CalendarPlus,
  Flag,
  Bell,
  XCircle,
  Calculator,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { useGetDebt } from "../api/getDebt";
import { useGetDebtFeePreview } from "../api/getDebtFeePreview";
import { DebtStatusBadge } from "../components/DebtStatusBadge";
import { CancelDebtModal } from "../components/CancelDebtModal";
import { ExtendDueDateModal } from "../components/ExtendDueDateModal";
import { FlagDebtModal } from "../components/FlagDebtModal";
import { ResendNotificationModal } from "../components/ResendNotificationModal";
import { formatDebtAmount, formatHalalaAmount, isDebtOverdue } from "../utils";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan, useCanAny } from "@/auth/rbac";
import { formatDate } from "@/utils/formatDate";

const Field = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <div className="text-sm text-gray-900">
      {value ?? <span className="text-gray-400">—</span>}
    </div>
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
  <div
    className={`bg-white rounded-lg border border-gray-200 p-6 ${className ?? ""}`}
  >
    <div className="flex items-center gap-2 mb-4">
      <span className="text-gray-400">{icon}</span>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const DebtDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const canExtend = useCan(PERMISSIONS.DEBT_EXTEND_DUE_DATE);
  const canFlag = useCan(PERMISSIONS.DEBT_FLAG_REVIEW);
  const canResend = useCan(PERMISSIONS.DEBT_RESEND_NOTIFICATIONS);
  const canCancel = useCan(PERMISSIONS.DEBT_CANCEL);
  const canReadMerchant = useCan(PERMISSIONS.MERCHANT_READ);
  const canReadCustomer = useCan(PERMISSIONS.CUSTOMER_READ);
  const canUseActions = useCanAny([
    PERMISSIONS.DEBT_EXTEND_DUE_DATE,
    PERMISSIONS.DEBT_FLAG_REVIEW,
    PERMISSIONS.DEBT_RESEND_NOTIFICATIONS,
    PERMISSIONS.DEBT_CANCEL,
  ]);

  const { data, isLoading, isError, refetch } = useGetDebt({ id: id! });
  const debt = data?.data;

  const {
    data: feePreviewData,
    isLoading: isFeePreviewLoading,
    isError: isFeePreviewError,
  } = useGetDebtFeePreview({ id: id! });
  const feePreview = feePreviewData?.data;

  const [showCancel, setShowCancel] = useState(false);
  const [showExtend, setShowExtend] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleActionSuccess = () => {
    void refetch();
    setShowCancel(false);
    setShowExtend(false);
    setShowFlag(false);
    setShowResend(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError || !debt) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/debts-management")}
        >
          <ArrowLeft className="w-4 h-4 me-1" />
          {t("common.back", "Back")}
        </Button>
        <div className="mt-6 text-center text-gray-500">
          {t("debts.errorLoading", "Failed to load debt details.")}
        </div>
      </div>
    );
  }

  const isActionable = !["paid", "cancelled"].includes(debt.status);
  const hasPaymentInfo =
    debt.payment_id ||
    debt.payment_date ||
    debt.payment_status ||
    debt.payment_method ||
    debt.last_extension_at ||
    debt.last_overdue_action_at;

  return (
    <div className="p-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/debts-management")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 me-1" />
        {t("common.back", "Back")}
      </Button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{debt.title}</h1>
          <DebtStatusBadge status={debt.status} />
          {debt.review_flagged_at && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
              <Flag className="w-3 h-3" />
              {t("debts.flagged", "Flagged")}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {t("debts.debtId", "Debt")} #{debt.id}
        </p>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Debt Summary */}
          <SectionCard
            icon={<CreditCard className="w-5 h-5" />}
            title={t("debts.sections.debtDetails", "Debt Details")}
          >
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("debts.fields.totalAmount", "Total Amount")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDebtAmount(debt.amount)}
                </p>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("debts.fields.deductedFees", "Deducted Fees")}
                </p>
                <p className="text-lg font-semibold text-red-700">
                  {formatHalalaAmount(debt.expected_total_deductions_halala) ??
                    "—"}
                </p>
              </div>
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("debts.fields.merchantNetAmount", "Merchant Net Amount")}
                </p>
                <p className="text-lg font-semibold text-green-700">
                  {formatHalalaAmount(
                    debt.expected_merchant_net_amount_halala,
                  ) ?? "—"}
                </p>
              </div>
            </div>

            <p className="mb-4 text-xs leading-5 text-gray-500">
              {t(
                "debts.feeExplanation",
                "Deducted fees include Debtbox fees, VAT, payment provider fees, and other applicable deductions.",
              )}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("debts.fields.dueDate", "Due Date")}
                value={
                  <span
                    className={
                      isDebtOverdue(debt.due_date, debt.status)
                        ? "text-red-600 font-medium"
                        : undefined
                    }
                  >
                    {formatDate(i18n.language, debt.due_date, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                }
              />
              <Field
                label={t("debts.fields.createdAt", "Created At")}
                value={formatDate(i18n.language, debt.created_at, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              />
              <Field
                label={t("debts.fields.updatedAt", "Updated At")}
                value={formatDate(i18n.language, debt.updated_at, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              />
              <Field
                label={t("debts.fields.createdWithSanad", "Created with Sanad")}
                value={
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      debt.createwithsanad
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {debt.createwithsanad
                      ? t("common.yes", "Yes")
                      : t("common.no", "No")}
                  </span>
                }
              />
            </div>
          </SectionCard>

          {/* Merchant & Business */}
          <SectionCard
            icon={<Building2 className="w-5 h-5" />}
            title={t("debts.sections.merchantBusiness", "Merchant & Business")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("debts.fields.merchant", "Merchant")}
                </p>
                {canReadMerchant ? (
                  <button
                    onClick={() => navigate(`/merchants/${debt.merchant_id}`)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium text-start block"
                  >
                    {i18n.language === "ar" ? debt.merchant_full_name_ar : debt.merchant_full_name_en}
                  </button>
                ) : (
                  <p className="text-sm text-gray-900 font-medium">
                    {i18n.language === "ar" ? debt.merchant_full_name_ar : debt.merchant_full_name_en}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  ID: {debt.merchant_id}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("debts.fields.business", "Business")}
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {i18n.language === "ar" ? debt.business_name_ar : debt.business_name_en}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ID: {debt.business_id}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Customer */}
          <SectionCard
            icon={<User className="w-5 h-5" />}
            title={t("debts.sections.customer", "Customer")}
          >
            {canReadCustomer ? (
              <button
                onClick={() => navigate(`/customers/${debt.customer_id}`)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium text-start block mb-0.5"
              >
                {i18n.language === "ar" ? debt.customer_full_name_ar : debt.customer_full_name_en}
              </button>
            ) : (
              <p className="text-sm text-gray-900 font-medium mb-0.5">
                {i18n.language === "ar" ? debt.customer_full_name_ar : debt.customer_full_name_en}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              ID: {debt.customer_id}
            </p>
          </SectionCard>

          {/* Fee Preview */}
          <SectionCard
            icon={<Calculator className="w-5 h-5" />}
            title={t("debts.sections.feePreview", "Fee Preview")}
          >
            {isFeePreviewLoading ? (
              <div className="grid grid-cols-2 gap-3 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : isFeePreviewError || !feePreview ? (
              <p className="text-sm text-gray-400">
                {t("debts.feePreviewUnavailable", "Fee preview unavailable.")}
              </p>
            ) : (
              <>
                <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t("debts.fields.debtTotal", "Debt Total")}
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    {formatHalalaAmount(feePreview.debtTotalHalala)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stored Snapshot */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      {t("debts.sections.storedSnapshot", "Stored Snapshot")}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t("debts.fields.debtboxFee", "Debtbox Fee")}
                        </span>
                        <span className="font-medium">
                          {formatHalalaAmount(
                            feePreview.storedSnapshot.expectedDebtboxFeeHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t(
                            "debts.fields.providerFeeBase",
                            "Provider Fee (Base)",
                          )}
                        </span>
                        <span className="font-medium">
                          {formatHalalaAmount(
                            feePreview.storedSnapshot
                              .expectedProviderFeeBaseHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t(
                            "debts.fields.providerFeeVat",
                            "Provider Fee (VAT)",
                          )}
                        </span>
                        <span className="font-medium">
                          {formatHalalaAmount(
                            feePreview.storedSnapshot
                              .expectedProviderFeeVatHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t(
                            "debts.fields.instantPayoutFee",
                            "Instant Payout Fee",
                          )}
                        </span>
                        <span className="font-medium">
                          {formatHalalaAmount(
                            feePreview.storedSnapshot
                              .expectedInstantPayoutFeeHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                        <span className="text-gray-600">
                          {t(
                            "debts.fields.providerFeeType",
                            "Provider Fee Type",
                          )}
                        </span>
                        <span className="font-medium text-gray-700">
                          {feePreview.storedSnapshot.expectedProviderFeeType}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                        <span className="text-gray-700">
                          {t(
                            "debts.fields.totalDeductions",
                            "Total Deductions",
                          )}
                        </span>
                        <span className="text-red-600">
                          -
                          {formatHalalaAmount(
                            feePreview.storedSnapshot
                              .expectedTotalDeductionsHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-gray-700">
                          {t("debts.fields.merchantNetAmount", "Merchant Net")}
                        </span>
                        <span className="text-green-700">
                          {formatHalalaAmount(
                            feePreview.storedSnapshot
                              .expectedMerchantNetAmountHalala,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      {t("debts.sections.livePreview", "Live Preview")}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t("debts.fields.debtboxFee", "Debtbox Fee")}
                        </span>
                        <span className="font-medium">
                          {formatHalalaAmount(
                            feePreview.merchantVisibleDeductions
                              .debtboxFeeHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t(
                            "debts.fields.providerFeeBase",
                            "Provider Fee (Base)",
                          )}
                        </span>
                        <span className="font-medium">
                          {formatHalalaAmount(
                            feePreview.merchantVisibleDeductions
                              .providerFeeBaseHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t(
                            "debts.fields.providerFeeVat",
                            "Provider Fee (VAT)",
                          )}
                        </span>
                        <span className="font-medium">
                          {formatHalalaAmount(
                            feePreview.merchantVisibleDeductions
                              .providerFeeVatHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {t(
                            "debts.fields.instantPayoutFee",
                            "Instant Payout Fee",
                          )}
                        </span>
                        <span className="font-medium">
                          {formatHalalaAmount(
                            feePreview.merchantVisibleDeductions
                              .instantPayoutFeeHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                        <span className="text-gray-600">
                          {t(
                            "debts.fields.providerFeeType",
                            "Provider Fee Type",
                          )}
                        </span>
                        <span className="font-medium text-gray-700">
                          {feePreview.merchantVisibleDeductions.providerFeeType}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                        <span className="text-gray-700">
                          {t(
                            "debts.fields.totalDeductions",
                            "Total Deductions",
                          )}
                        </span>
                        <span className="text-red-600">
                          -
                          {formatHalalaAmount(
                            feePreview.merchantVisibleDeductions
                              .totalDeductionsHalala,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-gray-700">
                          {t("debts.fields.merchantNetAmount", "Merchant Net")}
                        </span>
                        <span className="text-green-700">
                          {formatHalalaAmount(
                            feePreview.merchantVisibleDeductions
                              .expectedMerchantNetAmountHalala,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  {t("debts.feeSnapshotAt", "Snapshot at")}:{" "}
                  {formatDate(i18n.language, feePreview.feeSnapshotAt, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </>
            )}
          </SectionCard>

          {/* Payment & History */}
          {hasPaymentInfo && (
            <SectionCard
              icon={<Receipt className="w-5 h-5" />}
              title={t("debts.sections.paymentHistory", "Payment & History")}
            >
              <div className="grid grid-cols-2 gap-4">
                {debt.payment_id && (
                  <Field
                    label={t("debts.fields.paymentId", "Payment ID")}
                    value={
                      <Link
                        to={`/payments/${debt.payment_id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        #{debt.payment_id}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    }
                  />
                )}
                {debt.payment_status && (
                  <Field
                    label={t("debts.fields.paymentStatus", "Payment Status")}
                    value={debt.payment_status}
                  />
                )}
                {debt.payment_date && (
                  <Field
                    label={t("debts.fields.paymentDate", "Payment Date")}
                    value={formatDate(i18n.language, debt.payment_date, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                )}
                {debt.payment_method_type && (
                  <Field
                    label={t(
                      "debts.fields.paymentMethodType",
                      "Payment Channel",
                    )}
                    value={debt.payment_method_type}
                  />
                )}
                {debt.payment_method && (
                  <Field
                    label={t("debts.fields.paymentMethod", "Payment Method")}
                    value={debt.payment_method}
                  />
                )}
                {debt.payment_brand && (
                  <Field
                    label={t("debts.fields.paymentBrand", "Card Brand")}
                    value={debt.payment_brand}
                  />
                )}
                {debt.payout_method && (
                  <Field
                    label={t("debts.fields.payoutMethod", "Payout Method")}
                    value={
                      <span className="capitalize">{debt.payout_method}</span>
                    }
                  />
                )}
                {debt.payment_total_amount_halala != null && (
                  <Field
                    label={t("debts.fields.totalAmount", "Total Amount")}
                    value={
                      <span className="font-medium">
                        {formatHalalaAmount(debt.payment_total_amount_halala)}
                      </span>
                    }
                  />
                )}
                {debt.payment_paid_amount_halala != null && (
                  <Field
                    label={t("debts.fields.totalPaid", "Total Paid")}
                    value={
                      <span className="font-medium text-green-700">
                        {formatHalalaAmount(debt.payment_paid_amount_halala)}
                      </span>
                    }
                  />
                )}
                {debt.payment_remaining_amount_halala != null &&
                  debt.payment_remaining_amount_halala > 0 && (
                    <Field
                      label={t("debts.fields.remaining", "Remaining")}
                      value={
                        <span className="font-medium text-orange-600">
                          {formatHalalaAmount(
                            debt.payment_remaining_amount_halala,
                          )}
                        </span>
                      }
                    />
                  )}
                {debt.merchant_net_amount_halala != null && (
                  <Field
                    label={t("debts.fields.merchantNetAmount", "Merchant Net")}
                    value={
                      <span className="font-medium text-green-700">
                        {formatHalalaAmount(debt.merchant_net_amount_halala)}
                      </span>
                    }
                  />
                )}
                <Field
                  label={t("debts.fields.extensionsCount", "Extensions")}
                  value={`${debt.extensions_count} ${
                    debt.last_extension_at
                      ? `(${t("common.last", "last")}: ${formatDate(
                          i18n.language,
                          debt.last_extension_at,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )})`
                      : ""
                  }`}
                />
                <Field
                  label={t(
                    "debts.fields.overdueActionsCount",
                    "Overdue Actions",
                  )}
                  value={`${debt.overdue_actions_count} ${
                    debt.last_overdue_action_at
                      ? `(${t("common.last", "last")}: ${formatDate(
                          i18n.language,
                          debt.last_overdue_action_at,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )})`
                      : ""
                  }`}
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
              {t("debts.sections.quickInfo", "Debt Information")}
            </h3>
            <div className="space-y-3">
              <Field
                label={t("debts.fields.amount", "Amount")}
                value={formatDebtAmount(debt.amount)}
              />
              <Field
                label={t("debts.fields.status", "Status")}
                value={<DebtStatusBadge status={debt.status} />}
              />
              <Field
                label={t("debts.fields.dueDate", "Due Date")}
                value={
                  <span
                    className={
                      isDebtOverdue(debt.due_date, debt.status)
                        ? "text-red-600 font-medium"
                        : undefined
                    }
                  >
                    {formatDate(i18n.language, debt.due_date, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                }
              />
              <Field
                label={t("debts.fields.createdAt", "Created At")}
                value={formatDate(i18n.language, debt.created_at, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t("debts.sections.actions", "Actions")}
            </h3>
            {!isActionable || !canUseActions ? (
              <p className="text-sm text-gray-400">
                {t(
                  "debts.noActionsAvailable",
                  "No actions available for this debt.",
                )}
              </p>
            ) : (
              <div className="space-y-3">
                {canExtend && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowExtend(true)}
                    className="justify-start gap-2"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    {t("debts.actions.extendDueDate", "Extend Due Date")}
                  </Button>
                )}

                {canFlag && !debt.review_flagged_at && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowFlag(true)}
                    className="justify-start gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    {t("debts.actions.flagForReview", "Flag for Review")}
                  </Button>
                )}

                {canResend && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowResend(true)}
                    className="justify-start gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    {t(
                      "debts.actions.resendNotification",
                      "Resend Notification",
                    )}
                  </Button>
                )}

                {canCancel && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowCancel(true)}
                    className="justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4" />
                    {t("debts.actions.cancelDebt", "Cancel Debt")}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Review Flag Info */}
          {debt.review_flagged_at && (
            <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-orange-400 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-4 h-4 text-orange-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  {t("debts.sections.reviewFlag", "Flagged for Review")}
                </h3>
              </div>
              <div className="space-y-3">
                <Field
                  label={t("debts.fields.flaggedAt", "Flagged At")}
                  value={formatDate(i18n.language, debt.review_flagged_at, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
                <Field
                  label={t("debts.fields.flagReason", "Reason")}
                  value={debt.review_flag_reason}
                />
                <Field
                  label={t("debts.fields.flaggedBy", "Flagged By")}
                  value={
                    debt.review_flagged_by
                      ? `Admin #${debt.review_flagged_by}`
                      : null
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {canCancel && showCancel && (
        <CancelDebtModal
          debtId={debt.id}
          debtTitle={debt.title}
          onClose={() => setShowCancel(false)}
          onSuccess={handleActionSuccess}
        />
      )}
      {canExtend && showExtend && (
        <ExtendDueDateModal
          debtId={debt.id}
          currentDueDate={debt.due_date}
          onClose={() => setShowExtend(false)}
          onSuccess={handleActionSuccess}
        />
      )}
      {canFlag && showFlag && (
        <FlagDebtModal
          debtId={debt.id}
          onClose={() => setShowFlag(false)}
          onSuccess={handleActionSuccess}
        />
      )}
      {canResend && showResend && (
        <ResendNotificationModal
          debtId={debt.id}
          onClose={() => setShowResend(false)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
};

export default DebtDetails;
