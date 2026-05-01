# Debtbox Admin Sales Module — Frontend Contract + Codex Prompt

Source backend contract: `Admin Sales Frontend Contract`

## Goal
Implement and align the Admin Sales frontend with the backend Sales Module APIs.

Frontend must first audit existing API clients, pages, permissions, routes, hooks, components, and types, then update existing logic where needed, and finally implement missing APIs/UI.

---

## Base API

```ts
baseUrl = "/v0.0.1/api"
```

All requests require:

```http
Authorization: Bearer <admin_access_token>
Content-Type: application/json
Accept-Language: en | ar
```

Standard backend response:

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
};
```

---

## Enums

```ts
export enum SalesEntityType {
  MERCHANT = "MERCHANT",
  CUSTOMER = "CUSTOMER",
}

export enum SalesLeadSource {
  REFERRAL = "REFERRAL",
  CAMPAIGN = "CAMPAIGN",
  COLD = "COLD",
  EVENT = "EVENT",
  OTHER = "OTHER",
}

export enum SalesLeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  INTERESTED = "INTERESTED",
  CONVERTED = "CONVERTED",
  LOST = "LOST",
}
```

---

## Permissions Matrix

| Feature | API | Permission |
|---|---|---|
| Create lead | `POST /admin/sales/leads` | `sales_lead:create` |
| List leads | `GET /admin/sales/leads` | `sales_lead:list` |
| Lead stats | `GET /admin/sales/leads/stats` | `sales_lead:list` |
| Lead details | `GET /admin/sales/leads/:id` | `sales_lead:read` |
| Update lead | `PATCH /admin/sales/leads/:id` | `sales_lead:update` |
| Assign lead | `POST /admin/sales/leads/:id/assign` | `sales_lead:assign` |
| Convert lead | `POST /admin/sales/leads/:id/convert` | `sales_lead:update` |
| Create assignment | `POST /admin/sales/assignments` | `sales_assignment:update` |
| List assignments | `GET /admin/sales/assignments` | `sales_assignment:read` |
| Deactivate assignment | `POST /admin/sales/assignments/:id/deactivate` | `sales_assignment:update` |
| Sales performance | `GET /admin/sales/performance` | `sales_performance:read` |
| Sales dashboard | `GET /admin/dashboards/sales` | `dashboard:read_sales` |

---

## Role Scoping Rules

Frontend should not rely only on UI hiding, because backend enforces access too. Still, UI must follow these rules:

1. `sales` users see/manage only their own assigned leads and assignments.
2. `sales` users creating leads should not choose another sales user. Backend auto-assigns them.
3. `admin` and `superadmin` can manage all sales records.
4. `status = CONVERTED` must never be sent through update lead. Use the convert endpoint only.
5. Assignment/unassignment UI should be available only to users with `sales_lead:assign` or `sales_assignment:update`.

---

## Required Frontend Types

```ts
export type SalesLead = {
  id: string;
  leadType: SalesEntityType;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  crNumber?: string | null;
  source: SalesLeadSource;
  status: SalesLeadStatus;
  assignedSalesUserId?: number | null;
  notes?: string | null;
  convertedEntityType?: SalesEntityType | null;
  convertedEntityId?: string | null;
  convertedAt?: string | null;
  convertedByUserId?: number | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type SalesAssignment = {
  id: string;
  salesUserId: number;
  entityType: SalesEntityType;
  entityId: string;
  assignedAt: string;
  isActive: boolean;
  unassignedAt?: string | null;
  created_at: string;
  updated_at: string;
};

export type SalesLeadStats = {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
};

export type SalesPerformance = {
  salesUserId?: number;
  month: string;
  totalAssignedMerchants: number;
  activeMerchants: number;
  merchantsWithPayments: number;
  totalDebtCount: number;
  totalDebtAmount: string;
  totalPaidAmount: number;
  incentiveTier?: {
    minActiveMerchants: number;
    maxActiveMerchants: number | null;
    amount: number;
  } | null;
  incentiveAmount: number;
};

export type SalesDashboard = {
  funnel: {
    totalLeads: number;
    assignedLeads: number;
    convertedLeads: number;
    leadsByStatus: Array<{
      status: SalesLeadStatus;
      count: string | number;
    }>;
  };
  activeMerchants: number;
  incentiveTier?: {
    minActiveMerchants: number;
    maxActiveMerchants: number | null;
    amount: number;
  } | null;
  incentiveAmount: number;
};
```

---

## API Client Requirements

Create or update a dedicated sales API module, for example:

```text
src/api/admin/sales.ts
src/services/admin/sales.service.ts
src/features/admin/sales/api.ts
```

Follow the existing project structure.

### 1. Leads APIs

```ts
createSalesLead(payload)
GET /admin/sales/leads
```

Payload:

```ts
type CreateSalesLeadPayload = {
  leadType: SalesEntityType;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  crNumber?: string | null;
  source: SalesLeadSource;
  status?: Exclude<SalesLeadStatus, SalesLeadStatus.CONVERTED>;
  notes?: string | null;
  assignedSalesUserId?: number | null;
};
```

Validation:

- `fullName` required.
- `leadType` required.
- `source` required.
- At least one of `phone`, `email`, or `crNumber` required.
- Do not allow `CONVERTED` in create/update forms.
- For sales role, hide/omit `assignedSalesUserId`.

```ts
listSalesLeads(query)
GET /admin/sales/leads
```

Query:

```ts
type ListSalesLeadsQuery = {
  page?: number;
  limit?: number;
  status?: SalesLeadStatus[] | string;
  leadType?: SalesEntityType;
  source?: SalesLeadSource[] | string;
  assignedSalesUserId?: number;
  crNumber?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};
```

Response data:

```ts
{
  leads: SalesLead[];
  total: number;
}
```

Notes:

- For array filters, backend accepts comma-separated values like `NEW,CONTACTED`.
- Use existing table pagination conventions.

```ts
getSalesLeadStats()
GET /admin/sales/leads/stats
```

```ts
getSalesLead(id)
GET /admin/sales/leads/:id
```

```ts
updateSalesLead(id, payload)
PATCH /admin/sales/leads/:id
```

Payload must exclude `CONVERTED` status.

```ts
assignSalesLead(id, assignedSalesUserId)
POST /admin/sales/leads/:id/assign
```

Admin/superadmin may send `assignedSalesUserId: null` to unassign.

```ts
convertSalesLead(id, payload)
POST /admin/sales/leads/:id/convert
```

Payload:

```ts
{
  convertedEntityType: SalesEntityType;
  convertedEntityId: string;
}
```

---

### 2. Sales Assignments APIs

```ts
createSalesAssignment(payload)
POST /admin/sales/assignments
```

Payload:

```ts
{
  salesUserId: number;
  entityType: SalesEntityType;
  entityId: string;
}
```

```ts
listSalesAssignments(query)
GET /admin/sales/assignments
```

Query:

```ts
{
  page?: number;
  limit?: number;
  salesUserId?: number;
  entityType?: SalesEntityType;
  isActive?: boolean;
  entityId?: string;
  startDate?: string;
  endDate?: string;
}
```

Response data:

```ts
{
  assignments: SalesAssignment[];
  total: number;
}
```

```ts
deactivateSalesAssignment(id)
POST /admin/sales/assignments/:id/deactivate
```

---

### 3. Performance + Dashboard APIs

```ts
getSalesPerformance(query)
GET /admin/sales/performance
```

Query:

```ts
{
  month?: string; // YYYY-MM
  salesUserId?: number;
}
```

Notes:

- Month format must be `YYYY-MM`.
- Sales users are forced by backend to their own user ID.
- Admin/superadmin may omit `salesUserId` for all-sales summary.

```ts
getSalesDashboard()
GET /admin/dashboards/sales
```

---

## UI Requirements

Implement or update these screens depending on what already exists:

### 1. Sales Dashboard

Route example:

```text
/admin/sales/dashboard
```

Show:

- Total leads
- Assigned leads
- Converted leads
- Leads by status funnel
- Active merchants
- Incentive tier
- Incentive amount

Permission:

```ts
dashboard:read_sales
```

---

### 2. Sales Leads List

Route example:

```text
/admin/sales/leads
```

Table columns:

- Full name
- Lead type
- Phone
- Email
- CR number
- Source
- Status
- Assigned sales user
- Created at
- Actions

Filters:

- Search
- Status multi-select
- Lead type
- Source multi-select
- Assigned sales user, admin/superadmin only
- CR number
- Date range

Actions by permission:

| Action | Permission |
|---|---|
| View | `sales_lead:read` |
| Create | `sales_lead:create` |
| Edit | `sales_lead:update` |
| Assign/Reassign | `sales_lead:assign` |
| Convert | `sales_lead:update` |

Important:

- Do not show convert action for already converted leads.
- Do not show `CONVERTED` as a selectable status in create/edit forms.
- Use convert modal/action instead.

---

### 3. Lead Details

Route example:

```text
/admin/sales/leads/:id
```

Show all lead fields, conversion info, assignment info, created/updated dates.

Actions:

- Edit lead
- Assign/reassign/unassign
- Convert lead

Respect permissions.

---

### 4. Create/Edit Lead Form

Fields:

- Lead type
- Full name
- Phone
- Email
- CR number
- Source
- Status, excluding `CONVERTED`
- Notes
- Assigned sales user, admin/superadmin only and only if permitted

Validation:

- Require at least one of `phone`, `email`, `crNumber`.
- Status cannot be `CONVERTED`.
- Show backend duplicate error clearly.

---

### 5. Assign Lead Modal

Fields:

- Sales user selector
- Optional unassign action for admin/superadmin

Requirements:

- Sales user selector should load users with `sales` role using the existing users/admin-users API if available.
- Do not invent a backend route. Reuse existing system users/users management APIs.
- If no API exists, keep a TODO and make the selector integration isolated.

---

### 6. Convert Lead Modal

Fields:

- Converted entity type: `MERCHANT` or `CUSTOMER`
- Converted entity ID

Requirements:

- Use `POST /admin/sales/leads/:id/convert`.
- On success, refresh details/list/stats/dashboard.
- Show warning: conversion marks the lead as converted and may create active sales assignment.

---

### 7. Sales Assignments List

Route example:

```text
/admin/sales/assignments
```

Columns:

- Sales user
- Entity type
- Entity ID
- Assigned at
- Active status
- Unassigned at
- Actions

Filters:

- Sales user, admin/superadmin only
- Entity type
- Entity ID
- Active status
- Date range

Actions:

- Create assignment: `sales_assignment:update`
- Deactivate assignment: `sales_assignment:update`

---

### 8. Sales Performance

Route example:

```text
/admin/sales/performance
```

Filters:

- Month, format `YYYY-MM`
- Sales user, admin/superadmin only

Show:

- Total assigned merchants
- Active merchants
- Merchants with payments
- Total debt count
- Total debt amount
- Total paid amount
- Incentive tier
- Incentive amount

Money handling:

- Be careful with mixed formats.
- `totalDebtAmount` may be a decimal string.
- `totalPaidAmount` is currently returned as halala-like integer in the backend contract.
- Use existing project money formatting utilities if available.
- Do not silently divide all fields unless existing convention confirms it.

---

## Error Handling

Handle common backend errors:

### Duplicate active lead

```json
{
  "success": false,
  "message": "Active sales lead already exists with same phone, email, or CR number",
  "data": null,
  "errorCode": "BadRequestException"
}
```

Show this message near the form or as toast.

### Missing permission

```json
{
  "success": false,
  "message": "Forbidden resource",
  "data": null,
  "errorCode": "ForbiddenException"
}
```

Hide unauthorized actions where possible and show a clean forbidden state if route/API is blocked.

### Invalid conversion through update

```json
{
  "success": false,
  "message": "Use lead conversion endpoint to convert sales leads",
  "data": null,
  "errorCode": "BadRequestException"
}
```

Frontend should prevent this before request.