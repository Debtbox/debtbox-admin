# Admin Recovery / Reconciliation Frontend Contract

Base URL: `{{baseUrl}}/v0.0.1/api`

Auth: `Authorization: Bearer {{adminToken}}`

All money fields ending in `Halala` are integer halala.

## Business Overview

Debtbox fee is fixed `25 SAR` (`2500` halala) and includes provider fees/VAT. Instant payout fee is separate. Provider fee fields are internal/accounting only and should not be shown as an extra merchant deduction.

Payouts are ledger records, not real bank transfers. Accountants settle outside Debtbox, then mark the payout settled with proof. Recovery APIs are admin-only repair tools for missing fee snapshots, payment fee fields, payout ledger rows, cash receivables, and reconciliation.

## Important Concepts

- Debt fee snapshot: expected fee/net fields stored on a debt.
- Payment actual fees: fee/net/provider metadata stored on `payments`.
- Payout: ledger amount owed to merchant.
- Payout item: link from one payment to one payout.
- Merchant receivable: Debtbox fee owed by merchant for confirmed cash payments.
- Receivable offset/allocation: receivable applied against a payout.
- Manual settlement: external transfer recorded in Debtbox.
- Dry run: returns `would_*` changes without writes.
- Force overwrite: Not found in backend DTOs.
- Idempotency: existing rows usually return `no_change`, `skipped_existing_payout_item`, or `skipped_existing_receivable`.

## Debt Fee Snapshot / Preview

### Get Debt Fee Preview

- Method: `GET`
- Path: `/admin/debts/:id/fee-preview`
- Permission: `debt:read`
- Purpose: inspect expected debt fee snapshot/preview.
- Params: `id={{debtId}}`

```bash
curl -X GET "{{baseUrl}}/v0.0.1/api/admin/debts/{{debtId}}/fee-preview" \
  -H "Authorization: Bearer {{adminToken}}"
```

Response shape:

```json
{
  "success": true,
  "data": {
    "debtId": 55,
    "expectedDebtboxFeeHalala": 2500,
    "expectedInstantPayoutFeeHalala": 510,
    "expectedTotalDeductionsHalala": 3010,
    "expectedMerchantNetAmountHalala": 96990,
    "feeSnapshotAt": "2026-04-01T00:00:00.000Z"
  }
}
```

### Rebuild Debt Fee Snapshots

- Method: `POST`
- Path: `/admin/recovery/debts/fee-snapshot/rebuild`
- Permission: `debt:update` plus `SuperAdminGuard`
- Purpose: rebuild missing/incorrect debt expected fee snapshots.
- Body: `debtId`, `merchantId`, `from`, `to`, `options.dryRun`
- Edge cases: at least one scope is required; unchanged debts return `no_change`.

```bash
curl -X POST "{{baseUrl}}/v0.0.1/api/admin/recovery/debts/fee-snapshot/rebuild" \
  -H "Authorization: Bearer {{adminToken}}" \
  -H "Content-Type: application/json" \
  -d '{"debtId":{{debtId}},"options":{"dryRun":true}}'
```

```json
{
  "merchantId": {{merchantId}},
  "from": "{{fromDate}}",
  "to": "{{toDate}}",
  "options": { "dryRun": true }
}
```

Response shape:

```json
{
  "success": true,
  "data": {
    "total": 1,
    "changed": 1,
    "unchanged": 0,
    "notFound": 0,
    "errors": 0,
    "dryRun": true,
    "items": [{ "debtId": 55, "action": "would_update", "changed": true, "diffs": [] }]
  }
}
```

Merchant debt fee preview API: Not found in backend.

## Payment Recovery / Inspection

### List Payments

- Method: `GET`
- Path: `/admin/payments`
- Permission: `payment:list`
- Query: `page`, `limit`, `merchantId`

```bash
curl -X GET "{{baseUrl}}/v0.0.1/api/admin/payments?page=0&limit=20&merchantId={{merchantId}}" \
  -H "Authorization: Bearer {{adminToken}}"
```

### Get Payment Detail

- Method: `GET`
- Path: `/admin/payments/:id`
- Permission: `payment:read`

```bash
curl -X GET "{{baseUrl}}/v0.0.1/api/admin/payments/{{paymentId}}" \
  -H "Authorization: Bearer {{adminToken}}"
```

Payment response shape:

```json
{
  "success": true,
  "data": {
    "id": 123,
    "status": "succeeded",
    "paymentMethod": "ONLINE",
    "payoutMethod": "instant",
    "grossAmountHalala": 100000,
    "debtboxFeeHalala": 2500,
    "providerFeeTotalHalala": 2760,
    "providerFeeIncludedInDebtboxFee": true,
    "instantPayoutFeesHalala": 510,
    "merchantVisibleTotalDeductionsHalala": 3010,
    "merchantNetAmountHalala": 96990,
    "payouts": [{ "payoutItemId": 1, "payoutId": 77, "payoutStatus": "READY" }]
  }
}
```

### Inspect Payment Recovery State

- Method: `GET`
- Path: `/admin/recovery/payment/:id/inspect`
- Permission: `payment:read` plus `SuperAdminGuard`
- Purpose: compare stored payment against expected fees/state and ledger links.

```bash
curl -X GET "{{baseUrl}}/v0.0.1/api/admin/recovery/payment/{{paymentId}}/inspect" \
  -H "Authorization: Bearer {{adminToken}}"
```

Response shape:

```json
{
  "success": true,
  "data": {
    "payment": {},
    "expected": {},
    "differences": [{ "field": "merchantNetAmount", "current": 0, "expected": 96990, "changed": true }],
    "payoutLinkage": [],
    "receivableLinkage": null
  }
}
```

### Recompute Payment

- Method: `POST`
- Path: `/admin/recovery/payment/recompute`
- Permission: `payment:process` plus `SuperAdminGuard`
- Body: `paymentId` or `paymentIds`, `options.recomputeFees`, `options.fixPaidFields`, `options.dryRun`
- Edge cases: missing IDs returns `400`; missing payment returns item action `not_found`.

```bash
curl -X POST "{{baseUrl}}/v0.0.1/api/admin/recovery/payment/recompute" \
  -H "Authorization: Bearer {{adminToken}}" \
  -H "Content-Type: application/json" \
  -d '{"paymentId":{{paymentId}},"options":{"recomputeFees":true,"fixPaidFields":true,"dryRun":true}}'
```

Response shape:

```json
{
  "success": true,
  "data": {
    "total": 1,
    "changed": 1,
    "unchanged": 0,
    "notFound": 0,
    "errors": 0,
    "dryRun": true,
    "items": [{ "paymentId": 123, "action": "would_update", "changed": true, "diffs": [] }]
  }
}
```

## Payout Ledger / Settlement

### List Payouts

- Method: `GET`
- Path: `/admin/payouts`
- Permission: `payment:list`
- Query: `page`, `limit`, `merchantId`, `status`

```bash
curl -X GET "{{baseUrl}}/v0.0.1/api/admin/payouts?page=0&limit=20&merchantId={{merchantId}}" \
  -H "Authorization: Bearer {{adminToken}}"
```

### Get Payout Detail

- Method: `GET`
- Path: `/admin/payouts/:id`
- Permission: `payment:read`

```bash
curl -X GET "{{baseUrl}}/v0.0.1/api/admin/payouts/{{payoutId}}" \
  -H "Authorization: Bearer {{adminToken}}"
```

Payout response shape:

```json
{
  "success": true,
  "data": {
    "id": 77,
    "status": "READY",
    "payoutMethod": "instant",
    "merchantNetAmountHalala": 96990,
    "manualSettlement": {
      "settledAt": null,
      "settledByUserId": null,
      "amountTransferredHalala": null,
      "externalTransferReference": null,
      "settlementNote": null,
      "proofReference": null,
      "proofPreviewUrl": null,
      "proofDownloadUrl": null
    },
    "items": [],
    "receivableOffsets": []
  }
}
```

### Mark Payout Settled

- Method: `POST`
- Path: `/admin/payouts/:id/mark-settled`
- Permission: `payment:process`
- Content-Type: `multipart/form-data`
- Required: `amountTransferredHalala`, `externalTransferReference`, `proofReference` file.
- Edge cases: proof is required; amount cannot exceed payout net; already `SETTLED` or `PAID` is rejected.

```bash
curl -X POST "{{baseUrl}}/v0.0.1/api/admin/payouts/{{payoutId}}/mark-settled" \
  -H "Authorization: Bearer {{adminToken}}" \
  -F "amountTransferredHalala=96990" \
  -F "externalTransferReference=BANK-TRX-12345" \
  -F "settlementNote=Settled manually by accountant." \
  -F "proofReference=@/path/to/proof.pdf"
```

Sample form fields:

```json
{
  "amountTransferredHalala": 96990,
  "externalTransferReference": "BANK-TRX-12345",
  "settlementNote": "Settled manually by accountant."
}
```

### Rebuild Payout Ledger

- Method: `POST`
- Path: `/admin/recovery/payout/rebuild`
- Permission: `payment:process` plus `SuperAdminGuard`
- Body: `paymentId`, `merchantId`, `from`, `to`, `options.dryRun`, `options.includeInstantOnly`
- Edge cases: existing payout item returns `skipped_existing_payout_item`; invalid state returns `skipped_invalid_state`.

```bash
curl -X POST "{{baseUrl}}/v0.0.1/api/admin/recovery/payout/rebuild" \
  -H "Authorization: Bearer {{adminToken}}" \
  -H "Content-Type: application/json" \
  -d '{"merchantId":{{merchantId}},"from":"{{fromDate}}","to":"{{toDate}}","options":{"dryRun":true,"includeInstantOnly":true}}'
```

Response item examples: `would_create`, `created_payout_and_item`, `created_item_for_existing_payout`, `skipped_existing_payout_item`.

## Receivables / Cash Offsets

### Rebuild Receivables

- Method: `POST`
- Path: `/admin/recovery/receivables/rebuild`
- Permission: `payment:process` plus `SuperAdminGuard`
- Purpose: recreate missing `merchant_receivables` for confirmed cash payments.
- Body: `merchantId`, `debtId`, `from`, `to`, `options.dryRun`
- Edge cases: existing receivable returns `skipped_existing_receivable`.

```bash
curl -X POST "{{baseUrl}}/v0.0.1/api/admin/recovery/receivables/rebuild" \
  -H "Authorization: Bearer {{adminToken}}" \
  -H "Content-Type: application/json" \
  -d '{"debtId":{{debtId}},"options":{"dryRun":true}}'
```

```json
{
  "merchantId": {{merchantId}},
  "from": "{{fromDate}}",
  "to": "{{toDate}}",
  "options": { "dryRun": true }
}
```

Receivable list/detail inspection APIs: Not found in backend.

## Full Reconciliation

### Reconcile

- Method: `POST`
- Path: `/admin/recovery/reconcile`
- Permission: `payment:process` plus `SuperAdminGuard`
- Purpose: run payment recompute, payout rebuild, receivable rebuild, and optionally debt fee snapshots for a merchant/date scope.
- Body: `merchantId`, `from`, `to`, `options.fixPayments`, `fixPayouts`, `fixReceivables`, `fixDebtFeeSnapshots`, `dryRun`

```bash
curl -X POST "{{baseUrl}}/v0.0.1/api/admin/recovery/reconcile" \
  -H "Authorization: Bearer {{adminToken}}" \
  -H "Content-Type: application/json" \
  -d '{"merchantId":{{merchantId}},"from":"{{fromDate}}","to":"{{toDate}}","options":{"fixPayments":true,"fixPayouts":true,"fixReceivables":true,"fixDebtFeeSnapshots":false,"dryRun":true}}'
```

Response shape:

```json
{
  "success": true,
  "data": {
    "dryRun": true,
    "report": {
      "payments": { "changed": 0, "items": [] },
      "payouts": { "changed": 0, "items": [] },
      "receivables": { "changed": 0, "items": [] }
    }
  }
}
```

## Frontend Usage Guidance

- Payment ledger page: use `/admin/payments`, `/admin/payments/:id`, and inspect payment for superadmin repair workflows.
- Payout queue page: use `/admin/payouts`, `/admin/payouts/:id`, and `mark-settled`.
- Debt detail page: use `/admin/debts/:id/fee-preview`.
- Recovery console: show only to superadmin; write APIs also require `payment:process` or `debt:update`.
- Display dry-run diffs from `items[].diffs`; show `would_*` as planned changes.
- Before non-dry-run recovery or payout settlement, show a confirmation with affected counts and amount fields.
- If response is `no_change` or `skipped_existing_*`, show “Nothing to fix” rather than an error.
- `forceOverwrite` controls: hide; no backend option found.

## Missing Gaps

- Force overwrite option: Not found in backend.
- Receivable list/detail APIs: Not found in backend.
- Merchant debt fee preview API: Not found in backend.
- Payout provider/bank transfer execution API: Not found in backend.
- Recovery APIs are not available to accountant/admin despite seeded `payment:process`; `SuperAdminGuard` restricts them to `superadmin`.
