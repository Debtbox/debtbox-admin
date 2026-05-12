export interface GroupedDebtChildDTO {
  id: number;
  title?: string;
  amount?: string | number;
  status?: string;
  due_date?: string;
  created_at?: string;
  merchant_id?: number;
  customer_id?: number;
}

export interface GroupedDebt {
  groupId: string | number | null;
  isGrouped: boolean;
  debtIds: number[];
  debtsCount: number;
  groupAmount: string | number;
  groupStatus: string;
  debts: GroupedDebtChildDTO[];
}
