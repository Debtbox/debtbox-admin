import type { ReactNode } from "react";
import { useUserStore } from "@/stores/UserStore";
import { canAny } from "@/auth/rbac";
import type { Permission } from "@/auth/permissions";
import { Forbidden, PermissionLoading } from "@/components/shared/Forbidden";

interface RequirePermissionProps {
  permissions?: readonly (Permission | string)[];
  superadminOnly?: boolean;
  children: ReactNode;
}

export const RequirePermission = ({
  permissions = [],
  superadminOnly,
  children,
}: RequirePermissionProps) => {
  const user = useUserStore((state) => state.user);
  const isProfileLoaded = useUserStore((state) => state.isProfileLoaded);

  if (!isProfileLoaded) {
    return <PermissionLoading />;
  }

  if (superadminOnly) {
    return user?.role?.slug === "superadmin" ? <>{children}</> : <Forbidden />;
  }

  if (!permissions.length || canAny(user, permissions)) {
    return <>{children}</>;
  }

  return <Forbidden />;
};
