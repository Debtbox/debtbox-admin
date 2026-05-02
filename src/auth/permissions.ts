export const PERMISSIONS = {
  USER_CREATE: "user:create",
  USER_READ: "user:read",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",
  USER_LIST: "user:list",
  USER_ACTIVATE: "user:activate",
  USER_DEACTIVATE: "user:deactivate",
  USER_RESET_PASSWORD: "user:reset_password",
  USER_UNLOCK: "user:unlock",

  ROLE_CREATE: "role:create",
  ROLE_READ: "role:read",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  ROLE_LIST: "role:list",
  ROLE_ASSIGN_PERMISSIONS: "role:assign_permissions",

  PERMISSION_READ: "permission:read",
  PERMISSION_LIST: "permission:list",

  CUSTOMER_READ: "customer:read",
  CUSTOMER_LIST: "customer:list",
  CUSTOMER_UPDATE: "customer:update",
  CUSTOMER_ACTIVATE: "customer:activate",
  CUSTOMER_DEACTIVATE: "customer:deactivate",
  CUSTOMER_APPROVE: "customer:approve",
  CUSTOMER_REJECT: "customer:reject",
  CUSTOMER_SESSION_REVOKE: "customer:session_revoke",

  MERCHANT_READ: "merchant:read",
  MERCHANT_LIST: "merchant:list",
  MERCHANT_UPDATE: "merchant:update",
  MERCHANT_APPROVE: "merchant:approve",
  MERCHANT_REJECT: "merchant:reject",
  MERCHANT_ACTIVATE: "merchant:activate",
  MERCHANT_SUSPEND: "merchant:suspend",
  MERCHANT_UNSUSPEND: "merchant:unsuspend",
  BUSINESS_MANAGE: "business:manage",

  DEBT_CREATE: "debt:create",
  DEBT_READ: "debt:read",
  DEBT_UPDATE: "debt:update",
  DEBT_DELETE: "debt:delete",
  DEBT_LIST: "debt:list",
  DEBT_APPROVE: "debt:approve",
  DEBT_REJECT: "debt:reject",
  DEBT_FLAG_REVIEW: "debt:flag_review",
  DEBT_RESEND_NOTIFICATIONS: "debt:resend_notifications",
  DEBT_CANCEL: "debt:cancel",
  DEBT_EXTEND_DUE_DATE: "debt:extend_due_date",

  PAYMENT_READ: "payment:read",
  PAYMENT_LIST: "payment:list",
  PAYMENT_REFUND: "payment:refund",
  PAYMENT_PROCESS: "payment:process",

  BUSINESS_READ: "business:read",
  BUSINESS_LIST: "business:list",
  BUSINESS_UPDATE: "business:update",

  TICKET_CREATE: "ticket:create",
  TICKET_LIST: "ticket:list",
  TICKET_READ: "ticket:read",
  TICKET_UPDATE: "ticket:update",
  TICKET_ASSIGN: "ticket:assign",
  TICKET_CHANGE_STATUS: "ticket:change_status",
  TICKET_ADD_REPLY: "ticket:add_reply",
  TICKET_ADD_INTERNAL_NOTE: "ticket:add_internal_note",
  TICKET_VIEW_INTERNAL_NOTES: "ticket:view_internal_notes",
  TICKET_ESCALATE: "ticket:escalate",
  TICKET_ADMIN_ALL: "ticket:admin_all",

  SALES_LEAD_CREATE: "sales_lead:create",
  SALES_LEAD_READ: "sales_lead:read",
  SALES_LEAD_UPDATE: "sales_lead:update",
  SALES_LEAD_LIST: "sales_lead:list",
  SALES_LEAD_ASSIGN: "sales_lead:assign",
  SALES_ASSIGNMENT_READ: "sales_assignment:read",
  SALES_ASSIGNMENT_UPDATE: "sales_assignment:update",
  SALES_ASSIGNMENT_LIST: "sales_assignment:list",
  SALES_PERFORMANCE_READ: "sales_performance:read",

  AUDIT_READ: "audit:read",
  AUDIT_LIST: "audit:list",
  AUDIT_EXPORT: "audit:export",

  EXCEPTION_LOG_READ: "exception_log:read",
  EXCEPTION_LOG_LIST: "exception_log:list",

  DASHBOARD_READ: "dashboard:read",
  DASHBOARD_PROFIT_READ: "dashboard:read_profit",
  DASHBOARD_SUPPORT_READ: "dashboard:read_support",
  DASHBOARD_SALES_READ: "dashboard:read_sales",

  SYSTEM_READ: "system:read",
  SYSTEM_UPDATE: "system:update",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const DASHBOARD_PERMISSIONS = [
  PERMISSIONS.DASHBOARD_READ,
  PERMISSIONS.DASHBOARD_PROFIT_READ,
  PERMISSIONS.DASHBOARD_SUPPORT_READ,
  PERMISSIONS.DASHBOARD_SALES_READ,
] as const;

export const SALES_PERMISSIONS = [
  PERMISSIONS.SALES_LEAD_LIST,
  PERMISSIONS.SALES_ASSIGNMENT_READ,
  PERMISSIONS.SALES_ASSIGNMENT_LIST,
  PERMISSIONS.SALES_PERFORMANCE_READ,
] as const;
