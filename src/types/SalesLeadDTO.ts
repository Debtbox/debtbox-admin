export type LeadType = "MERCHANT" | "CUSTOMER";
export type LeadSource = "REFERRAL" | "CAMPAIGN" | "COLD" | "EVENT" | "OTHER";
export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "CONVERTED"
  | "LOST";
export type EditableLeadStatus = Exclude<LeadStatus, "CONVERTED">;

export interface SalesLead {
  id: string;
  leadType: LeadType;
  fullName: string;
  phone: string | null;
  email: string | null;
  crNumber: string | null;
  source: LeadSource;
  status: LeadStatus;
  assignedSalesUserId: number | null;
  assignedSalesUser?: {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
  notes: string | null;
  convertedEntityType: LeadType | null;
  convertedEntityId: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type SalesLeadDTO = SalesLead;

export interface SalesLeadStats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
}

export interface SalesAssignment {
  id: string;
  salesUserId: number;
  salesUser?: SalesLead["assignedSalesUser"];
  entityType: LeadType;
  entityId: string;
  assignedAt: string;
  isActive: boolean;
  unassignedAt: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SalesPerformance {
  totalAssignedMerchants: number;
  activeMerchants: number;
  merchantsWithPayments: number;
  totalDebtCount: number;
  totalDebtAmount: string | number | null;
  totalPaidAmount: number | null;
  incentiveTier: string | null;
  incentiveAmount: string | number | null;
}

export interface SalesDashboard {
  totalLeads: number;
  assignedLeads: number;
  convertedLeads: number;
  leadsByStatus: Partial<Record<LeadStatus, number>>;
  activeMerchants: number;
  incentiveTier: string | null;
  incentiveAmount: string | number | null;
}

export interface CreateSalesLeadPayload {
  leadType: LeadType;
  fullName: string;
  phone?: string;
  email?: string;
  crNumber?: string;
  source: LeadSource;
  status?: EditableLeadStatus;
  notes?: string;
  assignedSalesUserId?: number | null;
}

export type UpdateSalesLeadPayload = Partial<CreateSalesLeadPayload>;

export interface ListSalesLeadsQuery {
  page?: number;
  limit?: number;
  status?: LeadStatus[];
  leadType?: LeadType;
  source?: LeadSource[];
  assignedSalesUserId?: number;
  crNumber?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListSalesAssignmentsQuery {
  page?: number;
  limit?: number;
  salesUserId?: number;
  entityType?: LeadType;
  isActive?: boolean;
  entityId?: string;
  startDate?: string;
  endDate?: string;
}
