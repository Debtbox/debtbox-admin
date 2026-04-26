import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/stores/UserStore";
import { PERMISSIONS } from "@/auth/permissions";
import { can } from "@/auth/rbac";
import { toast } from "sonner";
import {
  CheckCircle,
  Eye,
  KeyRound,
  LockOpen,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/shared";
import { useGetSystemUsers } from "../api/getSystemUsers";
import { useGetSystemUser } from "../api/getSystemUser";
import { useGetSystemRoles } from "../api/getSystemRoles";
import { useCreateSystemUser } from "../api/createSystemUser";
import { useUpdateSystemUser } from "../api/updateSystemUser";
import { useActivateSystemUser } from "../api/activateSystemUser";
import { useDeactivateSystemUser } from "../api/deactivateSystemUser";
import { useDeleteSystemUser } from "../api/deleteSystemUser";
import { useUnlockSystemUser } from "../api/unlockSystemUser";
import { useResetSystemUserPassword } from "../api/resetSystemUserPassword";
import type { CreateSystemUserRequest } from "../api/createSystemUser";
import type { UpdateSystemUserRequest } from "../api/updateSystemUser";
import type { SystemUser } from "../api/getSystemUsers";
import {
  UsersTable,
  RowActionButton,
  SystemUserFormModal,
  UserDetailsModal,
  ConfirmationModal,
  ResetPasswordModal,
  type UserModalMode,
  type ConfirmAction,
} from "../components";

const PAGE_SIZE = 10;

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ??
  (error as { message?: string })?.message ??
  fallback;

const isForbidden = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status === 403;

const UserManagement = () => {
  const { t } = useTranslation();
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
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [resetPasswordUser, setResetPasswordUser] = useState<SystemUser | null>(
    null,
  );

  const usersQuery = useGetSystemUsers({ params: { page, limit: PAGE_SIZE } });
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

  const users = useMemo(
    () => usersQuery.data?.data.users ?? [],
    [usersQuery.data],
  );
  const total = usersQuery.data?.data.total ?? 0;
  const roles = rolesQuery.data?.data ?? [];

  const selectedForForm = useMemo(() => {
    if (!selectedUser) return null;
    const detailUser = detailQuery.data?.data;
    const baseUser =
      detailUser?.id === selectedUser.id ? detailUser : selectedUser;
    return {
      ...baseUser,
      role:
        baseUser.role ??
        selectedUser.role ??
        users.find((u) => u.id === selectedUser.id)?.role,
    };
  }, [detailQuery.data, selectedUser, users]);

  const handleError = (error: unknown, fallback: string) => {
    toast.error(getErrorMessage(error, fallback));
  };

  const handleCreateOrUpdate = (
    data: CreateSystemUserRequest | UpdateSystemUserRequest,
  ) => {
    if (modalMode === "create") {
      createMutation.mutate(data as CreateSystemUserRequest, {
        onSuccess: () => {
          toast.success(
            t(
              "userManagement.createSuccess",
              "System user created successfully",
            ),
          );
          setModalMode(null);
        },
        onError: (error) =>
          handleError(
            error,
            t("userManagement.createError", "Failed to create system user"),
          ),
      });
      return;
    }

    if (!selectedUser) return;
    updateMutation.mutate(
      { id: selectedUser.id, data: data as UpdateSystemUserRequest },
      {
        onSuccess: () => {
          toast.success(
            t(
              "userManagement.updateSuccess",
              "System user updated successfully",
            ),
          );
          setModalMode(null);
          setSelectedUser(null);
        },
        onError: (error) =>
          handleError(
            error,
            t("userManagement.updateError", "Failed to update system user"),
          ),
      },
    );
  };

  const handleActivate = (user: SystemUser) => {
    activateMutation.mutate(user.id, {
      onSuccess: () =>
        toast.success(
          t(
            "userManagement.activateSuccess",
            "System user activated successfully",
          ),
        ),
      onError: (error) =>
        handleError(
          error,
          t("userManagement.activateError", "Failed to activate system user"),
        ),
    });
  };

  const handleDeactivate = (user: SystemUser) => {
    setConfirmAction({
      title: t("userManagement.deactivateUser", "Deactivate User"),
      message: t(
        "userManagement.deactivateMessage",
        "This user will no longer be able to sign in.",
      ),
      confirmLabel: t("userManagement.deactivate", "Deactivate"),
      tone: "danger",
      loading: false,
      onConfirm: () => {
        deactivateMutation.mutate(user.id, {
          onSuccess: () => {
            toast.success(
              t(
                "userManagement.deactivateSuccess",
                "System user deactivated successfully",
              ),
            );
            setConfirmAction(null);
          },
          onError: (error) =>
            handleError(
              error,
              t(
                "userManagement.deactivateError",
                "Failed to deactivate system user",
              ),
            ),
        });
      },
    });
  };

  const handleUnlock = (user: SystemUser) => {
    setConfirmAction({
      title: t("userManagement.unlockUser", "Unlock User"),
      message: t(
        "userManagement.unlockMessage",
        "This will clear the user's account lockout.",
      ),
      confirmLabel: t("userManagement.unlock", "Unlock"),
      tone: "warning",
      loading: false,
      onConfirm: () => {
        unlockMutation.mutate(user.id, {
          onSuccess: () => {
            toast.success(
              t(
                "userManagement.unlockSuccess",
                "System user unlocked successfully",
              ),
            );
            setConfirmAction(null);
          },
          onError: (error) =>
            handleError(
              error,
              t("userManagement.unlockError", "Failed to unlock system user"),
            ),
        });
      },
    });
  };

  const handleDelete = (user: SystemUser) => {
    setConfirmAction({
      title: t("userManagement.deleteUser", "Delete User"),
      message: t(
        "userManagement.deleteMessage",
        "This user account will be permanently deleted.",
      ),
      confirmLabel: t("common.delete", "Delete"),
      tone: "danger",
      loading: false,
      onConfirm: () => {
        deleteMutation.mutate(user.id, {
          onSuccess: () => {
            toast.success(
              t(
                "userManagement.deleteSuccess",
                "System user deleted successfully",
              ),
            );
            setConfirmAction(null);
          },
          onError: (error) =>
            handleError(
              error,
              t("userManagement.deleteError", "Failed to delete system user"),
            ),
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
          toast.success(
            t(
              "userManagement.resetPasswordSuccess",
              "Password reset successfully",
            ),
          );
          setResetPasswordUser(null);
        },
        onError: (error) =>
          handleError(
            error,
            t("userManagement.resetPasswordError", "Failed to reset password"),
          ),
      },
    );
  };

  const actions = (record: SystemUser) => {
    const isCurrentUser = String(record.id) === String(currentUser?.id);
    const isActive = String(record.status).toUpperCase() === "ACTIVE";
    const isLocked = Boolean(record.locked_until);

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
        {isActive
          ? canDeactivate &&
            !isCurrentUser && (
              <RowActionButton
                label={t("userManagement.deactivate", "Deactivate")}
                onClick={() => handleDeactivate(record)}
                icon={<XCircle className="w-4 h-4" />}
                className="text-red-700 hover:border-red-200 hover:bg-red-50 hover:text-red-800"
              />
            )
          : canActivate && (
              <RowActionButton
                label={t("userManagement.activate", "Activate")}
                onClick={() => handleActivate(record)}
                disabled={activateMutation.isPending}
                icon={<CheckCircle className="w-4 h-4" />}
                className="text-green-700 hover:border-green-200 hover:bg-green-50 hover:text-green-800"
              />
            )}
        {canResetPassword && (
          <RowActionButton
            label={t("userManagement.resetPassword", "Reset Password")}
            onClick={() => setResetPasswordUser(record)}
            icon={<KeyRound className="w-4 h-4" />}
          />
        )}
        {canUnlock && isLocked && (
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
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("userManagement.title", "System Users")}
          </h1>
          <p className="text-gray-500 text-sm">
            {t(
              "userManagement.subtitle",
              "Manage internal dashboard users and access",
            )}
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => {
              setSelectedUser(null);
              setModalMode("create");
            }}
          >
            <Plus className="w-4 h-4 me-2" />
            {t("userManagement.addUser", "Add User")}
          </Button>
        )}
      </div>

      {usersQuery.isError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {isForbidden(usersQuery.error)
            ? t(
                "userManagement.forbidden",
                "You do not have permission to view system users.",
              )
            : getErrorMessage(
                usersQuery.error,
                t("userManagement.loadError", "Failed to load system users"),
              )}
        </div>
      )}

      <UsersTable
        data={users}
        isLoading={usersQuery.isLoading}
        pagination={{ page, limit: PAGE_SIZE, total }}
        onPageChange={setPage}
        showActions={canUseRowActions}
        actions={actions}
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
            loading:
              deactivateMutation.isPending ||
              unlockMutation.isPending ||
              deleteMutation.isPending,
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

export default UserManagement;
