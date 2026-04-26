import { useUserStore, type User } from "@/stores/UserStore";
import type { Permission } from "./permissions";

export const isSuperadmin = (user?: Pick<User, "role"> | null): boolean =>
  user?.role?.slug === "superadmin";

export const can = (
  user: Pick<User, "role" | "permissions"> | null | undefined,
  permission: Permission | string,
): boolean => {
  if (isSuperadmin(user)) return true;
  return Array.isArray(user?.permissions) && user.permissions.includes(permission);
};

export const canAny = (
  user: Pick<User, "role" | "permissions"> | null | undefined,
  permissions: readonly (Permission | string)[],
): boolean => {
  if (isSuperadmin(user)) return true;
  return permissions.some((permission) => can(user, permission));
};

export const canAll = (
  user: Pick<User, "role" | "permissions"> | null | undefined,
  permissions: readonly (Permission | string)[],
): boolean => {
  if (isSuperadmin(user)) return true;
  return permissions.every((permission) => can(user, permission));
};

export const useCan = (permission: Permission | string): boolean => {
  const user = useUserStore((state) => state.user);
  return can(user, permission);
};

export const useCanAny = (permissions: readonly (Permission | string)[]): boolean => {
  const user = useUserStore((state) => state.user);
  return canAny(user, permissions);
};

export const useCanAll = (permissions: readonly (Permission | string)[]): boolean => {
  const user = useUserStore((state) => state.user);
  return canAll(user, permissions);
};

export const useIsSuperadmin = (): boolean => {
  const user = useUserStore((state) => state.user);
  return isSuperadmin(user);
};
