export type PayoutStatus =
  | "DRAFT"
  | "READY"
  | "PROCESSING"
  | "PAID"
  | "SETTLED"
  | "PARTIALLY_SETTLED"
  | "FAILED";

export const getPayoutStatusColor = (status: string): string =>
  (
    ({
      DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
      READY: "bg-blue-100 text-blue-800 border-blue-200",
      PROCESSING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PAID: "bg-purple-100 text-purple-800 border-purple-200",
      SETTLED: "bg-green-100 text-green-800 border-green-200",
      PARTIALLY_SETTLED: "bg-orange-100 text-orange-800 border-orange-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
    }) as Record<string, string>
  )[status] ?? "bg-gray-100 text-gray-600 border-gray-200";

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
