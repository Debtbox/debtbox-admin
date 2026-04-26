import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button, Table } from "@/components/shared";
import type { CustomerDTO } from "@/types/CustomerDTO";
import { formatDate } from "@/utils/formatDate";
import { PERMISSIONS } from "@/auth/permissions";
import { useCan } from "@/auth/rbac";

interface CustomersTableProps {
  data: CustomerDTO[];
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
}

export const CustomersTable = ({ data, isLoading, pagination, onPageChange }: CustomersTableProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const canRead = useCan(PERMISSIONS.CUSTOMER_READ);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":   return "bg-green-100 text-green-800 border-green-200";
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":  return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "banned":   return "bg-red-100 text-red-800 border-red-200";
      default:         return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "approved":                  return "bg-green-100 text-green-800 border-green-200";
      case "rejected":                  return "bg-red-100 text-red-800 border-red-200";
      case "pending_nafath":
      case "pending_email_verification":
      case "pending_admin_approval":    return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:                          return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":   return <CheckCircle className="w-4 h-4" />;
      case "inactive": return <XCircle className="w-4 h-4" />;
      case "pending":  return <Clock className="w-4 h-4" />;
      case "banned":   return <AlertCircle className="w-4 h-4" />;
      default:         return null;
    }
  };

  const columns = [
    {
      key: "name",
      title: t("customers.name", "Name"),
      dataIndex: "full_name_en",
      render: (_value: unknown, record: CustomerDTO) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {record.full_name_en || record.full_name_ar}
          </div>
          <div className="text-sm text-gray-500">ID: {record.id}</div>
        </div>
      ),
    },
    {
      key: "email",
      title: t("customers.email", "Email"),
      dataIndex: "email",
      render: (value: unknown) => (
        <div className="text-sm text-gray-900">{value as string}</div>
      ),
    },
    {
      key: "status",
      title: t("customers.statusTitle", "Status"),
      dataIndex: "status",
      render: (value: unknown) => {
        const v = value as string;
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(v)}`}>
            {getStatusIcon(v)}
            {String(t(`customers.statusLabel.${v}`, v))}
          </span>
        );
      },
    },
    {
      key: "verificationStatus",
      title: t("customers.verification", "Verification"),
      dataIndex: "verification_status",
      render: (value: unknown) => {
        const v = value as string;
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVerificationStatusColor(v)}`}>
            {String(t(`customers.verificationStatus.${v}`, v))}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      title: t("customers.createdAt", "Created"),
      dataIndex: "created_at",
      render: (value: unknown) => (
        <div className="text-sm text-gray-500">
          {formatDate(i18n.language, value as string, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
  ];

  const actions = (record: CustomerDTO) => canRead ? (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(`/customers/${record.id}`)}
      className="flex items-center gap-2"
    >
      <Eye className="w-4 h-4" />
      {t("common.view", "View")}
    </Button>
  ) : null;

  return (
    <Table
      columns={columns}
      data={data}
      loading={isLoading}
      emptyText={t("customers.noCustomers", "No customers found")}
      showActions={canRead}
      actions={actions}
      pagination={{
        current: pagination.page + 1,
        pageSize: pagination.limit,
        total: pagination.total,
        onChange: (page) => onPageChange(page - 1),
      }}
    />
  );
};
