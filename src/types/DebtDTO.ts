export interface DebtDTO {
  id: number;
  title: string;
  amount: string;
  status: string;
  due_date: string;
  created_at: string;
  merchant_id: number;
  merchant_full_name_ar: string;
  merchant_full_name_en: string;
  customer_id: number;
  customer_full_name_ar: string;
  customer_full_name_en: string;
  business_id: number;
  business_name_ar: string;
  business_name_en: string;
}

export interface DebtDetailsDTO extends DebtDTO {
  createwithsanad: boolean;
  updated_at: string;
  review_flagged_at: string | null;
  review_flag_reason: string | null;
  review_flagged_by: number | null;
  payment_date: string | null;
  payment_status: string | null;
  payment_method: string | null;
  last_extension_at: string | null;
  extensions_count: string;
  last_overdue_action_at: string | null;
  overdue_actions_count: string;
}
