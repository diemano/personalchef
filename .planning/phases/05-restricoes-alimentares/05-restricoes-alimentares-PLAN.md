---
wave: 1
depends_on: ["04-viabilidade-e-adicionais"]
files_modified: ["src/store/useAppStore.ts", "src/app/page.tsx", "src/components/steps/Step5_1_Dietary.tsx"]
autonomous: true
---

# Phase 5: Restricoes Alimentares Plan

## Goal
Collect whether the event has dietary restrictions and capture selected tags plus optional notes.

## Verification
- [x] User can choose yes or no for dietary restrictions.
- [x] Choosing yes displays restriction tags and a free-text textarea.
- [x] Choosing no clears stored dietary details.
- [x] Application builds successfully with `npm run build`.

