import { useTranslation } from "react-i18next";
import { Layers } from "lucide-react";
import { cn } from "@/utils/cn";

interface GroupedDebtBadgeProps {
  count?: number | null;
  className?: string;
  size?: "sm" | "md";
}

export const GroupedDebtBadge = ({
  count,
  className,
  size = "sm",
}: GroupedDebtBadgeProps) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 font-medium text-indigo-700",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        className,
      )}
      title={
        count
          ? t("groupedDebt.includesChildren", "Includes {{count}} child debts", {
              count,
            })
          : t("groupedDebt.label", "Grouped debt")
      }
    >
      <Layers className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{t("groupedDebt.label", "Grouped debt")}</span>
      {typeof count === "number" && count > 0 && (
        <span className="rounded-full bg-indigo-100 px-1.5 text-[10px] font-semibold text-indigo-800">
          {count}
        </span>
      )}
    </span>
  );
};
