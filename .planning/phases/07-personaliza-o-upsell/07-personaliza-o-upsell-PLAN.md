# Phase 7: Personalização (Upsell) - Plan

**Status:** Complete by reconciliation
**Implementation commit:** `cf20b2a`

## Scope

- Correct the base budget calculation so `guests * R$ 220` is included before add-ons.
- Add upsell options for protein upgrade, duplicate dish, and additional time.
- Add conditional category selection when duplicate dish is selected.
- Keep navigation coherent when the conditional screen is skipped.

## Verification

- `npm run build`
- `npm run lint`

