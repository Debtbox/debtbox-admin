import type { SupportTicketStatus, SupportTicketPriority } from "@/enums";

export const getStatusColor = (status: SupportTicketStatus) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "OPEN":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "WAITING_ON_REQUESTER":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "WAITING_ON_INTERNAL":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "RESOLVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CLOSED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "REOPENED":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPriorityColor = (priority: SupportTicketPriority) => {
  switch (priority) {
    case "LOW":
      return "bg-gray-100 text-gray-700";
    case "MEDIUM":
      return "bg-blue-100 text-blue-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "URGENT":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};