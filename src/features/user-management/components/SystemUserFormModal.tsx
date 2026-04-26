import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UserCog, X } from "lucide-react";
import { Button, Checkbox, Input, Select } from "@/components/shared";
import type { SystemRole, SystemUser, UserStatus } from "../api/getSystemUsers";
import type { CreateSystemUserRequest } from "../api/createSystemUser";
import type { UpdateSystemUserRequest } from "../api/updateSystemUser";

const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().optional(),
  roleId: z.string().optional(),
  status: z.string().optional(),
  forcePasswordChange: z.boolean().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export type UserModalMode = "create" | "edit";

interface SystemUserFormModalProps {
  mode: UserModalMode;
  user?: SystemUser | null;
  roles: SystemRole[];
  rolesLoading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSystemUserRequest | UpdateSystemUserRequest) => void;
  isLoading: boolean;
}

export const SystemUserFormModal = ({
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
    {
      value: "INACTIVE",
      label: t("userManagement.status.INACTIVE", "Inactive"),
    },
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
        toast.error(
          t(
            "userManagement.requiredFormFields",
            "Password and role are required.",
          ),
        );
        return;
      }

      onSubmit({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        roleId,
        status: (values.status as UserStatus | undefined) || undefined,
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

    if (values.status) payload.status = values.status as UserStatus;
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

        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
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
                    ? t(
                        "userManagement.roleMayBeMissing",
                        "Current role may be omitted by the detail API.",
                      )
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
                label={t(
                  "userManagement.forcePasswordChange",
                  "Require password change on next login",
                )}
                {...register("forcePasswordChange")}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button type="submit" loading={isLoading}>
              {isCreate
                ? t("userManagement.createUser", "Create System User")
                : t("common.saveChanges", "Save Changes")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
