import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import { getDebtStatusColor } from "../utils";

interface DebtStatusBadgeProps {
  status: string;
  className?: string;
}

export const DebtStatusBadge = ({ status, className }: DebtStatusBadgeProps) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getDebtStatusColor(status),
        className
      )}
    >
      {t(`debts.statuses.${status}`, status)}
    </span>
  );
};
