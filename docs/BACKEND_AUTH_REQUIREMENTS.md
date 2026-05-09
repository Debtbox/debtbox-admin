# Backend Auth Requirements

Issues discovered during a frontend auth audit. The frontend has done everything it can on its side — the items below require backend changes.

---

## 1. HttpOnly Cookies (Critical)

**Current state:** The frontend sets auth tokens using `js-cookie` with `sameSite: strict` but without `httpOnly`. This means both the access token and refresh token are readable by any JavaScript running on the page. A single XSS vulnerability anywhere in the app would allow an attacker to steal both tokens.

**What the backend must do:**

- Issue both `access_token` and `refresh_token` as `Set-Cookie` response headers — not in the JSON body — on every login and refresh response.
- Cookie flags required:
  ```
  Set-Cookie: access_token=<value>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400
  Set-Cookie: refresh_token=<value>; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/admin/refresh; Max-Age=2592000
  ```
- Note the `Path=/api/auth/admin/refresh` scope on the refresh token — this restricts the browser to only send it to the refresh endpoint, not every API call.

**What the frontend will do once this is in place:**

- Stop calling `setAuthTokens()` entirely. The browser manages the cookie automatically.
- Stop reading `getCookie('access_token')` to check login state. Instead, the login-state check will rely on whether the profile fetch (`GET /admin/me`) succeeds.
- The `Authorization: Bearer` header in the Axios interceptor can be dropped if the backend switches to reading the cookie server-side, or kept if the backend accepts both.

**CSRF protection required:** Once tokens are httpOnly, CSRF becomes relevant because the browser automatically sends httpOnly cookies cross-origin (despite `SameSite=Strict`, defence in depth is good). Add a CSRF token:

- On login response, include a CSRF token in the JSON body (not in a cookie). Frontend stores it in memory and sends it as a custom header on every mutating request:
  ```
  X-CSRF-Token: <value>
  ```
- Backend validates the header on all non-GET requests to the authenticated API.

---

## 2. Refresh Token Rotation (High)

**Current state:** The same refresh token is sent every time `/auth/admin/refresh` is called, and the backend issues a new access token but does not invalidate the old refresh token. If a refresh token is ever leaked (network interception, log exposure, XSS before the httpOnly fix), it is valid until its expiry date with no way to revoke it.

**What the backend must do:**

- On every call to `POST /auth/admin/refresh`, issue a **new** refresh token and invalidate the old one atomically.
- The response must include both new tokens:
  ```json
  {
    "data": {
      "accessToken": "<new_access_token>",
      "refreshToken": "<new_refresh_token>"
    }
  }
  ```
- Store a record of all issued refresh tokens (hashed) with their `issued_at`, `expires_at`, and `revoked_at` timestamps.
- If the same refresh token is used twice (replay attack), immediately revoke the entire token family (all refresh tokens for that user session) and force re-login.

---

## 3. Rate Limiting on Token Endpoints (High)

**Current state:** There is no client-side throttle on how many times the frontend calls `/auth/admin/refresh`. A misbehaving client or attacker could hammer the endpoint.

**What the backend must do:**

Rate-limit the following endpoints per IP and per user:

| Endpoint | Limit |
|---|---|
| `POST /auth/admin/login` | 10 attempts / 15 min per IP |
| `POST /auth/admin/refresh` | 30 requests / 15 min per user |
| Any endpoint accepting credentials | Exponential backoff after 5 failures |

- On `POST /auth/admin/login`, after 5 failed attempts for a specific email, lock the account for 15 minutes and return a clear error (do **not** leak whether the email exists).
- Return `429 Too Many Requests` with a `Retry-After` header when limits are exceeded. The frontend already handles non-401/403 errors gracefully.

---

## 4. Force Password Change Enforcement (Medium)

**Current state:** The login response includes `forcePasswordChange: boolean`. The frontend now shows a warning toast when this is `true`, but it cannot actually block access — only the backend can enforce this.

**What the backend must do:**

- When `force_password_change = true` for a user, all API endpoints except the following must return `403 Forbidden` with a distinct error code:
  ```json
  {
    "error": "FORCE_PASSWORD_CHANGE",
    "message": "You must change your password before continuing."
  }
  ```
- Allowed endpoints while `force_password_change = true`:
  - `POST /auth/admin/logout`
  - `POST /auth/admin/change-password` (see below)
  - `GET /admin/me`

**New endpoint needed — `POST /auth/admin/change-password`:**

```
POST /auth/admin/change-password
Authorization: Bearer <access_token>

Body:
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

- Validates `currentPassword` against the stored hash.
- Enforces password policy (min 10 chars, complexity rules).
- Sets `force_password_change = false` on success.
- Invalidates all existing sessions (refresh tokens) except the current one.
- Returns new tokens so the frontend session continues without re-login.

The frontend will need a `/change-password` route that the app redirects to when the `FORCE_PASSWORD_CHANGE` error code is received.

---

## 5. Logout Token Revocation (Medium)

**Current state:** `POST /auth/admin/logout` is called by the frontend on user-initiated logout. The frontend clears its cookies and redirects. However, if the backend does not invalidate the refresh token server-side, the token remains valid for up to 30 days and can be replayed by anyone who obtained it.

**What the backend must do:**

- `POST /auth/admin/logout` must accept the current refresh token (from the cookie or request body) and immediately add it to a revocation list (or delete it from the active tokens table).
- Optionally accept a `logoutAll: true` body parameter that revokes all refresh tokens for the user across all devices.
- The endpoint must succeed even if the access token has already expired (accept refresh token alone for this call).

---

## 6. Account Lockout Status in API Responses (Low)

**Current state:** The `AdminProfileData` type has `locked_until` and `failed_login_attempts` fields, but these are not surfaced to the admin UI in any meaningful way.

**What the backend must do:**

- When returning `GET /admin/me`, include `locked_until` if the account is currently locked.
- When an admin attempts to log in while locked, return `423 Locked` (not `401`) with:
  ```json
  {
    "error": "ACCOUNT_LOCKED",
    "locked_until": "2025-05-09T14:30:00Z"
  }
  ```
  so the frontend can show a precise "Try again after X" message instead of a generic error.

---

## 7. Sensitive Fields in Profile Response (Low)

**Current state:** `GET /admin/me` currently returns fields the frontend explicitly ignores: `password_hash`, `refresh_access_token`, `mfa_secret`, `mfa_backup_codes`, `password_reset_token`, `password_reset_expires`. These are typed in the frontend `AdminProfileData` interface with a comment that they must never be used in UI.

**What the backend must do:**

- Remove all of the following from the `GET /admin/me` response payload entirely. They serve no purpose on the client and their presence is a data exposure risk:
  - `password_hash`
  - `refresh_access_token`
  - `mfa_secret`
  - `mfa_backup_codes`
  - `password_reset_token`
  - `password_reset_expires`
  - `failed_login_attempts`
  - `locked_until` (expose only if currently locked, see §6)

---

## Summary Table

| # | Issue | Severity | Backend work |
|---|---|---|---|
| 1 | Tokens not httpOnly | Critical | Set-Cookie with HttpOnly + CSRF token |
| 2 | No refresh token rotation | High | Rotate + revoke on every refresh |
| 3 | No rate limiting | High | Per-IP and per-user rate limits on auth endpoints |
| 4 | `forcePasswordChange` not enforced | Medium | Block all routes server-side + add change-password endpoint |
| 5 | Logout doesn't revoke tokens | Medium | Revoke refresh token in DB on logout |
| 6 | No `423 Locked` on login | Low | Return distinct error code with `locked_until` |
| 7 | Sensitive fields in `/admin/me` | Low | Strip from response payload |
