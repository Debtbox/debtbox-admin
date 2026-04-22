export const getDebtStatusColor = (status: string): string =>
  (
    ({
      active: "bg-blue-100 text-blue-800 border-blue-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      overdue: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      in_arrears: "bg-orange-100 text-orange-800 border-orange-200",
      cancelled: "bg-gray-100 text-gray-600 border-gray-200",
    }) as Record<string, string>
  )[status] ?? "bg-gray-100 text-gray-600 border-gray-200";

export const formatDebtAmount = (amount: string | number): string =>
  `SAR ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const isDebtOverdue = (dueDate: string, status: string): boolean =>
  !["paid", "cancelled"].includes(status) && new Date(dueDate) < new Date();
