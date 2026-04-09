export const SupportTicketRequesterType = {
    MERCHANT: 'MERCHANT',
    CUSTOMER: 'CUSTOMER',
    INTERNAL: 'INTERNAL',
} as const;

export type SupportTicketRequesterType =
    (typeof SupportTicketRequesterType)[keyof typeof SupportTicketRequesterType];

export const SupportTicketStatus = {
    NEW: 'NEW',
    OPEN: 'OPEN',
    WAITING_ON_REQUESTER: 'WAITING_ON_REQUESTER',
    WAITING_ON_INTERNAL: 'WAITING_ON_INTERNAL',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED',
    REOPENED: 'REOPENED',
} as const;

export type SupportTicketStatus =
    (typeof SupportTicketStatus)[keyof typeof SupportTicketStatus];


export const SupportTicketType = {
    GENERAL: 'GENERAL',
    DEBT: 'DEBT',
    PAYMENT: 'PAYMENT',
    TECHNICAL: 'TECHNICAL',
    ACCOUNTING: 'ACCOUNTING',
    OTHER: 'OTHER',
} as const;

export type SupportTicketType =
    (typeof SupportTicketType)[keyof typeof SupportTicketType];

export const SupportTicketPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
} as const;

export type SupportTicketPriority =
    (typeof SupportTicketPriority)[keyof typeof SupportTicketPriority];

export const RelatedEntityType = {
    DEBT: 'DEBT',
    PAYMENT: 'PAYMENT',
    MERCHANT: 'MERCHANT',
    CUSTOMER: 'CUSTOMER',
    BUSINESS: 'BUSINESS',
    SANAD: 'SANAD',
    OTHER: 'OTHER',
} as const;

export type RelatedEntityType =
    (typeof RelatedEntityType)[keyof typeof RelatedEntityType];