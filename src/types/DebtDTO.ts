import type { GroupedDebt, GroupedDebtChildDTO } from "./GroupedDebtDTO";

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
  // Grouped debt fields returned flat by the API
  isGrouped?: boolean;
  groupId?: string | null;
  debtIds?: (number | string)[];
  debtsCount?: number;
  groupAmount?: string | number;
  groupStatus?: string;
  debts?: GroupedDebtChildDTO[];
}

export interface DebtDetailsDTO extends DebtDTO {
  createwithsanad: boolean;
  updated_at: string;
  review_flagged_at: string | null;
  review_flag_reason: string | null;
  review_flagged_by: number | null;
  // Fee snapshot stored on debt
  fee_snapshot_at: string | null;
  expected_debtbox_fee_halala: number | null;
  expected_instant_payout_fee_halala: number | null;
  expected_total_deductions_halala: number | null;
  expected_merchant_net_amount_halala: number | null;
  expected_provider_fee_base_halala: number | null;
  expected_provider_fee_vat_halala: number | null;
  expected_provider_fee_total_halala: number | null;
  expected_provider_fee_type: string | null;
  // Actual payment data
  payment_date: string | null;
  payment_id: number | null;
  payment_status: string | null;
  payment_method_type: string | null;
  payment_method: string | null;
  payout_method: string | null;
  payment_total_amount_halala: number | null;
  payment_paid_amount_halala: number | null;
  payment_remaining_amount_halala: number | null;
  debtbox_fee_halala: number | null;
  provider_fee_total_halala: number | null;
  provider_fee_base_halala: number | null;
  provider_fee_vat_halala: number | null;
  provider_fee_type_applied: string | null;
  provider_fee_rule_source: string | null;
  merchant_net_amount_halala: number | null;
  payment_brand: string | null;
  card_country: string | null;
  card_issuer_country: string | null;
  // Receivable / payout tracking
  receivable_id: number | null;
  receivable_amount_total_halala: number | null;
  receivable_amount_outstanding_halala: number | null;
  receivable_status: string | null;
  merchant_outstanding_receivable_halala: string;
  // Payment extras
  payment_currency: string | null;
  // Activity
  last_extension_at: string | null;
  extensions_count: string;
  last_overdue_action_at: string | null;
  overdue_actions_count: string;
  // Nested grouped debt — only present on the single-debt details endpoint
  groupedDebt?: GroupedDebt | null;
}
