import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "@/components/shared/Select";
import { useGetSystemUsers } from "@/features/user-management/api/getSystemUsers";
import type { SystemUser } from "@/features/user-management/api/getSystemUsers";

const isSalesUser = (user: SystemUser) => {
  const role = `${user.role?.slug ?? ""} ${user.role?.name ?? ""}`.toLowerCase();
  return role.includes("sales");
};

const getUserLabel = (user: SystemUser) =>
  `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
  user.email ||
  String(user.id);

interface SalesUserSelectProps {
  value?: string | number | null;
  onChange?: (value: string) => void;
  allowUnassigned?: boolean;
  label?: string;
  error?: unknown;
  disabled?: boolean;
  name?: string;
}

export const SalesUserSelect = ({
  value,
  onChange,
  allowUnassigned,
  label,
  error,
  disabled,
  name,
}: SalesUserSelectProps) => {
  const { t } = useTranslation();
  const usersQuery = useGetSystemUsers({
    params: { page: 0, limit: 100 },
    config: { staleTime: 60_000 },
  });

  const options = useMemo(() => {
    // TODO: replace client-side sales-role filtering if /admin/users supports role filters.
    const salesUsers = (usersQuery.data?.data.users ?? []).filter(isSalesUser);
    return [
      ...(allowUnassigned
        ? [{ value: "", label: t("salesLeads.fields.unassigned", "Unassigned") }]
        : []),
      ...salesUsers.map((user) => ({
        value: String(user.id),
        label: `${getUserLabel(user)} (${user.id})`,
      })),
    ];
  }, [allowUnassigned, t, usersQuery.data?.data.users]);

  return (
    <Select
      name={name}
      label={label ?? t("salesLeads.fields.assignedTo", "Assigned Sales User")}
      options={options}
      value={value === null || value === undefined ? "" : String(value)}
      onChange={(event) => onChange?.(event.target.value)}
      disabled={disabled || usersQuery.isLoading}
      error={error as never}
    />
  );
};
