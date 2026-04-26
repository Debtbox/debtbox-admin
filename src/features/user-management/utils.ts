export const getUserStatusColor = (status: string): string =>
  (
    ({
      ACTIVE: "bg-green-100 text-green-800 border-green-200",
      INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
      SUSPENDED: "bg-yellow-100 text-yellow-800 border-yellow-200",
    }) as Record<string, string>
  )[String(status).toUpperCase()] ??
  "bg-gray-100 text-gray-600 border-gray-200";
