import { Navigate } from "react-router-dom";
import { useUserStore } from "@/stores/UserStore";
import { canAny, isSuperadmin } from "@/auth/rbac";
import { DASHBOARD_PERMISSIONS, PERMISSIONS } from "@/auth/permissions";
import { Forbidden, PermissionLoading } from "@/components/shared/Forbidden";

interface HomeCandidate {
  to: string;
  permissions?: readonly string[];
  superadminOnly?: boolean;
}

const HOME_CANDIDATES: HomeCandidate[] = [
  { to: "/dashboard", permissions: DASHBOARD_PERMISSIONS },
  { to: "/support-tickets", permissions: [PERMISSIONS.TICKET_READ] },
  { to: "/customers", permissions: [PERMISSIONS.CUSTOMER_LIST] },
  { to: "/debts-management", permissions: [PERMISSIONS.DEBT_LIST] },
  { to: "/merchants", permissions: [PERMISSIONS.MERCHANT_LIST] },
  { to: "/sales-leads", permissions: [PERMISSIONS.SALES_LEAD_LIST] },
  { to: "/system-users", permissions: [PERMISSIONS.USER_LIST] },
  { to: "/recovery", superadminOnly: true },
];

export const DefaultProtectedHome = () => {
  const user = useUserStore((state) => state.user);
  const isProfileLoaded = useUserStore((state) => state.isProfileLoaded);

  if (!isProfileLoaded) return <PermissionLoading />;

  const destination = HOME_CANDIDATES.find((item) =>
    item.superadminOnly ? isSuperadmin(user) : canAny(user, item.permissions ?? []),
  );
  return destination ? <Navigate to={destination.to} replace /> : <Forbidden />;
};
