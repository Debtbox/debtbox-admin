import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Eye, X } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { cn } from "@/utils/cn";
import { getUserStatusColor } from "../utils";
import type { SystemUser } from "../api/getSystemUsers";

const Field = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="rounded-lg border border-gray-200 p-3">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <div className="text-sm text-gray-900 wrap-break-word">
      {value ?? <span className="text-gray-400">—</span>}
    </div>
  </div>
);

const BooleanBadge = ({ value }: { value?: boolean }) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        value
          ? "bg-green-100 text-green-800 border-green-200"
          : "bg-gray-100 text-gray-800 border-gray-200",
      )}
    >
      {value ? t("common.yes", "Yes") : t("common.no", "No")}
    </span>
  );
};

const formatDateTime = (language: string, value?: string | null) => {
  if (!value) return undefined;
  return formatDate(language, value, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface UserDetailsModalProps {
  user?: SystemUser;
  fallbackUser?: SystemUser | null;
  loading: boolean;
  onClose: () => void;
}

export const UserDetailsModal = ({
  user,
  fallbackUser,
  loading,
  onClose,
}: UserDetailsModalProps) => {
  const { t, i18n } = useTranslation();
  const displayUser = user ?? fallbackUser;
  const role = user?.role ?? fallbackUser?.role;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("userManagement.userDetails", "User Details")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading || !displayUser ? (
            <div className="py-10 text-center text-gray-500">
              {t("common.loading", "Loading...")}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={t("userManagement.name", "Name")}
                value={
                  `${displayUser.firstName ?? ""} ${displayUser.lastName ?? ""}`.trim() ||
                  displayUser.email
                }
              />
              <Field
                label={t("userManagement.email", "Email")}
                value={displayUser.email}
              />
              <Field
                label={t("userManagement.phone", "Phone")}
                value={displayUser.phone}
              />
              <Field
                label={t("userManagement.role", "Role")}
                value={role?.name ?? role?.slug}
              />
              <Field
                label={t("userManagement.statusLabel", "Status")}
                value={
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      getUserStatusColor(
                        String(displayUser.status).toUpperCase(),
                      ),
                    )}
                  >
                    {t(
                      `userManagement.status.${String(displayUser.status).toUpperCase()}`,
                      String(displayUser.status).toUpperCase(),
                    )}
                  </span>
                }
              />
              <Field
                label={t("userManagement.mfa", "MFA")}
                value={<BooleanBadge value={displayUser.mfa_enabled} />}
              />
              <Field
                label={t("userManagement.lockedUntil", "Locked Until")}
                value={formatDateTime(i18n.language, displayUser.locked_until)}
              />
              <Field
                label={t("userManagement.lastLogin", "Last Login")}
                value={formatDateTime(i18n.language, displayUser.last_login_at)}
              />
              <Field
                label={t(
                  "userManagement.passwordChangedAt",
                  "Password Changed At",
                )}
                value={formatDateTime(
                  i18n.language,
                  displayUser.password_changed_at,
                )}
              />
              <Field
                label={t("userManagement.createdAt", "Created At")}
                value={formatDateTime(i18n.language, displayUser.created_at)}
              />
              <Field
                label={t("userManagement.updatedAt", "Updated At")}
                value={formatDateTime(i18n.language, displayUser.updated_at)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
