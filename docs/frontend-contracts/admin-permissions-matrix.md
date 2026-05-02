## Overview

Frontend should gate pages and buttons by permission keys, not role names. Backend RBAC remains the source of truth. `superadmin` also bypasses `RBACGuard` by role slug.

`GET /v0.0.1/api/admin/me` is auth-only and returns the current admin user through `AdminService.getCurrentAdminUser`; use its role/permissions payload if present. If a request returns `403`, hide/disable the action and refresh current permissions.

## Roles

| Role        | Slug         | Description                   | Assigned permissions                                                                                                                                                                                    |
| ----------- | ------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Super Admin | `superadmin` | Full system access            | All 82 catalog permissions; RBAC bypass by slug                                                                                                                                                         |
| Admin       | `admin`      | Administrative access         | All catalog permissions except `role:delete`, `user:delete`, `system:update`                                                                                                                            |
| Accountant  | `accountant` | Financial operations access   | `payment:*`, `debt:read`, `debt:list`, `customer:read`, `customer:list`, `audit:read`, `audit:list`                                                                                                     |
| Sales       | `sales`      | Sales and customer management | all `customer:*`, all `merchant:*`, all `business:*`, all sales permissions, `debt:create`, `debt:read`, `debt:list`, `dashboard:read`, `dashboard:read_sales`                                          |
| Support     | `support`    | Customer support access       | all `ticket:*`, `customer:read`, `customer:list`, `customer:update`, `debt:read`, `debt:list`, `payment:read`, `payment:list`, `dashboard:read`, `dashboard:read_support`                               |
| Operations  | `ops`        | Operations management         | all `debt:*`, all `payment:*`, `customer:read`, `customer:list`, `merchant:read`, `merchant:list`, `audit:read`, `ticket:read`, `ticket:list` selector in seed, `ticket:assign`, `ticket:change_status` |
| Compliance  | `compliance` | Compliance and audit access   | all `audit:*`, `exception_log:read`, `exception_log:list`, `customer:read`, `customer:list`, `merchant:read`, `merchant:list`, `debt:read`, `debt:list`, `payment:read`, `payment:list`                 |
| Risk        | `risk`       | Risk management access        | `debt:read`, `debt:list`, `debt:flag_review`, `customer:read`, `customer:list`, `merchant:read`, `merchant:list`, `payment:read`, `payment:list`, `audit:read`                                          |
| Auditor     | `auditor`    | Audit and review access       | all `audit:*`, `exception_log:read`, `exception_log:list`, `user:read`, `user:list`, `role:read`, `role:list`, `permission:read`, `permission:list`                                                     |

## Permission Catalog

| Permission                   | Domain              | Description / used by                                                                |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| `user:create`                | System users        | `POST /admin/users`                                                                  |
| `user:read`                  | System users        | `GET /admin/users/:id`                                                               |
| `user:update`                | System users        | `PATCH /admin/users/:id`                                                             |
| `user:delete`                | System users        | `DELETE /admin/users/:id`                                                            |
| `user:list`                  | System users        | `GET /admin/users`                                                                   |
| `user:activate`              | System users        | `POST /admin/users/:id/activate`                                                     |
| `user:deactivate`            | System users        | `POST /admin/users/:id/deactivate`                                                   |
| `user:reset_password`        | System users        | `POST /admin/users/:id/reset-password`                                               |
| `user:unlock`                | System users        | `POST /admin/users/:id/unlock`                                                       |
| `role:create`                | Roles               | `POST /admin/roles`                                                                  |
| `role:read`                  | Roles               | `GET /admin/roles/:id`                                                               |
| `role:update`                | Roles               | `PATCH /admin/roles/:id`                                                             |
| `role:delete`                | Roles               | `DELETE /admin/roles/:id`                                                            |
| `role:list`                  | Roles               | `GET /admin/roles`                                                                   |
| `role:assign_permissions`    | Roles               | `POST /admin/roles/:id/permissions`                                                  |
| `permission:read`            | Permissions         | `GET /admin/permissions/:id`                                                         |
| `permission:list`            | Permissions         | `GET /admin/permissions`                                                             |
| `debt:create`                | Debts               | Seeded permission; no admin controller route found                                   |
| `debt:read`                  | Debts               | `GET /admin/debts/:id`, `GET /admin/debts/:id/fee-preview`                           |
| `debt:update`                | Debts / recovery    | `POST /admin/recovery/debts/fee-snapshot/rebuild` plus seeded debt update permission |
| `debt:delete`                | Debts               | Seeded permission; no admin controller route found                                   |
| `debt:list`                  | Debts               | `GET /admin/debts`, `GET /admin/debts/stats`                                         |
| `debt:approve`               | Debts               | Seeded permission; no admin controller route found                                   |
| `debt:reject`                | Debts               | Seeded permission; no admin controller route found                                   |
| `debt:flag_review`           | Debts               | `POST /admin/debts/:id/actions/flag-review`                                          |
| `debt:resend_notifications`  | Debts               | `POST /admin/debts/:id/actions/resend-notifications`                                 |
| `debt:cancel`                | Debts               | `POST /admin/debts/:id/actions/cancel`                                               |
| `debt:extend_due_date`       | Debts               | `POST /admin/debts/:id/actions/extend-due-date`                                      |
| `customer:read`              | Customers           | `GET /admin/customers/:id`                                                           |
| `customer:list`              | Customers           | `GET /admin/customers`, pending approvals                                            |
| `customer:update`            | Customers           | `PATCH /admin/customers/:id`                                                         |
| `customer:activate`          | Customers           | `POST /admin/customers/:id/actions/activate`                                         |
| `customer:deactivate`        | Customers           | `POST /admin/customers/:id/actions/deactivate`                                       |
| `customer:approve`           | Customers           | approve manual registration                                                          |
| `customer:reject`            | Customers           | reject manual registration                                                           |
| `customer:session_revoke`    | Customers           | revoke sessions                                                                      |
| `merchant:read`              | Merchants           | `GET /admin/merchants/:id`                                                           |
| `merchant:list`              | Merchants           | `GET /admin/merchants`, pending approvals                                            |
| `merchant:update`            | Merchants           | `PATCH /admin/merchants/:id`                                                         |
| `merchant:approve`           | Merchants           | approve manual registration                                                          |
| `merchant:reject`            | Merchants           | reject manual registration                                                           |
| `merchant:activate`          | Merchants           | activate merchant                                                                    |
| `merchant:suspend`           | Merchants           | suspend merchant                                                                     |
| `merchant:unsuspend`         | Merchants           | unsuspend merchant                                                                   |
| `business:manage`            | Merchant businesses | list/create/update/deactivate merchant businesses                                    |
| `business:read`              | Business            | Seeded permission; no admin controller route found                                   |
| `business:list`              | Business            | Seeded permission; no admin controller route found                                   |
| `business:update`            | Business            | Seeded permission; no admin controller route found                                   |
| `payment:read`               | Payments / payouts  | payment detail, payout detail, recovery payment inspect                              |
| `payment:list`               | Payments / payouts  | payment list, payout list                                                            |
| `payment:refund`             | Payments            | Seeded permission; no admin controller route found                                   |
| `payment:process`            | Payments / recovery | payout settlement and recovery writes                                                |
| `audit:read`                 | Audit logs          | `GET /admin/audit-logs/:id`                                                          |
| `audit:list`                 | Audit logs          | `GET /admin/audit-logs`                                                              |
| `audit:export`               | Audit logs          | Seeded permission; no admin controller route found                                   |
| `exception_log:read`         | Exception logs      | `GET /admin/exception-logs/:id`                                                      |
| `exception_log:list`         | Exception logs      | `GET /admin/exception-logs`                                                          |
| `system:read`                | System config       | Seeded permission; no admin controller route found                                   |
| `system:update`              | System config       | Seeded permission; no admin controller route found                                   |
| `ticket:create`              | Support tickets     | `POST /admin/support`                                                                |
| `ticket:read`                | Support tickets     | list, stats, detail, audit                                                           |
| `ticket:update`              | Support tickets     | `PATCH /admin/support/:id`                                                           |
| `ticket:assign`              | Support tickets     | `POST /admin/support/:id/assign`                                                     |
| `ticket:change_status`       | Support tickets     | `POST /admin/support/:id/status`                                                     |
| `ticket:add_reply`           | Support tickets     | messages and attachments                                                             |
| `ticket:add_internal_note`   | Support tickets     | checked in service for internal notes                                                |
| `ticket:view_internal_notes` | Support tickets     | checked in service for internal-note visibility                                      |
| `ticket:escalate`            | Support tickets     | `POST /admin/support/:id/actions/:actionKey`                                         |
| `ticket:admin_all`           | Support tickets     | checked in service for all ticket admin behavior                                     |
| `sales_lead:create`          | Sales               | `POST /admin/sales/leads`                                                            |
| `sales_lead:read`            | Sales               | `GET /admin/sales/leads/:id`                                                         |
| `sales_lead:update`          | Sales               | update and convert lead                                                              |
| `sales_lead:list`            | Sales               | list and stats                                                                       |
| `sales_lead:assign`          | Sales               | assign lead                                                                          |
| `sales_assignment:read`      | Sales               | list assignments                                                                     |
| `sales_assignment:update`    | Sales               | create/deactivate assignments                                                        |
| `sales_assignment:list`      | Sales               | Seeded permission; no controller route uses it directly                              |
| `sales_performance:read`     | Sales               | `GET /admin/sales/performance`                                                       |
| `dashboard:read`             | Dashboards          | general stats, daily transactions, debts health                                      |
| `dashboard:read_profit`      | Dashboards          | profit dashboard                                                                     |
| `dashboard:read_support`     | Dashboards          | support dashboard                                                                    |
| `dashboard:read_sales`       | Dashboards          | sales dashboard                                                                      |

## Matrix

| Module/Page             | Action                                               | Permission                                                 | Superadmin | Admin            | Support | Sales | Accountant | Other roles                                        |
| ----------------------- | ---------------------------------------------------- | ---------------------------------------------------------- | ---------- | ---------------- | ------- | ----- | ---------- | -------------------------------------------------- |
| Dashboard               | General/daily/debts health                           | `dashboard:read`                                           | ✅         | ✅               | ✅      | ✅    | ❌         | ❌                                                 |
| Dashboard               | Profit                                               | `dashboard:read_profit`                                    | ✅         | ✅               | ❌      | ❌    | ❌         | ❌                                                 |
| Dashboard               | Support                                              | `dashboard:read_support`                                   | ✅         | ✅               | ✅      | ❌    | ❌         | ❌                                                 |
| Dashboard               | Sales                                                | `dashboard:read_sales`                                     | ✅         | ✅               | ❌      | ✅    | ❌         | ❌                                                 |
| System users            | List/read/create/update                              | `user:list/read/create/update`                             | ✅         | ✅               | ❌      | ❌    | ❌         | Auditor read-only                                  |
| System users            | Delete                                               | `user:delete`                                              | ✅         | ❌               | ❌      | ❌    | ❌         | ❌                                                 |
| System users            | Activate/deactivate/reset/unlock                     | matching `user:*`                                          | ✅         | ✅               | ❌      | ❌    | ❌         | ❌                                                 |
| Roles                   | List/read/create/update/assign                       | matching `role:*`                                          | ✅         | ✅ except delete | ❌      | ❌    | ❌         | Auditor read-only                                  |
| Roles                   | Delete                                               | `role:delete`                                              | ✅         | ❌               | ❌      | ❌    | ❌         | ❌                                                 |
| Permissions             | List/read                                            | `permission:list/read`                                     | ✅         | ✅               | ❌      | ❌    | ❌         | Auditor read-only                                  |
| Merchants               | List/read                                            | `merchant:list/read`                                       | ✅         | ✅               | ❌      | ✅    | ❌         | Ops/compliance/risk read-only                      |
| Merchants               | Update/approve/reject/activate/suspend               | matching `merchant:*`                                      | ✅         | ✅               | ❌      | ✅    | ❌         | ❌                                                 |
| Merchant businesses     | Manage                                               | `business:manage`                                          | ✅         | ✅               | ❌      | ✅    | ❌         | ❌                                                 |
| Customers               | List/read                                            | `customer:list/read`                                       | ✅         | ✅               | ✅      | ✅    | ✅         | Ops/compliance/risk read-only                      |
| Customers               | Update                                               | `customer:update`                                          | ✅         | ✅               | ✅      | ✅    | ❌         | ❌                                                 |
| Customers               | Activate/deactivate/approve/reject/revoke            | matching `customer:*`                                      | ✅         | ✅               | ❌      | ✅    | ❌         | ❌                                                 |
| Debts                   | List/read/fee preview                                | `debt:list/read`                                           | ✅         | ✅               | ✅      | ✅    | ✅         | Ops/compliance/risk read-only                      |
| Debts                   | Flag/resend/cancel/extend                            | matching `debt:*` actions                                  | ✅         | ✅               | ❌      | ❌    | ❌         | Ops full, risk flag only                           |
| Support tickets         | Create/list/read/update/assign/status/reply/escalate | matching `ticket:*`                                        | ✅         | ✅               | ✅      | ❌    | ❌         | Ops partial                                        |
| Sales leads             | CRUD/assign/convert                                  | matching `sales_lead:*`                                    | ✅         | ✅               | ❌      | ✅    | ❌         | ❌                                                 |
| Sales assignments       | Create/list/deactivate                               | `sales_assignment:update/read`                             | ✅         | ✅               | ❌      | ✅    | ❌         | ❌                                                 |
| Sales performance       | Read                                                 | `sales_performance:read`                                   | ✅         | ✅               | ❌      | ✅    | ❌         | ❌                                                 |
| Payments                | List/detail                                          | `payment:list/read`                                        | ✅         | ✅               | ✅      | ❌    | ✅         | Ops/compliance/risk read-only                      |
| Payments                | Refund/process/recovery                              | `payment:refund/process`                                   | ✅         | ✅               | ❌      | ❌    | ✅         | Ops ✅                                             |
| Payouts                 | List/detail                                          | `payment:list/read`                                        | ✅         | ✅               | ✅      | ❌    | ✅         | Ops/compliance/risk read-only                      |
| Payouts                 | Mark settled                                         | `payment:process`                                          | ✅         | ✅               | ❌      | ❌    | ✅         | Ops ✅                                             |
| Recovery/reconciliation | Write tools                                          | `payment:process` or `debt:update` + `SuperAdminGuard`     | ✅         | ❌               | ❌      | ❌    | ❌         | ❌                                                 |
| Audit logs              | List/read                                            | `audit:list/read`                                          | ✅         | ✅               | ❌      | ❌    | ✅         | Compliance/auditor, ops/risk read-only detail only |
| Exception logs          | List/read                                            | `exception_log:list/read`                                  | ✅         | ✅               | ❌      | ❌    | ❌         | Compliance/auditor                                 |
| Internal test APIs      | Create/force test data                               | superadmin slug + `x-internal-test-api-key` + enabled flag | ✅         | ❌               | ❌      | ❌    | ❌         | ❌                                                 |

## Frontend Guidance

- Open pages with the lowest read/list permission for that page: dashboards use `dashboard:*`, system users use `user:list`, roles use `role:list`, permissions use `permission:list`, merchants use `merchant:list`, customers use `customer:list`, debts use `debt:list`, support uses `ticket:read`, sales uses sales list/read permissions, payments/payouts use `payment:list`, audit uses `audit:list`, exception logs use `exception_log:list`.
- Show action buttons only when the exact action permission exists.
- Require confirmation for delete, deactivate, suspend, reject, cancel debt, force/recovery writes, payout settlement, session revoke, reset password, and internal test actions.
- On `403`, remove the failed action from UI, refresh `/admin/me`, and show a permission error.

## Unknowns / Gaps

- Seeded permissions with no admin controller route found: `debt:create`, `debt:delete`, `debt:approve`, `debt:reject`, `business:read`, `business:list`, `business:update`, `payment:refund`, `audit:export`, `system:read`, `system:update`, `sales_assignment:list`.
- `ticket:list` is referenced by the role seed selector for ops, but `PermissionAction.List` is not cataloged for tickets.
- Recovery endpoints use both `RBACGuard` and `SuperAdminGuard`; non-superadmin roles with `payment:process` still cannot call them.
- Internal test APIs do not use `@RequirePermission`; access is feature flag + superadmin slug + internal API key.
