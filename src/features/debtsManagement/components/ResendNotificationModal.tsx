import { useTranslation } from "react-i18next";
import { Bell, X } from "lucide-react";
import { toast } from '@/lib/toast';
import { Button } from "@/components/shared/Button";
import { useResendDebtNotification } from "../api/resendDebtNotification";

interface ResendNotificationModalProps {
  debtId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResendNotificationModal = ({
  debtId,
  onClose,
  onSuccess,
}: ResendNotificationModalProps) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useResendDebtNotification();

  const handleResend = () => {
    mutate(
      { id: debtId },
      {
        onSuccess: () => {
          toast.success(t("debts.modals.resend.success", "Notification sent successfully"));
          onSuccess();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t("debts.modals.resend.error", "Failed to send notification");
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("debts.modals.resend.title", "Resend Notification")}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center py-4">
            <Bell className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 text-sm">
              {t(
                "debts.modals.resend.description",
                "This will resend the debt notification to the customer. Do you want to continue?"
              )}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleResend} loading={isPending}>
              {t("debts.modals.resend.confirmButton", "Resend")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
