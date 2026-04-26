import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  KeyRound,
  LockOpen,
  Pencil,
  Plus,
  Trash2,
  Shield,
  UserCog,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Checkbox, Input, Select, Table } from "@/components/shared";
import type { TableColumn } from "@/components/shared/Table";
import { useUserStore } from "@/stores/UserStore";
import { PERMISSIONS } from "@/auth/permissions";
import { can } from "@/auth/rbac";
import { formatDate } from "@/utils/formatDate";
import {
  systemUsersQueryKey,
  useActivateSystemUser,
  useCreateSystemUser,
  useDeactivateSystemUser,
  useDeleteSystemUser,
  useGetSystemRoles,
  useGetSystemUser,
  useGetSystemUsers,
  useResetSystemUserPassword,
  useUnlockSystemUser,
  useUpdateSystemUser,
  type CreateSystemUserRequest,
  type SystemRole,
  type SystemUser,
  type UpdateSystemUserRequest,
  type UserStatus,
} from "./api/systemUsers";

const PAGE_SIZE = 10;

const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().optional(),
  roleId: z.string().optional(),
  status: z.string().optional(),
  forcePasswordChange: z.boolean().optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(1, "Password is required"),
});

type UserFormValues = z.infer<typeof userFormSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

type UserModalMode = "create" | "edit";

interface SystemUserFormModalProps {
  mode: UserModalMode;
  user?: SystemUser | null;
  roles: SystemRole[];
  rolesLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSystemUserRequest | UpdateSystemUserRequest) => void;
  isLoading: boolean;
}

interface ConfirmAction {
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "danger" | "warning";
  onConfirm: () => void;
  loading: boolean;
}

const getFullName = (user: SystemUser) =>
  `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email;

const getRoleName = (role?: SystemRole | null) => role?.name || role?.slug || "-";

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
  (error as { message?: string })?.message ??
  fallback;

const isForbidden = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status === 403;

const isLocked = (user: SystemUser) => Boolean(user.locked_until);

const formatDateTime = (language: string, value?: string | null) => {
  if (!value) return "-";

  return formatDate(language, value, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatusBadge = ({ status }: { status: UserStatus }) => {
  const { t } = useTranslation();
  const normalized = String(status).toUpperCase();
  const colors =
    normalized === "ACTIVE"
      ? "bg-green-100 text-green-800 border-green-200"
      : normalized === "INACTIVE"
        ? "bg-gray-100 text-gray-800 border-gray-200"
        : "bg-yellow-100 text-yellow-800 border-yellow-200";

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors}`}>
      {t(`userManagement.status.${normalized}`, normalized)}
    </span>
  );
};

const BooleanBadge = ({ value }: { value?: boolean }) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
        value
          ? "bg-green-100 text-green-800 border-green-200"
          : "bg-gray-100 text-gray-800 border-gray-200"
      }`}
    >
      {value ? t("common.yes", "Yes") : t("common.no", "No")}
    </span>
  );
};

const RowActionButton = ({
  label,
  icon,
  onClick,
  className = "",
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
    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {icon}
  </button>
);

const SystemUserFormModal = ({
  mode,
  user,
  roles,
  rolesLoading,
  onClose,
  onSubmit,
  isLoading,
}: SystemUserFormModalProps) => {
  const { t } = useTranslation();
  const isCreate = mode === "create";

  const roleOptions = [
    { value: "", label: t("userManagement.selectRole", "Select role") },
    ...roles.map((role) => ({ value: String(role.id), label: role.name })),
  ];

  const statusOptions = [
    { value: "", label: t("common.selectOption", "Select...") },
    { value: "ACTIVE", label: t("userManagement.status.ACTIVE", "Active") },
    { value: "INACTIVE", label: t("userManagement.status.INACTIVE", "Inactive") },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      password: "",
      roleId: user?.role?.id ? String(user.role.id) : "",
      status: user?.status ?? "",
      forcePasswordChange: true,
    },
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      password: "",
      roleId: user?.role?.id ? String(user.role.id) : "",
      status: user?.status ?? "",
      forcePasswordChange: true,
    });
  }, [reset, user]);

  const submit = (values: UserFormValues) => {
    const roleId = values.roleId ? Number(values.roleId) : undefined;

    if (isCreate) {
      if (!values.password || !roleId) {
        toast.error(t("userManagement.requiredFormFields", "Password and role are required."));
        return;
      }

      onSubmit({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        roleId,
        status: values.status || undefined,
        forcePasswordChange: Boolean(values.forcePasswordChange),
      });
      return;
    }

    const payload: UpdateSystemUserRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
    };

    if (values.status) payload.status = values.status;
    if (roleId) payload.roleId = roleId;
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {isCreate
                ? t("userManagement.createUser", "Create System User")
                : t("userManagement.editUser", "Edit System User")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t("userManagement.firstName", "First Name")}
                error={errors.firstName}
                {...register("firstName")}
              />
              <Input
                label={t("userManagement.lastName", "Last Name")}
                error={errors.lastName}
                {...register("lastName")}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="email"
                label={t("userManagement.email", "Email")}
                error={errors.email}
                {...register("email")}
              />
              <Input
                label={t("userManagement.phone", "Phone")}
                error={errors.phone}
                {...register("phone")}
              />
            </div>
            {isCreate && (
              <Input
                type="password"
                label={t("userManagement.password", "Password")}
                error={errors.password}
                {...register("password", { required: isCreate })}
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={t("userManagement.role", "Role")}
                options={roleOptions}
                disabled={rolesLoading}
                error={errors.roleId}
                helperText={
                  mode === "edit" && !user?.role
                    ? t("userManagement.roleMayBeMissing", "Current role may be omitted by the detail API.")
                    : undefined
                }
                {...register("roleId", { required: isCreate })}
              />
              <Select
                label={t("userManagement.statusLabel", "Status")}
                options={statusOptions}
                error={errors.status}
                {...register("status")}
              />
            </div>
            {isCreate && (
              <Checkbox
                label={t("userManagement.forcePasswordChange", "Require password change on next login")}
                {...register("forcePasswordChange")}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isLoading}>
              {isCreate ? t("userManagement.createUser", "Create System User") : t("common.saveChanges", "Save Changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserDetailsModal = ({
  user,
  fallbackUser,
  loading,
  onClose,
}: {
  user?: SystemUser;
  fallbackUser?: SystemUser | null;
  loading: boolean;
  onClose: () => void;
}) => {
  const { t, i18n } = useTranslation();
  const displayUser = user ?? fallbackUser;
  const role = user?.role ?? fallbackUser?.role;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("userManagement.userDetails", "User Details")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading || !displayUser ? (
            <div className="py-10 text-center text-gray-500">{t("common.loading", "Loading...")}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem label={t("userManagement.name", "Name")} value={getFullName(displayUser)} />
              <DetailItem label={t("userManagement.email", "Email")} value={displayUser.email} />
              <DetailItem label={t("userManagement.phone", "Phone")} value={displayUser.phone} />
              <DetailItem label={t("userManagement.role", "Role")} value={getRoleName(role)} />
              <DetailItem label={t("userManagement.statusLabel", "Status")} value={<StatusBadge status={displayUser.status} />} />
              <DetailItem label={t("userManagement.mfa", "MFA")} value={<BooleanBadge value={displayUser.mfa_enabled} />} />
              <DetailItem label={t("userManagement.lockedUntil", "Locked Until")} value={formatDateTime(i18n.language, displayUser.locked_until)} />
              <DetailItem label={t("userManagement.lastLogin", "Last Login")} value={formatDateTime(i18n.language, displayUser.last_login_at)} />
              <DetailItem label={t("userManagement.passwordChangedAt", "Password Changed At")} value={formatDateTime(i18n.language, displayUser.password_changed_at)} />
              <DetailItem label={t("userManagement.createdAt", "Created At")} value={formatDateTime(i18n.language, displayUser.created_at)} />
              <DetailItem label={t("userManagement.updatedAt", "Updated At")} value={formatDateTime(i18n.language, displayUser.updated_at)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="rounded-lg border border-gray-200 p-3">
    <div className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</div>
    <div className="text-sm text-gray-900 break-words">{value || "-"}</div>
  </div>
);

const ConfirmationModal = ({ action, onClose }: { action: ConfirmAction; onClose: () => void }) => {
  const { t } = useTranslation();
  const isDanger = action.tone === "danger";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${isDanger ? "text-red-600" : "text-yellow-600"}`} />
            <h2 className="text-lg font-semibold text-gray-900">{action.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" type="button">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700">{action.message}</p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={action.loading}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              type="button"
              loading={action.loading}
              onClick={action.onConfirm}
              className={isDanger ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : undefined}
            >
              {action.confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordModal = ({
  user,
  onClose,
  onSubmit,
  loading,
}: {
  user: SystemUser;
  onClose: () => void;
  onSubmit: (newPassword: string) => void;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("userManagement.resetPassword", "Reset Password")}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" type="button">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((values) => onSubmit(values.newPassword))}
          className="p-6 space-y-4"
        >
          <div className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              {t("userManagement.resetPasswordMessage", "This will replace the user's password and force a password change.")}
            </p>
          </div>
          <p className="text-sm text-gray-600">{getFullName(user)}</p>
          <Input
            type="password"
            label={t("userManagement.newPassword", "New Password")}
            error={errors.newPassword}
            {...register("newPassword")}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={loading}>
              {t("userManagement.resetPassword", "Reset Password")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.user);
  const canCreate = can(currentUser, PERMISSIONS.USER_CREATE);
  const canRead = can(currentUser, PERMISSIONS.USER_READ);
  const canUpdate = can(currentUser, PERMISSIONS.USER_UPDATE);
  const canActivate = can(currentUser, PERMISSIONS.USER_ACTIVATE);
  const canDeactivate = can(currentUser, PERMISSIONS.USER_DEACTIVATE);
  const canDelete = can(currentUser, PERMISSIONS.USER_DELETE);
  const canResetPassword = can(currentUser, PERMISSIONS.USER_RESET_PASSWORD);
  const canUnlock = can(currentUser, PERMISSIONS.USER_UNLOCK);
  const canUseRowActions =
    canRead ||
    canUpdate ||
    canActivate ||
    canDeactivate ||
    canResetPassword ||
    canUnlock ||
    canDelete;
  const [page, setPage] = useState(0);
  const [modalMode, setModalMode] = useState<UserModalMode | null>(null);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [detailsUser, setDetailsUser] = useState<SystemUser | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<SystemUser | null>(null);

  const usersQuery = useGetSystemUsers({
    params: { page, limit: PAGE_SIZE },
  });
  const rolesQuery = useGetSystemRoles({
    config: { enabled: modalMode !== null },
  });
  const detailQuery = useGetSystemUser({
    id: detailsUser?.id ?? selectedUser?.id,
    enabled: Boolean(detailsUser) || modalMode === "edit",
  });

  const createMutation = useCreateSystemUser();
  const updateMutation = useUpdateSystemUser();
  const activateMutation = useActivateSystemUser();
  const deactivateMutation = useDeactivateSystemUser();
  const deleteMutation = useDeleteSystemUser();
  const unlockMutation = useUnlockSystemUser();
  const resetPasswordMutation = useResetSystemUserPassword();

  const users = useMemo(() => usersQuery.data?.data.users ?? [], [usersQuery.data]);
  const total = usersQuery.data?.data.total ?? 0;
  const roles = rolesQuery.data?.data ?? [];

  const selectedForForm = useMemo(() => {
    if (!selectedUser) return null;
    const detailUser = detailQuery.data?.data;
    const baseUser = detailUser?.id === selectedUser.id ? detailUser : selectedUser;

    return {
      ...baseUser,
      role: baseUser.role ?? selectedUser.role ?? users.find((user) => user.id === selectedUser.id)?.role,
    };
  }, [detailQuery.data, selectedUser, users]);

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: systemUsersQueryKey });
  };

  const handleError = (error: unknown, fallback: string) => {
    toast.error(getErrorMessage(error, fallback));
  };

  const handleCreateOrUpdate = (data: CreateSystemUserRequest | UpdateSystemUserRequest) => {
    if (modalMode === "create") {
      createMutation.mutate(data as CreateSystemUserRequest, {
        onSuccess: () => {
          toast.success(t("userManagement.createSuccess", "System user created successfully"));
          setModalMode(null);
          invalidateUsers();
        },
        onError: (error) => handleError(error, t("userManagement.createError", "Failed to create system user")),
      });
      return;
    }

    if (!selectedUser) return;
    updateMutation.mutate(
      { id: selectedUser.id, data: data as UpdateSystemUserRequest },
      {
        onSuccess: () => {
          toast.success(t("userManagement.updateSuccess", "System user updated successfully"));
          setModalMode(null);
          setSelectedUser(null);
          invalidateUsers();
        },
        onError: (error) => handleError(error, t("userManagement.updateError", "Failed to update system user")),
      },
    );
  };

  const handleActivate = (user: SystemUser) => {
    activateMutation.mutate(user.id, {
      onSuccess: () => {
        toast.success(t("userManagement.activateSuccess", "System user activated successfully"));
        invalidateUsers();
      },
      onError: (error) => handleError(error, t("userManagement.activateError", "Failed to activate system user")),
    });
  };

  const handleDeactivate = (user: SystemUser) => {
    setConfirmAction({
      title: t("userManagement.deactivateUser", "Deactivate User"),
      message: t("userManagement.deactivateMessage", "This user will no longer be able to sign in."),
      confirmLabel: t("userManagement.deactivate", "Deactivate"),
      tone: "danger",
      loading: false,
      onConfirm: () => {
        deactivateMutation.mutate(user.id, {
          onSuccess: () => {
            toast.success(t("userManagement.deactivateSuccess", "System user deactivated successfully"));
            setConfirmAction(null);
            invalidateUsers();
          },
          onError: (error) => handleError(error, t("userManagement.deactivateError", "Failed to deactivate system user")),
        });
      },
    });
  };

  const handleUnlock = (user: SystemUser) => {
    setConfirmAction({
      title: t("userManagement.unlockUser", "Unlock User"),
      message: t("userManagement.unlockMessage", "This will clear the user's account lockout."),
      confirmLabel: t("userManagement.unlock", "Unlock"),
      tone: "warning",
      loading: false,
      onConfirm: () => {
        unlockMutation.mutate(user.id, {
          onSuccess: () => {
            toast.success(t("userManagement.unlockSuccess", "System user unlocked successfully"));
            setConfirmAction(null);
            invalidateUsers();
          },
          onError: (error) => handleError(error, t("userManagement.unlockError", "Failed to unlock system user")),
        });
      },
    });
  };

  const handleDelete = (user: SystemUser) => {
    setConfirmAction({
      title: t("userManagement.deleteUser", "Delete User"),
      message: t("userManagement.deleteMessage", "This user account will be permanently deleted."),
      confirmLabel: t("common.delete", "Delete"),
      tone: "danger",
      loading: false,
      onConfirm: () => {
        deleteMutation.mutate(user.id, {
          onSuccess: () => {
            toast.success(t("userManagement.deleteSuccess", "System user deleted successfully"));
            setConfirmAction(null);
            invalidateUsers();
          },
          onError: (error) => handleError(error, t("userManagement.deleteError", "Failed to delete system user")),
        });
      },
    });
  };

  const handleResetPassword = (newPassword: string) => {
    if (!resetPasswordUser) return;
    resetPasswordMutation.mutate(
      { id: resetPasswordUser.id, newPassword },
      {
        onSuccess: () => {
          toast.success(t("userManagement.resetPasswordSuccess", "Password reset successfully"));
          setResetPasswordUser(null);
        },
        onError: (error) => handleError(error, t("userManagement.resetPasswordError", "Failed to reset password")),
      },
    );
  };

  const columns: TableColumn<SystemUser>[] = [
    {
      key: "name",
      title: t("userManagement.name", "Name"),
      dataIndex: "firstName",
      render: (_value: unknown, record: SystemUser) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{getFullName(record)}</div>
          <div className="text-xs text-gray-500">ID: {record.id}</div>
        </div>
      ),
    },
    {
      key: "email",
      title: t("userManagement.email", "Email"),
      dataIndex: "email",
      render: (value: unknown) => <span className="text-sm text-gray-900">{String(value ?? "-")}</span>,
    },
    {
      key: "phone",
      title: t("userManagement.phone", "Phone"),
      dataIndex: "phone",
      render: (value: unknown) => <span className="text-sm text-gray-900">{String(value ?? "-")}</span>,
    },
    {
      key: "role",
      title: t("userManagement.role", "Role"),
      dataIndex: "role",
      render: (_value: unknown, record: SystemUser) => (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-800 border-blue-200">
          <Shield className="w-3 h-3" />
          {getRoleName(record.role)}
        </span>
      ),
    },
    {
      key: "status",
      title: t("userManagement.statusLabel", "Status"),
      dataIndex: "status",
      render: (value: unknown) => <StatusBadge status={String(value)} />,
    },
    {
      key: "createdAt",
      title: t("userManagement.createdAt", "Created At"),
      dataIndex: "created_at",
      render: (value: unknown) => (
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

  const actions = (record: SystemUser) => {
    const isCurrentUser = String(record.id) === String(currentUser?.id);
    const isActive = String(record.status).toUpperCase() === "ACTIVE";

    return (
      <div className="flex min-w-max items-center justify-end gap-1.5">
        {canRead && (
          <RowActionButton
            label={t("common.view", "View")}
            onClick={() => setDetailsUser(record)}
            icon={<Eye className="w-4 h-4" />}
          />
        )}
        {canUpdate && (
          <RowActionButton
            label={t("common.edit", "Edit")}
            onClick={() => {
              setSelectedUser(record);
              setModalMode("edit");
            }}
            icon={<Pencil className="w-4 h-4" />}
          />
        )}
        {isActive ? (
          canDeactivate && !isCurrentUser && (
            <RowActionButton
              label={t("userManagement.deactivate", "Deactivate")}
              onClick={() => handleDeactivate(record)}
              icon={<XCircle className="w-4 h-4" />}
              className="text-red-700 hover:border-red-200 hover:bg-red-50 hover:text-red-800"
            />
          )
        ) : (
          canActivate && (
            <RowActionButton
              label={t("userManagement.activate", "Activate")}
              onClick={() => handleActivate(record)}
              disabled={activateMutation.isPending}
              icon={<CheckCircle className="w-4 h-4" />}
              className="text-green-700 hover:border-green-200 hover:bg-green-50 hover:text-green-800"
            />
          )
        )}
        {canResetPassword && (
          <RowActionButton
            label={t("userManagement.resetPassword", "Reset Password")}
            onClick={() => setResetPasswordUser(record)}
            icon={<KeyRound className="w-4 h-4" />}
          />
        )}
        {canUnlock && isLocked(record) && (
          <RowActionButton
            label={t("userManagement.unlock", "Unlock")}
            onClick={() => handleUnlock(record)}
            icon={<LockOpen className="w-4 h-4" />}
            className="text-yellow-700 hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-800"
          />
        )}
        {canDelete && !isCurrentUser && (
          <RowActionButton
            label={t("common.delete", "Delete")}
            onClick={() => handleDelete(record)}
            icon={<Trash2 className="w-4 h-4" />}
            className="text-red-700 hover:border-red-200 hover:bg-red-50 hover:text-red-800"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("userManagement.title", "System Users")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("userManagement.subtitle", "Manage internal dashboard users and access")}
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => {
              setSelectedUser(null);
              setModalMode("create");
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("userManagement.addUser", "Add User")}
          </Button>
        )}
      </div>

      {usersQuery.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {isForbidden(usersQuery.error)
            ? t("userManagement.forbidden", "You do not have permission to view system users.")
            : getErrorMessage(usersQuery.error, t("userManagement.loadError", "Failed to load system users"))}
        </div>
      )}

      <Table
        columns={columns}
        data={users}
        loading={usersQuery.isLoading}
        emptyText={t("userManagement.noUsers", "No users found")}
        className="border border-gray-200 shadow-sm [&_table]:min-w-[920px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap"
        showActions={canUseRowActions}
        actions={actions}
        pagination={{
          current: page + 1,
          pageSize: PAGE_SIZE,
          total,
          onChange: (nextPage) => setPage(nextPage - 1),
        }}
      />

      {modalMode && (
        <SystemUserFormModal
          mode={modalMode}
          user={selectedForForm}
          roles={roles}
          rolesLoading={rolesQuery.isLoading}
          onClose={() => {
            setModalMode(null);
            setSelectedUser(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {detailsUser && (
        <UserDetailsModal
          user={detailQuery.data?.data}
          fallbackUser={detailsUser}
          loading={detailQuery.isLoading}
          onClose={() => setDetailsUser(null)}
        />
      )}

      {confirmAction && (
        <ConfirmationModal
          action={{
            ...confirmAction,
            loading: deactivateMutation.isPending || unlockMutation.isPending || deleteMutation.isPending,
          }}
          onClose={() => setConfirmAction(null)}
        />
      )}

      {resetPasswordUser && (
        <ResetPasswordModal
          user={resetPasswordUser}
          onClose={() => setResetPasswordUser(null)}
          onSubmit={handleResetPassword}
          loading={resetPasswordMutation.isPending}
        />
      )}
    </div>
  );
};

export const UserManagementRoutes = () => {
  return <UserManagement />;
};
