import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import { getUserStatusColor } from "../utils";
import type { UserStatus } from "../api/getSystemUsers";

interface UserStatusBadgeProps {
  status: UserStatus;
}

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  const { t } = useTranslation();
  const normalized = String(status).toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getUserStatusColor(normalized),
      )}
    >
      {t(`userManagement.status.${normalized}`, normalized)}
    </span>
  );
};
