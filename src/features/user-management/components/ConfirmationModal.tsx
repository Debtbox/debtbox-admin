import { useTranslation } from "react-i18next";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/shared";

export interface ConfirmAction {
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "danger" | "warning";
  onConfirm: () => void;
  loading: boolean;
}

interface ConfirmationModalProps {
  action: ConfirmAction;
  onClose: () => void;
}

export const ConfirmationModal = ({
  action,
  onClose,
}: ConfirmationModalProps) => {
  const { t } = useTranslation();
  const isDanger = action.tone === "danger";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={`w-5 h-5 ${isDanger ? "text-red-600" : "text-yellow-600"}`}
            />
            <h2 className="text-lg font-semibold text-gray-900">
              {action.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700">{action.message}</p>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={action.loading}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="button"
              loading={action.loading}
              onClick={action.onConfirm}
              className={
                isDanger
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : undefined
              }
            >
              {action.confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
