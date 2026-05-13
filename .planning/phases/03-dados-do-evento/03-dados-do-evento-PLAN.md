---
wave: 1
depends_on: ["02-lead-capture-concept-steps-1-2"]
files_modified: ["src/store/useAppStore.ts", "src/app/page.tsx", "src/components/steps/Step3_1_DateShift.tsx", "src/components/steps/Step3_2_Local.tsx", "src/components/steps/Step3_3_Convidados.tsx", "src/components/steps/Step3_4_Ocasion.tsx"]
autonomous: true
---

# Phase 3: Dados do Evento Plan

## Goal
Collect event date, shift, location, guest count, and occasion in the conversational flow.

## Verification
- [x] Calendar blocks past dates and requires a selected shift.
- [x] Location form validates city, neighborhood, and location type.
- [x] Guest counter enforces a minimum of 10.
- [x] Occasion screen supports preset tags and free text.
- [x] Application builds successfully with `npm run build`.

