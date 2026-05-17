export interface GroupedDebtChildDTO {
  id?: number;
  debtId?: string | number;
  title?: string;
  amount?: string | number;
  status?: string;
  due_date?: string;
  dueDate?: string;
  created_at?: string;
  merchant_id?: number;
  customer_id?: number;
  // Rich fields available from the details endpoint
  signatureUrl?: string | null;
  createWithSanad?: boolean;
  review_flagged_at?: string | null;
}

export interface GroupedDebt {
  groupId: string | number | null;
  isGrouped: boolean;
  debtIds: (number | string)[];
  debtsCount: number;
  groupAmount: string | number;
  groupStatus: string;
  debts: GroupedDebtChildDTO[];
}

export interface DebtGroupedActionData {
  debt: { id: number; status: string };
  groupedDebt: GroupedDebt | null;
  affectedCount: number;
}

export interface ResendDebtGroupedActionData extends DebtGroupedActionData {
  notifications: { debtId: number; notificationId: string; sent: boolean }[];
  sentCount: number;
}
