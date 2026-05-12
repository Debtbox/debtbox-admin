import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import { getReceivableStatusColor } from "../utils";

interface ReceivableStatusBadgeProps {
  status: string;
}

export const ReceivableStatusBadge = ({ status }: ReceivableStatusBadgeProps) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getReceivableStatusColor(status),
      )}
    >
      {t(`receivables.statuses.${status}`, status)}
    </span>
  );
};
