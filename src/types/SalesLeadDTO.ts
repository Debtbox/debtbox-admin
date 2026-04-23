export type LeadType = "MERCHANT" | "CUSTOMER";
export type LeadSource = "REFERRAL" | "CAMPAIGN" | "COLD" | "EVENT" | "OTHER";
export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "CONVERTED"
  | "LOST";

export interface SalesLeadDTO {
  id: string;
  leadType: LeadType;
  fullName: string;
  phone: string | null;
  email: string | null;
  source: LeadSource;
  status: LeadStatus;
  assignedSalesUserId: number | null;
  notes: string | null;
  convertedEntityType: string | null;
  convertedEntityId: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
