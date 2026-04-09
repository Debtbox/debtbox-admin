import type { RelatedEntityType, SupportTicketPriority, SupportTicketRequesterType, SupportTicketStatus, SupportTicketType } from "@/enums";

export interface SupportTicketDTO {
    id: string;
    code: string;
    requesterType: SupportTicketRequesterType;
    requesterMerchantId: string | null;
    requesterCustomerId: string | null;
    subject: string;
    description: string;
    type: SupportTicketType;
    priority: SupportTicketPriority;
    status: SupportTicketStatus;
    channel: string | null;
    relatedEntityType: RelatedEntityType | null;
    relatedEntityId: string | null;
    assigneeUserId: string | null;
    assignedTeam: string | null;
    tags: string[];
    lastMessageAt: string | null;
    resolvedAt: string | null;
    closedAt: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SupportTicketMessageDTO {
    id: string;
    senderType: string;
    senderUserId: number | null;
    senderMerchantId: string | null;
    senderCustomerId: string | null;
    body: string;
    isInternalNote: boolean;
    created_at: string;
}

export interface SupportTicketAttachmentDTO {
    id: string;
    filename: string;
    url: string;
    size: number;
    mimeType: string;
    created_at: string;
}

export interface SupportTicketRequesterDTO {
    type: string;
    // Add other fields as needed based on the requester type
}

export interface SupportTicketDetailsResponse {
    success: boolean;
    message: string;
    data: {
        ticket: SupportTicketDTO;
        messages: SupportTicketMessageDTO[];
        attachments: SupportTicketAttachmentDTO[];
        requester: SupportTicketRequesterDTO;
    };
}