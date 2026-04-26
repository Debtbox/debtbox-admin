/** Permission from auth API */
export interface AuthPermission {
  id: number;
  resource: string;
  action: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/** Role from auth API */
export interface AuthRole {
  id: number;
  userType: string;
  name: string;
  slug: string;
  description?: string;
  is_system_role?: boolean;
  permissions?: AuthPermission[];
  created_at: string;
  updated_at: string;
}

/** User object returned by login/refresh API */
export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  role: AuthRole;
  permissions?: string[];
  mfa_enabled: boolean;
}

/** Login response data (camelCase tokens per backend) */
export interface AuthTokensData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  forcePasswordChange?: boolean;
}

/** Refresh response may return only tokens (and optionally user) */
export interface AuthRefreshData {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
}

/** Generic success response wrapper */
export interface AuthSuccessResponse<T = AuthTokensData> {
  success: boolean;
  message: string;
  data: T;
}

/** Profile/me API response (GET /admin/me) – includes extra fields, omit sensitive in UI */
export interface AdminProfileData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  mfa_enabled: boolean;
  force_password_change: boolean;
  last_login_at: string | null;
  role: Pick<AuthRole, "id" | "name" | "slug" | "userType"> | null;
  permissions?: string[];
  created_at: string;
  updated_at: string;
  // Backend may return; we do not use in store/UI
  password_hash?: string;
  refresh_access_token?: string | null;
  failed_login_attempts?: number;
  locked_until?: string | null;
  password_changed_at?: string | null;
  mfa_secret?: string | null;
  mfa_backup_codes?: string | null;
  password_reset_token?: string | null;
  password_reset_expires?: string | null;
}

/** Store user shape (safe fields for navbar/dropdown) */
export interface StoreUser {
  id: string;
  full_name_en: string;
  full_name_ar: string;
  email: string;
  role: {
    id: number;
    name: string;
    slug: string;
    userType: string;
  } | null;
  permissions: string[];
  phone?: string;
  status?: string;
  last_login_at?: string | null;
}

function mapRole(role?: Pick<AuthRole, "id" | "name" | "slug" | "userType"> | null): StoreUser["role"] {
  if (!role) return null;
  return {
    id: role.id,
    name: role.name,
    slug: role.slug,
    userType: role.userType,
  };
}

/** Map API user (login/refresh) to app UserStore shape */
export function mapAuthUserToStore(user: AuthUser): StoreUser {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;
  return {
    id: String(user.id),
    full_name_en: fullName,
    full_name_ar: fullName,
    email: user.email,
    role: mapRole(user.role),
    permissions: user.permissions ?? user.role?.permissions?.map((permission) => `${permission.resource}:${permission.action}`) ?? [],
    phone: user.phone,
    status: user.status,
  };
}

/** Map profile/me API response to UserStore shape */
export function mapProfileToStore(profile: AdminProfileData): StoreUser {
  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || profile.email;
  return {
    id: String(profile.id),
    full_name_en: fullName,
    full_name_ar: fullName,
    email: profile.email,
    role: mapRole(profile.role),
    permissions: profile.permissions ?? [],
    phone: profile.phone || undefined,
    status: profile.status,
    last_login_at: profile.last_login_at ?? undefined,
  };
}
