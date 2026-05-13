---
wave: 1
depends_on: ["03-dados-do-evento"]
files_modified: ["src/store/useAppStore.ts", "src/app/page.tsx", "src/components/steps/Step4_1_Kitchen.tsx", "src/components/steps/Step4_2_Decoration.tsx", "src/components/steps/Step4_3_Waiters.tsx"]
autonomous: true
---

# Phase 4: Viabilidade e Adicionais Plan

## Goal
Implement feasibility and additional-cost screens for kitchen structure, decoration, and waiters.

## Verification
- [x] Kitchen checklist requires at least one selected structure item.
- [x] Decoration toggle updates the additional total by R$ 250.
- [x] Waiters are calculated automatically from guest count at R$ 120 per waiter.
- [x] Application builds successfully with `npm run build`.

