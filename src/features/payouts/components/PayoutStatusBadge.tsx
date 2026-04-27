import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import { getPayoutStatusColor } from "../utils";

interface PayoutStatusBadgeProps {
  status: string;
}

export const PayoutStatusBadge = ({ status }: PayoutStatusBadgeProps) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getPayoutStatusColor(status),
      )}
    >
      {t(`payouts.statuses.${status}`, status)}
    </span>
  );
};
