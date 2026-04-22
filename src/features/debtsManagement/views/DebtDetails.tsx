import type { ReactNode } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { useGetDebt } from "../api/getDebt";
import { DebtStatusBadge } from "../components/DebtStatusBadge";
import { CancelDebtModal } from "../components/CancelDebtModal";
import { ExtendDueDateModal } from "../components/ExtendDueDateModal";
import { FlagDebtModal } from "../components/FlagDebtModal";
import { ResendNotificationModal } from "../components/ResendNotificationModal";
import { formatDebtAmount, isDebtOverdue } from "../utils";

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

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const DebtDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, isError, refetch } = useGetDebt({ id: id! });
  const debt = data?.data;

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
        <Button variant="ghost" size="sm" onClick={() => navigate("/debts-management")}>
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
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {t("debts.fields.amount", "Amount")}
              </p>
              <p className="text-3xl font-bold text-gray-900">{formatDebtAmount(debt.amount)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t("debts.fields.dueDate", "Due Date")} value={
                <span className={isDebtOverdue(debt.due_date, debt.status) ? "text-red-600 font-medium" : undefined}>
                  {formatDate(debt.due_date)}
                </span>
              } />
              <Field label={t("debts.fields.createdAt", "Created At")} value={formatDate(debt.created_at)} />
              <Field label={t("debts.fields.updatedAt", "Updated At")} value={formatDate(debt.updated_at)} />
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
                    {debt.createwithsanad ? t("common.yes", "Yes") : t("common.no", "No")}
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
                <button
                  onClick={() => navigate(`/merchants-management/${debt.merchant_id}`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium text-start block"
                >
                  {debt.merchant_full_name_en}
                </button>
                <p className="text-sm text-gray-500">{debt.merchant_full_name_ar}</p>
                <p className="text-xs text-gray-400 mt-0.5">ID: {debt.merchant_id}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {t("debts.fields.business", "Business")}
                </p>
                <p className="text-sm text-gray-900 font-medium">{debt.business_name_en}</p>
                <p className="text-sm text-gray-500">{debt.business_name_ar}</p>
                <p className="text-xs text-gray-400 mt-0.5">ID: {debt.business_id}</p>
              </div>
            </div>
          </SectionCard>

          {/* Customer */}
          <SectionCard
            icon={<User className="w-5 h-5" />}
            title={t("debts.sections.customer", "Customer")}
          >
            <button
              onClick={() => navigate(`/customers-management/${debt.customer_id}`)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium text-start block mb-0.5"
            >
              {debt.customer_full_name_en}
            </button>
            <p className="text-sm text-gray-500">{debt.customer_full_name_ar}</p>
            <p className="text-xs text-gray-400 mt-0.5">ID: {debt.customer_id}</p>
          </SectionCard>

          {/* Payment & History */}
          {hasPaymentInfo && (
            <SectionCard
              icon={<Receipt className="w-5 h-5" />}
              title={t("debts.sections.paymentHistory", "Payment & History")}
            >
              <div className="grid grid-cols-2 gap-4">
                {debt.payment_date && (
                  <Field
                    label={t("debts.fields.paymentDate", "Payment Date")}
                    value={formatDate(debt.payment_date)}
                  />
                )}
                {debt.payment_status && (
                  <Field
                    label={t("debts.fields.paymentStatus", "Payment Status")}
                    value={debt.payment_status}
                  />
                )}
                {debt.payment_method && (
                  <Field
                    label={t("debts.fields.paymentMethod", "Payment Method")}
                    value={debt.payment_method}
                  />
                )}
                <Field
                  label={t("debts.fields.extensionsCount", "Extensions")}
                  value={`${debt.extensions_count} ${debt.last_extension_at ? `(${t("common.last", "last")}: ${formatDate(debt.last_extension_at)})` : ""}`}
                />
                <Field
                  label={t("debts.fields.overdueActionsCount", "Overdue Actions")}
                  value={`${debt.overdue_actions_count} ${debt.last_overdue_action_at ? `(${t("common.last", "last")}: ${formatDate(debt.last_overdue_action_at)})` : ""}`}
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
              <Field label={t("debts.fields.amount", "Amount")} value={formatDebtAmount(debt.amount)} />
              <Field label={t("debts.fields.status", "Status")} value={<DebtStatusBadge status={debt.status} />} />
              <Field
                label={t("debts.fields.dueDate", "Due Date")}
                value={
                  <span className={isDebtOverdue(debt.due_date, debt.status) ? "text-red-600 font-medium" : undefined}>
                    {formatDate(debt.due_date)}
                  </span>
                }
              />
              <Field label={t("debts.fields.createdAt", "Created At")} value={formatDate(debt.created_at)} />
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t("debts.sections.actions", "Actions")}
            </h3>
            {!isActionable ? (
              <p className="text-sm text-gray-400">
                {t("debts.noActionsAvailable", "No actions available for this debt.")}
              </p>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowExtend(true)}
                  className="justify-start gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  {t("debts.actions.extendDueDate", "Extend Due Date")}
                </Button>

                {!debt.review_flagged_at && (
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

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowResend(true)}
                  className="justify-start gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {t("debts.actions.resendNotification", "Resend Notification")}
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowCancel(true)}
                  className="justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" />
                  {t("debts.actions.cancelDebt", "Cancel Debt")}
                </Button>
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
                  value={formatDate(debt.review_flagged_at)}
                />
                <Field
                  label={t("debts.fields.flagReason", "Reason")}
                  value={debt.review_flag_reason}
                />
                <Field
                  label={t("debts.fields.flaggedBy", "Flagged By")}
                  value={debt.review_flagged_by ? `Admin #${debt.review_flagged_by}` : null}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCancel && (
        <CancelDebtModal
          debtId={debt.id}
          debtTitle={debt.title}
          onClose={() => setShowCancel(false)}
          onSuccess={handleActionSuccess}
        />
      )}
      {showExtend && (
        <ExtendDueDateModal
          debtId={debt.id}
          currentDueDate={debt.due_date}
          onClose={() => setShowExtend(false)}
          onSuccess={handleActionSuccess}
        />
      )}
      {showFlag && (
        <FlagDebtModal
          debtId={debt.id}
          onClose={() => setShowFlag(false)}
          onSuccess={handleActionSuccess}
        />
      )}
      {showResend && (
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
