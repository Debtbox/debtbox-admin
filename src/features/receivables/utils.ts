import type { ReceivableStatus } from "@/types/ReceivableDTO";

export const getReceivableStatusColor = (status: string): string =>
  (
    ({
      OPEN: "bg-blue-100 text-blue-800 border-blue-200",
      PARTIALLY_SETTLED: "bg-orange-100 text-orange-800 border-orange-200",
      SETTLED: "bg-green-100 text-green-800 border-green-200",
    }) as Record<string, string>
  )[status] ?? "bg-gray-100 text-gray-600 border-gray-200";

export const SETTLEABLE_STATUSES: ReceivableStatus[] = ["OPEN", "PARTIALLY_SETTLED"];

export const formatHalala = (halala: number | null | undefined): string => {
  if (halala === null || halala === undefined) return "—";
  return `SAR ${(halala / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
