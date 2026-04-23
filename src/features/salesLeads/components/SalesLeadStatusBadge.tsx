import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import { getLeadStatusColor } from "../utils";

interface SalesLeadStatusBadgeProps {
  status: string;
}

export const SalesLeadStatusBadge = ({ status }: SalesLeadStatusBadgeProps) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getLeadStatusColor(status),
      )}
    >
      {t(`salesLeads.statuses.${status}`, status)}
    </span>
  );
};
