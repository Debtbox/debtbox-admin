# System Users Management - Frontend Contract

## 1. Business Purpose
System Users Management lets Debtbox admins manage internal dashboard users, their roles, role permissions, account status, lockout state, passwords, and MFA self-service.

## 2. Auth & Permissions
All `/v0.0.1/api/admin/*` endpoints use `AuthGuard()` with `Authorization: Bearer <accessToken>`.

RBAC endpoints also use `RBACGuard` and `@RequirePermission(...)`. `superadmin` role bypasses permission checks.

| Endpoint | Permission |
|---|---|
| `POST /v0.0.1/api/admin/users` | `user:create` |
| `GET /v0.0.1/api/admin/users` | `user:list` |
| `GET /v0.0.1/api/admin/users/:id` | `user:read` |
| `PATCH /v0.0.1/api/admin/users/:id` | `user:update` |
| `DELETE /v0.0.1/api/admin/users/:id` | `user:delete` |
| `POST /v0.0.1/api/admin/users/:id/activate` | `user:activate` |
| `POST /v0.0.1/api/admin/users/:id/deactivate` | `user:deactivate` |
| `POST /v0.0.1/api/admin/users/:id/reset-password` | `user:reset_password` |
| `POST /v0.0.1/api/admin/users/:id/unlock` | `user:unlock` |
| `GET /v0.0.1/api/admin/roles` | `role:list` |
| `GET /v0.0.1/api/admin/roles/:id` | `role:read` |
| `POST /v0.0.1/api/admin/roles` | `role:create` |
| `PATCH /v0.0.1/api/admin/roles/:id` | `role:update` |
| `DELETE /v0.0.1/api/admin/roles/:id` | `role:delete` |
| `POST /v0.0.1/api/admin/roles/:id/permissions` | `role:assign_permissions` |
| `GET /v0.0.1/api/admin/permissions` | `permission:list` |
| `GET /v0.0.1/api/admin/permissions/:id` | `permission:read` |
| `GET /v0.0.1/api/admin/me` | authenticated admin user |
| `POST /v0.0.1/api/admin/change-password` | authenticated admin user |
| `POST /v0.0.1/api/admin/enable-mfa` | authenticated admin user |
| `POST /v0.0.1/api/admin/verify-mfa` | authenticated admin user |
| `POST /v0.0.1/api/admin/disable-mfa` | authenticated admin user |

## 3. API Base Info
- Admin auth base path: `/v0.0.1/api/auth/admin`
- Admin management base path: `/v0.0.1/api/admin`
- Auth header: `Authorization: Bearer <accessToken>`
- Content type: `application/json`
- Language header: `Accept-Language: en | ar | ur | bn`
- Success wrapper:

```ts
interface AppApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}
```

- Error wrapper from global filter:

```ts
interface AppApiError {
  success: false;
  message: string;
  data: null;
  errorCode: string; // usually Nest exception name, e.g. BadRequestException
}
```

- Users pagination format: `data: { users: SystemUser[]; total: number }`
- Users query accepts `page`, `limit`. Backend defaults: `page = 1`, `limit = 20`.
- Backend repository uses `skip: page * limit`, not `(page - 1) * limit`.

## 4. Endpoints

### POST /v0.0.1/api/admin/users
Purpose: Create internal admin/dashboard user.
Permission: `user:create`.
Request params: none.
Query params: none.
Request body:

```ts
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  status?: UserStatus;
  forcePasswordChange?: boolean;
}
```

Validation rules: all required except `status`, `forcePasswordChange`; `email` must be email; `roleId` number; `status` enum.
Response example:

```json
{ "success": true, "message": "Success", "data": { "id": 15, "firstName": "Ali", "lastName": "Alotaibi", "email": "admin@debtbox.sa", "phone": "+966500000000", "status": "ACTIVE", "force_password_change": false, "role": { "id": 3, "name": "Support", "slug": "support" }, "created_at": "2026-04-06T09:00:00.000Z", "updated_at": "2026-04-06T09:00:00.000Z" } }
```

Error cases: duplicate email/phone; role not found; validation; unauthorized; forbidden.
Frontend usage notes: call roles lookup first for `roleId`. Backend stores `forcePasswordChange` as `force_password_change`.

### GET /v0.0.1/api/admin/users
Purpose: List internal admin/dashboard users.
Permission: `user:list`.
Request params: none.
Query params:

```ts
{ page?: number; limit?: number }
```

Request body: none.
Validation rules: `page` integer min `0`; `limit` integer min `1`.
Response example:

```json
{ "success": true, "message": "Success", "data": { "users": [], "total": 42 } }
```

Error cases: unauthorized; forbidden.
Frontend usage notes: no search/filter/status filter exists in backend. Account for backend offset behavior.

### GET /v0.0.1/api/admin/users/:id
Purpose: Get user details.
Permission: `user:read`.
Request params: `id: number`.
Query params: none.
Request body: none.
Validation rules: `id` parsed by `ParseIntPipe`.
Response example:

```json
{ "success": true, "message": "Success", "data": { "id": 15, "firstName": "Ali", "lastName": "Alotaibi", "email": "admin@debtbox.sa", "phone": "+966500000000", "status": "ACTIVE", "mfa_enabled": false, "force_password_change": false, "last_login_at": null, "password_changed_at": null, "locked_until": null, "created_at": "2026-04-06T09:00:00.000Z", "updated_at": "2026-04-06T09:00:00.000Z" } }
```

Error cases: user not found; unauthorized; forbidden.
Frontend usage notes: backend removes `role` and `password_hash` from this response.

### PATCH /v0.0.1/api/admin/users/:id
Purpose: Update user profile, status, or role.
Permission: `user:update`.
Request params: `id: number`.
Query params: none.
Request body:

```ts
{
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  roleId?: number;
}
```

Validation rules: optional fields only; `email` must be email; `roleId` number; `status` enum.
Response example: wrapped `SystemUser`.
Error cases: invalid payload; user not found; role not found; unauthorized; forbidden.
Frontend usage notes: no duplicate email/phone pre-check in service; DB unique errors may return bad request.

### DELETE /v0.0.1/api/admin/users/:id
Purpose: Delete user.
Permission: `user:delete`.
Request params: `id: number`.
Query params: none.
Request body: none.
Validation rules: `id` parsed by `ParseIntPipe`.
Response example:

```json
{ "success": true, "message": "Success", "data": null }
```

Error cases: user not found; `Cannot delete your own account`; unauthorized; forbidden.
Frontend usage notes: require confirmation; hide/disable for current logged-in user.

### POST /v0.0.1/api/admin/users/:id/activate
Purpose: Set user status to `ACTIVE`.
Permission: `user:activate`.
Request params: `id: number`.
Query params: none.
Request body: none.
Validation rules: `id` parsed by `ParseIntPipe`.
Response example: wrapped `SystemUser` with `status: "ACTIVE"`.
Error cases: user not found; unauthorized; forbidden.
Frontend usage notes: confirmation recommended.

### POST /v0.0.1/api/admin/users/:id/deactivate
Purpose: Set user status to `INACTIVE`.
Permission: `user:deactivate`.
Request params: `id: number`.
Query params: none.
Request body: none.
Validation rules: `id` parsed by `ParseIntPipe`.
Response example: wrapped `SystemUser` with `status: "INACTIVE"`.
Error cases: user not found; unauthorized; forbidden.
Frontend usage notes: backend does not prevent self-deactivation.

### POST /v0.0.1/api/admin/users/:id/reset-password
Purpose: Admin resets another user password and forces password change.
Permission: `user:reset_password`.
Request params: `id: number`.
Query params: none.
Request body:

```ts
{ newPassword: string }
```

Validation rules: `newPassword` required string. No min/complexity rule found.
Response example:

```json
{ "success": true, "message": "Success", "data": null }
```

Error cases: invalid payload; user not found; unauthorized; forbidden.
Frontend usage notes: sensitive action; use confirmation and password input.

### POST /v0.0.1/api/admin/users/:id/unlock
Purpose: Clear account lockout.
Permission: `user:unlock`.
Request params: `id: number`.
Query params: none.
Request body: none.
Validation rules: `id` parsed by `ParseIntPipe`.
Response example: wrapped `SystemUser` with `locked_until: null`, `failed_login_attempts: 0`.
Error cases: user not found; unauthorized; forbidden.
Frontend usage notes: show action only when `locked_until` is set.

### GET /v0.0.1/api/admin/roles
Purpose: Roles lookup/list.
Permission: `role:list`.
Response example:

```json
{ "success": true, "message": "Success", "data": [{ "id": 3, "userType": "ADMIN", "name": "Support", "slug": "support", "description": "Customer support access", "is_system_role": false, "permissions": [] }] }
```

Frontend usage notes: use for create/edit user role selector and role management UI.

### GET /v0.0.1/api/admin/roles/:id
Purpose: Role details.
Permission: `role:read`.
Request params: `id: number`.
Response example: wrapped `Role`.
Error cases: role not found; unauthorized; forbidden.

### POST /v0.0.1/api/admin/roles
Purpose: Create role.
Permission: `role:create`.
Request body:

```ts
{
  name: string;
  slug: string;
  description?: string;
  userType?: string;
  isSystemRole?: boolean;
  permissionIds?: number[];
}
```

Validation rules: `name`, `slug` required strings; `permissionIds` optional number array.
Error cases: duplicate slug; invalid permissions; unauthorized; forbidden.
Frontend usage notes: `userType` examples use `ADMIN`; enum exists but DTO validates string only.

### PATCH /v0.0.1/api/admin/roles/:id
Purpose: Update role.
Permission: `role:update`.
Request body:

```ts
{ name?: string; description?: string; userType?: string }
```

Error cases: role not found; cannot modify system role only when trying `isSystemRole: false`; unauthorized; forbidden.
Frontend usage notes: slug update is not implemented.

### DELETE /v0.0.1/api/admin/roles/:id
Purpose: Delete role.
Permission: `role:delete`.
Error cases: role not found; cannot delete system role; cannot delete role assigned to users; unauthorized; forbidden.
Frontend usage notes: destructive confirmation required.

### POST /v0.0.1/api/admin/roles/:id/permissions
Purpose: Replace role permissions.
Permission: `role:assign_permissions`.
Request body:

```ts
{ permissionIds: number[] }
```

Validation rules: required array of numbers.
Response example: wrapped `Role`.
Error cases: role not found; some permissions not found; unauthorized; forbidden.
Frontend usage notes: request replaces the full permission set.

### GET /v0.0.1/api/admin/permissions
Purpose: Permissions lookup/list.
Permission: `permission:list`.
Response example:

```json
{ "success": true, "message": "Success", "data": [{ "id": 1, "resource": "user", "action": "create", "name": "Create User", "description": "Create new system users", "created_at": "2026-04-06T09:00:00.000Z", "updated_at": "2026-04-06T09:00:00.000Z" }] }
```

Frontend usage notes: group by `resource`.

### GET /v0.0.1/api/admin/permissions/:id
Purpose: Permission details.
Permission: `permission:read`.
Request params: `id: number`.
Response example: wrapped `Permission`.
Error cases: permission not found; unauthorized; forbidden.

### GET /v0.0.1/api/admin/me
Purpose: Current authenticated admin user.
Permission: authenticated admin user.
Response example: wrapped `SystemUser`.
Frontend usage notes: backend removes `role` from response through `getUserById`.

### POST /v0.0.1/api/admin/change-password
Purpose: Current admin changes own password.
Permission: authenticated admin user.
Request body:

```ts
{ currentPassword: string; newPassword: string }
```

Validation rules: both required strings. No min/complexity rule found.
Response example: wrapped `null`.
Error cases: current password incorrect; user not found; unauthorized.

### POST /v0.0.1/api/admin/reset-password-request
Purpose: Request admin password reset token by email.
Permission: public under admin controller path; controller has class `AuthGuard()`, but this method has no explicit override. Treat as requiring auth unless verified in runtime.
Request body:

```ts
{ email: string }
```

Response example:

```json
{ "success": true, "message": "Success", "data": { "token": "65b6...", "expiresAt": "2026-04-06T11:30:00.000Z" } }
```

Frontend usage notes: backend returns token in response; email sending is commented out.

### POST /v0.0.1/api/admin/reset-password
Purpose: Reset password with token.
Permission: public under admin controller path; controller has class `AuthGuard()`, but this method has no explicit override. Treat as requiring auth unless verified in runtime.
Request body:

```ts
{ token: string; newPassword: string }
```

Error cases: invalid token; expired token.

### POST /v0.0.1/api/admin/enable-mfa
Purpose: Generate MFA secret, QR URL, backup codes.
Permission: authenticated admin user.
Response: `{ secret: string; qrCodeUrl: string; backupCodes: string[] }`.
Error cases: MFA already enabled; user not found; unauthorized.

### POST /v0.0.1/api/admin/verify-mfa
Purpose: Verify MFA token or backup code.
Permission: authenticated admin user.
Request body: `{ token: string }`.
Response: `{ verified: boolean }`.
Error cases: MFA secret not found; invalid payload; user not found; unauthorized.

### POST /v0.0.1/api/admin/disable-mfa
Purpose: Disable current admin MFA.
Permission: authenticated admin user.
Response: wrapped `null`.
Error cases: user not found; unauthorized.

### POST /v0.0.1/api/auth/admin/login
Purpose: Admin login.
Request body: `{ login: string; password: string; rememberMe?: boolean }`.
Response data: `{ accessToken, refreshToken, expiresIn, refreshExpiresIn, tokenType, user, forcePasswordChange }`.
Error cases: invalid credentials; inactive account; locked account.

### POST /v0.0.1/api/auth/admin/refresh
Purpose: Refresh admin token.
Request body: `{ refreshToken: string }`.
Response data: `{ accessToken, refreshToken, expiresIn, refreshExpiresIn, tokenType }`.

### POST /v0.0.1/api/auth/admin/logout
Purpose: Logout current admin.
Permission: authenticated admin user.
Response: wrapped `null`.

## 5. Data Models

```ts
export type UserStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'BANNED' | 'SUSPENDED';
export type UserType = 'ADMIN' | 'SUPER_ADMIN' | 'ANALYST';
export type Language = 'ar' | 'en' | 'ur' | 'bn';

export interface Permission {
  id: number;
  resource: string;
  action: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  userType: UserType;
  name: string;
  slug: string;
  description: string | null;
  is_system_role: boolean;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface SystemUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: UserStatus;
  role?: Role;
  failed_login_attempts?: number;
  locked_until?: string | null;
  password_changed_at?: string | null;
  last_login_at?: string | null;
  mfa_enabled: boolean;
  force_password_change: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSystemUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  status?: UserStatus;
  forcePasswordChange?: boolean;
}

export interface UpdateSystemUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  roleId?: number;
}

export interface SystemUserListQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedSystemUserResponse {
  users: SystemUser[];
  total: number;
}

export interface ResetUserPasswordPayload {
  newPassword: string;
}

export interface AssignRolePermissionsPayload {
  permissionIds: number[];
}
```

## 6. Validation Rules for Frontend
- `firstName`, `lastName`, `phone`, `password`, `newPassword`, `currentPassword`, `token`, `slug`, `name`: required string where DTO marks required.
- `email`: required and valid email for create/reset request; optional valid email for update.
- `roleId`: required number on create; optional number on update.
- `permissionIds`: number array.
- `page`: optional integer, backend min `0`.
- `limit`: optional integer min `1`.
- Password complexity/min length: Not found in backend.
- Phone format: Not found in backend beyond non-empty string.
- Extra request fields are rejected globally by `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.

## 7. Statuses / Enums
- `UserStatus`: `ACTIVE`, `PENDING`, `INACTIVE`, `BANNED`, `SUSPENDED`
- `UserType`: `ADMIN`, `SUPER_ADMIN`, `ANALYST`
- `Language`: `ar`, `en`, `ur`, `bn`
- System user permissions:
  - `user:create`, `user:read`, `user:update`, `user:delete`, `user:list`, `user:activate`, `user:deactivate`, `user:reset_password`, `user:unlock`
  - `role:create`, `role:read`, `role:update`, `role:delete`, `role:list`, `role:assign_permissions`
  - `permission:read`, `permission:list`
- Seed roles found: `superadmin`, `admin`, `accountant`, `sales`, `support`, `ops`, `compliance`, `risk`, `auditor`

## 8. Suggested Frontend Pages

### System Users List Page
- Route suggestion: `/admin/system-users`
- API calls: `GET /v0.0.1/api/admin/users`, `GET /v0.0.1/api/admin/roles`
- Table columns: name, email, phone, role, status, MFA, locked until, last login, created at.
- Filters: backend supports pagination only. Role/status/search filters would be client-side unless backend is extended.
- Row actions: view, edit, activate/deactivate, reset password, unlock, delete.
- States: loading table, empty users, forbidden, generic error.

### Create System User Page/Modal
- Route suggestion: `/admin/system-users/new`
- Fields: firstName, lastName, email, phone, password, roleId, status, forcePasswordChange.
- API calls: `GET /roles`, `POST /users`.

### Edit System User Page/Modal
- Route suggestion: `/admin/system-users/:id/edit`
- Fields: firstName, lastName, email, phone, roleId, status.
- API calls: `GET /users/:id`, `GET /roles`, `PATCH /users/:id`.
- Note: detail endpoint omits role; list row may be needed for current role, or fetch list/roles separately.

### View System User Details Drawer/Page
- Route suggestion: `/admin/system-users/:id`
- API calls: `GET /users/:id`.
- Fields: name, email, phone, status, MFA, force password change, locked until, password changed at, last login, created/updated.

### Activate/Deactivate Action
- API calls: `POST /users/:id/activate`, `POST /users/:id/deactivate`.
- Use confirmation for deactivate.
- Backend does not block self-deactivation.

### Reset Password Action
- API call: `POST /users/:id/reset-password`.
- Fields: newPassword.
- On success, backend sets `force_password_change = true`.

### Unlock User Action
- API call: `POST /users/:id/unlock`.
- Show only if `locked_until` has a value.

### Roles/Permissions Management
- Route suggestions: `/admin/roles`, `/admin/roles/:id`.
- API calls: roles CRUD, `GET /permissions`, `POST /roles/:id/permissions`.
- UI: group permissions by `resource`; save sends full selected `permissionIds`.

## 9. UX / Business Notes
- Admin-only feature.
- Disable or confirm self-delete; backend prevents self-delete.
- Backend does not prevent self-deactivation; frontend should avoid it.
- Show status labels clearly.
- Show role names and permission names, with `resource:action` as secondary text.
- Confirm delete, deactivate, reset password, unlock, and permission reassignment.
- Audit events are recorded internally for create/update/delete/status/password/role-permission actions, but user responses do not expose `createdBy`/`updatedBy`.

## 10. Admin RBAC / Frontend Permission Requirements

System Users required permissions:
- List page: `user:list`
- Details: `user:read`
- Create: `user:create`
- Edit: `user:update`
- Delete: `user:delete`
- Activate: `user:activate`
- Deactivate: `user:deactivate`
- Reset password: `user:reset_password`
- Unlock: `user:unlock`

Important current backend limitation:
- Login response does not include role or permissions.
- `/admin/me` removes role and permissions.
- Frontend cannot reliably hide/show pages by backend permissions yet unless permissions are provided from another trusted source.

Support role expected behavior:
- Support must NOT see System Users, Roles, Permissions, Merchants, Sales, Profit Dashboard, Audit Logs, Exception Logs, or Recovery Tools.
- Support can see support tickets, support dashboard, customers list/details/update, debts list/details, and payments/payouts list/details.

Superadmin rule:
- Frontend should treat `role.slug === 'superadmin'` as full access.
- Do NOT treat `userType === 'SUPER_ADMIN'` alone as full access.

Recommended backend improvement:
- Add effective permissions to either login response or `/admin/me` response.

Recommended response shape:

```ts
interface CurrentAdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: UserStatus;
  mfa_enabled: boolean;
  role: {
    id: number;
    name: string;
    slug: string;
    userType: UserType;
  };
  permissions: AdminPermissionKey[];
}
```

## 11. Missing / Unclear Backend Items
- No backend search/filter/sort for users.
- Users list pagination uses `{ users, total }` only; no `page`, `limit`, `totalPages`.
- Users list repository offset appears to use `skip = page * limit`.
- User detail endpoint removes `role`, while list/create/update responses may include role.
- Password complexity rules not found.
- Phone format rules not found.
- Reset-password request/reset endpoints are under `AdminController`, whose class has `AuthGuard()`. They look intended for self-service but may require auth.
- Backend returns password reset token in API response; email sending is commented out.
- No direct “assign role to user” endpoint; use `PATCH /users/:id` with `roleId`.
- No direct “assign permissions to user” endpoint; permissions are role-based only.
- No explicit endpoint to get current user permissions; login `/me` response omits role/permissions.
- No soft delete found for system users; `DELETE /users/:id` removes the entity.

## 12. Frontend Codex Prompt

```text
You are working in the Debtbox React admin dashboard.

Task: Implement System Users Management using the backend contract in docs/frontend-contracts/system-users-management.md.

Instructions:
- Inspect the React admin dashboard structure first.
- Follow AGENTS.md.
- Reuse existing table, form, modal, routing, API client, auth, permission, validation, state, styling, and i18n patterns.
- Implement only System Users Management.
- Use only the documented backend APIs and fields. Do not invent filters, fields, or endpoints.
- Preserve existing styling, routing conventions, state management, validation style, and i18n patterns.
- Build production-quality code with safe loading, empty, error, forbidden, and confirmation states.
- Avoid unrelated refactors and formatting churn.

Required feature coverage:
- System users list with backend pagination.
- Create user.
- View user details.
- Edit user.
- Activate/deactivate user.
- Delete user if the UI permission model allows it.
- Reset user password.
- Unlock user when locked.
- Roles lookup for user forms.
- Roles/permissions management only if it fits existing admin navigation patterns; use roles and permissions APIs from the contract.

Important backend notes:
- Base admin path is /v0.0.1/api/admin.
- Auth header is Authorization: Bearer <accessToken>.
- Success wrapper is { success, message, data }.
- Error wrapper is { success: false, message, data: null, errorCode }.
- User list response is data: { users, total }.
- Backend supports only page and limit for user list.
- User detail response omits role.
- Permissions are role-based; there is no per-user permission assignment API.
- Use PATCH /users/:id with roleId to assign role.
- Use POST /roles/:id/permissions to replace role permissions.

Deliverable:
- Implement the feature.
- Provide changed files.
- Provide targeted testing steps.
- Mention any skipped tests or backend limitations encountered.
```
