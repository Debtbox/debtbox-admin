export const getLeadStatusColor = (status: string): string =>
  (
    ({
      NEW: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONTACTED: "bg-blue-100 text-blue-800 border-blue-200",
      INTERESTED: "bg-purple-100 text-purple-800 border-purple-200",
      CONVERTED: "bg-green-100 text-green-800 border-green-200",
      LOST: "bg-gray-100 text-gray-600 border-gray-200",
    }) as Record<string, string>
  )[status] ?? "bg-gray-100 text-gray-600 border-gray-200";

export const getLeadTypeColor = (type: string): string =>
  (
    ({
      MERCHANT: "bg-indigo-100 text-indigo-800 border-indigo-200",
      CUSTOMER: "bg-teal-100 text-teal-800 border-teal-200",
    }) as Record<string, string>
  )[type] ?? "bg-gray-100 text-gray-600 border-gray-200";

export const isSalesAdminRole = (slug?: string | null): boolean =>
  slug === "admin" || slug === "superadmin";

export const getSalesUserDisplay = (
  user:
    | {
        id: number;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
      }
    | null
    | undefined,
  fallbackId?: number | null,
): string => {
  if (!user) return fallbackId ? String(fallbackId) : "—";
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return name || user.email || String(user.id);
};

export const formatSalesDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSalesDateTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatSalesAmount = (
  amount: string | number | null | undefined,
): string => {
  if (amount === null || amount === undefined) return "—";
  return `SAR ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatSalesHalala = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return "—";
  return formatSalesAmount(amount / 100);
};

export const formatIncentiveTier = (
  tier: { minActiveMerchants: number; maxActiveMerchants: number; amount: number } | string | null | undefined,
): string => {
  if (!tier) return "—";
  if (typeof tier === "string") return tier;
  return `${tier.minActiveMerchants}–${tier.maxActiveMerchants} merchants`;
};
