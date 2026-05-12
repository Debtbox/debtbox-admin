# Merchant Receivables Frontend Contract

This document summarizes the receivables/outstanding changes for admin and merchant frontends.

## Concept

Receivables represent Debtbox fees owed by a merchant, currently created from confirmed cash payments. For cash payments, the merchant receives the full cash amount from the customer, and Debtbox records the owed fee as a receivable.

Outstanding totals only include receivables where:

- `status` is `OPEN` or `PARTIALLY_SETTLED`
- `amountOutstandingHalala > 0`

All money values are in halala unless explicitly stated otherwise.

## Admin Merchant APIs

### `GET /admin/merchants?page=0&limit=10`

Each merchant row now includes:

```json
{
  "outstandingReceivablesHalala": 2500,
  "outstandingReceivablesDebtsCount": 1
}
```

### `GET /admin/merchants/:id`

Merchant detail now includes the same fields:

```json
{
  "outstandingReceivablesHalala": 5000,
  "outstandingReceivablesDebtsCount": 2
}
```

## Admin Receivables Module

RBAC uses existing payment permissions:

- list: `payment:list`
- detail: `payment:read`
- settle: `payment:process`

### `GET /admin/receivables`

Query params:

```ts
page?: number
limit?: number
merchantId?: number
status?: 'OPEN' | 'PARTIALLY_SETTLED' | 'SETTLED' | comma-separated statuses
```

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "amountTotalHalala": 2500,
      "amountOutstandingHalala": 2500,
      "status": "OPEN",
      "createdAt": "2026-05-12T10:00:00.000Z",
      "settledAt": null,
      "merchant": {
        "id": 11,
        "nameAr": "اسم التاجر",
        "nameEn": "Merchant Name"
      },
      "business": {
        "id": 4,
        "nameAr": "اسم النشاط",
        "nameEn": "Business Name"
      },
      "debt": {
        "id": 2,
        "title": "Debt title",
        "amount": "100.00",
        "status": "paid",
        "dueDate": "2026-05-20T00:00:00.000Z",
        "customer": {
          "id": 7,
          "nameAr": "اسم العميل",
          "nameEn": "Customer Name"
        }
      }
    }
  ],
  "total": 1,
  "page": 0,
  "limit": 20
}
```

### `GET /admin/receivables/:id`

Same shape as list item, plus `allocations`:

```json
{
  "id": "uuid",
  "amountTotalHalala": 2500,
  "amountOutstandingHalala": 0,
  "status": "SETTLED",
  "allocations": [
    {
      "id": "uuid",
      "amountAppliedHalala": 2500,
      "appliedAt": "2026-05-12T11:00:00.000Z",
      "createdBy": "admin:3",
      "payoutId": null,
      "payoutStatus": null
    }
  ]
}
```

If `payoutId` is present, the receivable was offset through a payout. If `payoutId` is `null`, it was settled directly from the receivables module.

### `POST /admin/receivables/:id/settle`

Body:

```json
{
  "amountHalala": 2500,
  "externalReference": "BANK-TRX-1234",
  "settlementNote": "Collected by bank transfer."
}
```

Rules:

- `amountHalala` must be greater than `0`.
- `amountHalala` cannot exceed current `amountOutstandingHalala`.
- Already settled receivables cannot be settled again.
- Full settlement sets status to `SETTLED`.
- Partial settlement sets status to `PARTIALLY_SETTLED`.

Response:

Returns the updated `GET /admin/receivables/:id` detail shape.

## Merchant APIs

### `GET /merchant/me`

Merchant profile now includes:

```json
{
  "outstandingReceivablesHalala": 2500,
  "outstandingReceivablesDebtsCount": 1
}
```

### `GET /merchant/receivables`

Query params:

```ts
page?: number
limit?: number
status?: 'OPEN' | 'PARTIALLY_SETTLED' | 'SETTLED' | comma-separated statuses
```

Default status filter:

```ts
['OPEN', 'PARTIALLY_SETTLED']
```

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "amountTotalHalala": 2500,
      "amountOutstandingHalala": 2500,
      "status": "OPEN",
      "createdAt": "2026-05-12T10:00:00.000Z",
      "settledAt": null,
      "business": {
        "id": 4,
        "nameAr": "اسم النشاط",
        "nameEn": "Business Name"
      },
      "debt": {
        "id": 2,
        "title": "Debt title",
        "amount": "100.00",
        "status": "paid",
        "dueDate": "2026-05-20T00:00:00.000Z",
        "customer": {
          "id": 7,
          "nameAr": "اسم العميل",
          "nameEn": "Customer Name"
        }
      }
    }
  ],
  "total": 1,
  "page": 0,
  "limit": 20
}
```

## UI Notes

- Show halala values as SAR by dividing by `100`.
- Use `amountOutstandingHalala` as the actionable unpaid amount.
- Use `amountTotalHalala` as the original receivable amount.
- Admin settlement should disable submitting amounts above outstanding.
- Merchant screens are read-only for receivables.
