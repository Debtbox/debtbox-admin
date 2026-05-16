import type { GroupedDebt } from "./GroupedDebtDTO";

export type ReceivableStatus = "OPEN" | "PARTIALLY_SETTLED" | "SETTLED";

export interface ReceivableMerchant {
  id: number;
  nameAr: string;
  nameEn: string;
}

export interface ReceivableBusiness {
  id: number;
  nameAr: string;
  nameEn: string;
}

export interface ReceivableDebt {
  id: number;
  title: string;
  amount: string;
  status: string;
  dueDate: string;
  customer: {
    id: number;
    nameAr: string;
    nameEn: string;
  };
}

export interface ReceivableDTO {
  id: string;
  amountTotalHalala: number;
  amountOutstandingHalala: number;
  status: ReceivableStatus;
  createdAt: string;
  settledAt: string | null;
  merchant: ReceivableMerchant;
  business: ReceivableBusiness;
  debt: ReceivableDebt;
}

export interface AllocationDTO {
  id: string;
  amountAppliedHalala: number;
  appliedAt: string;
  createdBy: string;
  payoutId: string | null;
  payoutStatus: string | null;
}

export interface ReceivableDetailsDTO extends ReceivableDTO {
  allocations: AllocationDTO[];
  groupedDebt?: GroupedDebt | null;
}
