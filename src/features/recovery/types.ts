export type RecoveryAction =
  | "would_update"
  | "would_create"
  | "no_change"
  | "not_found"
  | "skipped_existing_payout_item"
  | "skipped_existing_receivable"
  | "skipped_invalid_state"
  | "created_payout_and_item"
  | "created_item_for_existing_payout"
  | "updated";

export interface FieldDiff {
  field: string;
  current: unknown;
  expected: unknown;
  changed: boolean;
}

export interface RecoveryResultItem {
  action: RecoveryAction;
  changed: boolean;
  diffs?: FieldDiff[];
  [key: string]: unknown;
}

export interface RecoverySummary {
  total: number;
  changed: number;
  unchanged: number;
  notFound: number;
  errors: number;
  dryRun: boolean;
  items: RecoveryResultItem[];
}

export interface ReconcileSubReport {
  changed: number;
  items: RecoveryResultItem[];
}

export interface ReconcileReport {
  dryRun: boolean;
  report: {
    payments: ReconcileSubReport;
    payouts: ReconcileSubReport;
    receivables: ReconcileSubReport;
  };
}

export interface PaymentInspectResult {
  payment: Record<string, unknown>;
  expected: Record<string, unknown>;
  differences: FieldDiff[];
  payoutLinkage: unknown[];
  receivableLinkage: unknown | null;
}

export interface DebtFeePreviewDeductions {
  debtboxFeeHalala: number;
  providerFeeBaseHalala: number;
  providerFeeVatHalala: number;
  providerFeeTotalHalala: number;
  providerFeeType: string;
  providerFeeIncludedInDebtboxFee: boolean;
  instantPayoutFeeHalala: number;
  totalDeductionsHalala: number;
  expectedMerchantNetAmountHalala: number;
}

export interface DebtFeePreviewStoredSnapshot {
  expectedDebtboxFeeHalala: number;
  expectedInstantPayoutFeeHalala: number;
  expectedTotalDeductionsHalala: number;
  expectedMerchantNetAmountHalala: number;
  expectedProviderFeeBaseHalala: number;
  expectedProviderFeeVatHalala: number;
  expectedProviderFeeTotalHalala: number;
  expectedProviderFeeType: string;
}

export interface DebtFeePreview {
  debtId: number;
  debtTotalHalala: number;
  feeSnapshotAt: string;
  merchantVisibleDeductions: DebtFeePreviewDeductions;
  storedSnapshot: DebtFeePreviewStoredSnapshot;
}
