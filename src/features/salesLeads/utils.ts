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
