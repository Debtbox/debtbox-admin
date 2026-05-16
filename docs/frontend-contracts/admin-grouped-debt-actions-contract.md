# Admin Grouped Debt Actions Contract

This document describes the admin-side grouped debt behavior after the grouped-debt update.

## Contract Summary

- A grouped debt is treated as one logical admin item.
- Admin actions applied to one debt id must fan out to every debt in the same group.
- Read responses keep the flat fields and add a `groupedDebt` object.
- Related admin actions return grouped metadata in the response and audit trail.

## Shared Response Shape

Admin debt, payment, payout, and receivable responses may include:

- `groupedDebt.groupId`
- `groupedDebt.isGrouped`
- `groupedDebt.debtIds`
- `groupedDebt.debtsCount`
- `groupedDebt.groupAmount`
- `groupedDebt.groupStatus`
- `groupedDebt.debts[]`

### Example grouped debt object

```json
{
  "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
  "isGrouped": true,
  "debtIds": ["6", "10"],
  "debtsCount": 2,
  "groupAmount": 3100,
  "groupStatus": "active",
  "debts": [
    {
      "debtId": "6",
      "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
      "amount": 3000,
      "status": "active",
      "title": "لابتوب جديد",
      "dueDate": "2026-08-31T23:59:59.999Z",
      "isGrouped": false,
      "debtIds": ["6"],
      "debtsCount": 1,
      "groupAmount": 3000,
      "groupStatus": "active"
    },
    {
      "debtId": "10",
      "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
      "amount": 100,
      "status": "active",
      "title": "New Items",
      "dueDate": "2026-08-31T23:59:59.999Z",
      "isGrouped": false,
      "debtIds": ["10"],
      "debtsCount": 1,
      "groupAmount": 100,
      "groupStatus": "active"
    }
  ]
}
```

## 1) List grouped debts

### Request

```bash
curl -X GET "https://api.example.com/v0.0.1/api/admin/debts?page=0&limit=20&merchantId=4" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Accept: application/json"
```

### Response

```json
{
  "success": true,
  "message": "Operation done successfully",
  "data": {
    "data": [
      {
        "id": 6,
        "groupid": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
        "title": "لابتوب جديد",
        "amount": "3100.00",
        "status": "active",
        "due_date": "2026-08-31T23:59:59.999Z",
        "groupedDebt": {
          "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
          "isGrouped": true,
          "debtIds": ["6", "10"],
          "debtsCount": 2,
          "groupAmount": 3100,
          "groupStatus": "active",
          "debts": []
        }
      }
    ],
    "total": 1,
    "page": 0,
    "limit": 20
  }
}
```

## 2) Debt detail

### Request

```bash
curl -X GET "https://api.example.com/v0.0.1/api/admin/debts/6" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Accept: application/json"
```

### Response

```json
{
  "success": true,
  "message": "Operation done successfully",
  "data": {
    "id": 6,
    "title": "لابتوب جديد",
    "amount": "3000.00",
    "status": "active",
    "due_date": "2026-08-31T23:59:59.999Z",
    "groupedDebt": {
      "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
      "isGrouped": true,
      "debtIds": ["6", "10"],
      "debtsCount": 2,
      "groupAmount": 3100,
      "groupStatus": "active",
      "debts": [
        {
          "debtId": "6",
          "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
          "amount": 3000,
          "status": "active",
          "title": "لابتوب جديد",
          "dueDate": "2026-08-31T23:59:59.999Z",
          "isGrouped": false,
          "debtIds": ["6"],
          "debtsCount": 1,
          "groupAmount": 3000,
          "groupStatus": "active"
        }
      ]
    }
  }
}
```

## 3) Flag review

### Request

```bash
curl -X POST "https://api.example.com/v0.0.1/api/admin/debts/6/actions/flag-review" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Suspicious group pattern"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Operation done successfully",
  "data": {
    "debt": {
      "id": 6,
      "status": "active"
    },
    "groupedDebt": {
      "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
      "isGrouped": true,
      "debtIds": ["6", "10"],
      "debtsCount": 2,
      "groupAmount": 3100,
      "groupStatus": "active",
      "debts": []
    },
    "affectedCount": 2
  }
}
```

## 4) Cancel debt

### Request

```bash
curl -X POST "https://api.example.com/v0.0.1/api/admin/debts/6/actions/cancel" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Duplicate debt created"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Operation done successfully",
  "data": {
    "debt": {
      "id": 6,
      "status": "cancelled"
    },
    "groupedDebt": {
      "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
      "isGrouped": true,
      "debtIds": ["6", "10"],
      "debtsCount": 2,
      "groupAmount": 3100,
      "groupStatus": "cancelled",
      "debts": []
    },
    "affectedCount": 2
  }
}
```

## 5) Extend due date

### Request

```bash
curl -X POST "https://api.example.com/v0.0.1/api/admin/debts/6/actions/extend-due-date" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "newDueDate": "2026-09-15T00:00:00.000Z",
    "reason": "Merchant approved extension"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Operation done successfully",
  "data": {
    "debt": {
      "id": 6,
      "status": "active"
    },
    "groupedDebt": {
      "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
      "isGrouped": true,
      "debtIds": ["6", "10"],
      "debtsCount": 2,
      "groupAmount": 3100,
      "groupStatus": "active",
      "debts": []
    },
    "affectedCount": 2
  }
}
```

## 6) Resend notifications

### Request

```bash
curl -X POST "https://api.example.com/v0.0.1/api/admin/debts/6/actions/resend-notifications" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Accept: application/json"
```

### Response

```json
{
  "success": true,
  "message": "Operation done successfully",
  "data": {
    "debt": {
      "id": 6,
      "status": "active"
    },
    "groupedDebt": {
      "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
      "isGrouped": true,
      "debtIds": ["6", "10"],
      "debtsCount": 2,
      "groupAmount": 3100,
      "groupStatus": "active",
      "debts": []
    },
    "affectedCount": 2,
    "notifications": [
      { "debtId": 6, "notificationId": "n-1", "sent": true },
      { "debtId": 10, "notificationId": "n-2", "sent": true }
    ],
    "sentCount": 2
  }
}
```

## 7) Settle receivable

### Request

```bash
curl -X POST "https://api.example.com/v0.0.1/api/admin/receivables/receivable-uuid-1/settle" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amountHalala": 29100,
    "externalReference": "BANK-TRX-1234",
    "settlementNote": "Paid by bank transfer"
  }'
```

### Response

```json
{
  "success": true,
  "message": "Operation done successfully",
  "data": {
    "receivable": {
      "id": "receivable-uuid-1",
      "amountTotalHalala": 3000,
      "amountOutstandingHalala": 0,
      "status": "SETTLED"
    },
    "groupReceivables": [],
    "groupId": "601f76d8-481b-4cbe-aa83-7649e6d84df5",
    "debtIds": ["6", "10"],
    "receivableIds": ["receivable-uuid-1", "receivable-uuid-2"],
    "totalOutstanding": 29100,
    "amountHalala": 29100,
    "isGrouped": true,
    "previousState": []
  }
}
```

## 8) Recovery rebuilds

### Receivables rebuild

```bash
curl -X POST "https://api.example.com/v0.0.1/api/admin/recovery/receivables/rebuild" \
  -H "Authorization: Bearer <superadmin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "debtId": 6,
    "options": {
      "dryRun": true
    }
  }'
```

### Debt fee snapshot rebuild

```bash
curl -X POST "https://api.example.com/v0.0.1/api/admin/recovery/debts/fee-snapshot/rebuild" \
  -H "Authorization: Bearer <superadmin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "debtId": 6,
    "options": {
      "dryRun": true
    }
  }'
```

### Response

```json
{
  "success": true,
  "message": "Operation done successfully",
  "data": {
    "dryRun": true,
    "changed": 2,
    "items": [
      { "debtId": 6, "action": "would_update", "changed": true },
      { "debtId": 10, "action": "would_update", "changed": true }
    ]
  }
}
```

## Frontend Rules

- Treat grouped debt rows as a single visual item.
- Use `groupedDebt.debtIds` for badges, filters, and action labels.
- Use `groupedDebt.debts` for the nested breakdown.
- When an admin action succeeds, refresh the full debt group, not only the anchor debt row.
- For receivable settlement, require the full grouped outstanding amount when the item belongs to a group.

