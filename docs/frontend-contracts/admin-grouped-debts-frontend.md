# Admin Portal: Grouped Debts Update

## What Changed

- Debt groups are now modeled at the customer/merchant level.
- Admin responses now expose grouped debt metadata without removing the old flat fields.
- Payment and payout views should treat a grouped debt as **one row/item** and show the child debts inside it.

## Backend Response Shape

The admin backend now adds a `groupedDebt` object to debt, payment, and payout responses.

Expected grouped fields:

- `groupedDebt.groupId`
- `groupedDebt.isGrouped`
- `groupedDebt.debtIds`
- `groupedDebt.debtsCount`
- `groupedDebt.groupAmount`
- `groupedDebt.groupStatus`
- `groupedDebt.debts[]`

Each child debt in `groupedDebt.debts[]` keeps the same grouped metadata and represents one underlying debt.

## Frontend Behavior

### Debt Lists

- Keep the current list layout.
- If `groupedDebt.isGrouped` is `true`, show the row as a grouped debt.
- Render the child debts in an expandable section, drawer, or nested table.

### Payment / Payout Lists

- Render grouped payments/payout items as **one item**.
- Show a clear label such as:
  - `Grouped debt`
  - `Includes 3 child debts`
  - `Debt IDs: 12, 13, 14`
- Use `groupedDebt.groupAmount` for the displayed aggregated amount.
- Use `groupedDebt.debts` to render the child debt breakdown.

### Debt Details

- Preserve existing flat fields for compatibility.
- Add a grouped summary panel when `groupedDebt.isGrouped` is `true`.
- Make the child debt list visible for admins so they can inspect the underlying debts without leaving the page.

## Backward Compatibility

- Existing fields are still returned.
- Older frontend code can keep reading the flat debt/payment/payout fields.
- The new `groupedDebt` field is additive and can be adopted incrementally.

## Suggested UI Copy

- `Grouped debt`
- `Includes {n} child debts`
- `Child debts`
- `View grouped breakdown`

## Notes for Frontend Implementation

- Do not split grouped payments or payouts into multiple rows.
- Treat grouped records as a single accounting item with a nested breakdown.
- Prefer `groupedDebt.debtIds` for concise badges and `groupedDebt.debts` for detailed expansion.
