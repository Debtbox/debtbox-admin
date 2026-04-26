import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Shield } from "lucide-react";
import { cn } from "@/utils/cn";
import Table, { type TableColumn } from "@/components/shared/Table";
import { formatDate } from "@/utils/formatDate";
import type { SystemUser } from "../api/getSystemUsers";
import { UserStatusBadge } from "./UserStatusBadge";

interface UsersTableProps {
  data: SystemUser[];
  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
  showActions?: boolean;
  actions?: (record: SystemUser) => ReactNode;
}

const getRoleName = (role?: SystemUser["role"]) =>
  role?.name ?? role?.slug ?? "-";

export const RowActionButton = ({
  label,
  icon,
  onClick,
  className,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
  >
    {icon}
  </button>
);

export const UsersTable = ({
  data,
  isLoading,
  pagination,
  onPageChange,
  showActions,
  actions,
}: UsersTableProps) => {
  const { t, i18n } = useTranslation();

  const columns: TableColumn<SystemUser>[] = [
    {
      key: "name",
      title: t("userManagement.name", "Name"),
      dataIndex: "firstName",
      render: (_value, record) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {`${record.firstName ?? ""} ${record.lastName ?? ""}`.trim() ||
              record.email}
          </div>
          <div className="text-xs text-gray-500">ID: {record.id}</div>
        </div>
      ),
    },
    {
      key: "email",
      title: t("userManagement.email", "Email"),
      dataIndex: "email",
      render: (value) => (
        <span className="text-sm text-gray-900">{String(value ?? "-")}</span>
      ),
    },
    {
      key: "phone",
      title: t("userManagement.phone", "Phone"),
      dataIndex: "phone",
      render: (value) => (
        <span className="text-sm text-gray-900">{String(value ?? "-")}</span>
      ),
    },
    {
      key: "role",
      title: t("userManagement.role", "Role"),
      dataIndex: "role",
      render: (_value, record) => (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
            "bg-blue-50 text-blue-800 border-blue-200",
          )}
        >
          <Shield className="w-3 h-3" />
          {getRoleName(record.role)}
        </span>
      ),
    },
    {
      key: "status",
      title: t("userManagement.statusLabel", "Status"),
      dataIndex: "status",
      render: (value) => <UserStatusBadge status={String(value)} />,
    },
    {
      key: "createdAt",
      title: t("userManagement.createdAt", "Created At"),
      dataIndex: "created_at",
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value
            ? formatDate(i18n.language, value as string, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <Table<SystemUser>
      columns={columns}
      data={data}
      loading={isLoading}
      emptyText={t("userManagement.noUsers", "No users found")}
      showActions={showActions}
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
