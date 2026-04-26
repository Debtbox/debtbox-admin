import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, KeyRound, X } from "lucide-react";
import { Button, Input } from "@/components/shared";
import type { SystemUser } from "../api/getSystemUsers";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(1, "Password is required"),
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordModalProps {
  user: SystemUser;
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
  loading: boolean;
}

const getFullName = (user: SystemUser) =>
  `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email;

export const ResetPasswordModal = ({
  user,
  onClose,
  onSubmit,
  loading,
}: ResetPasswordModalProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("userManagement.resetPassword", "Reset Password")}
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

        <form
          onSubmit={handleSubmit((values) => onSubmit(values.newPassword))}
          className="p-6 space-y-4"
        >
          <div className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              {t(
                "userManagement.resetPasswordMessage",
                "This will replace the user's password and force a password change.",
              )}
            </p>
          </div>
          <p className="text-sm text-gray-600">{getFullName(user)}</p>
          <Input
            type="password"
            label={t("userManagement.newPassword", "New Password")}
            error={errors.newPassword}
            {...register("newPassword")}
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={loading}>
              {t("userManagement.resetPassword", "Reset Password")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
