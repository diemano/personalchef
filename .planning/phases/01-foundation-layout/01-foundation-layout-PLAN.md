---
wave: 1
depends_on: []
files_modified: ["package.json", "tailwind.config.ts", "src/store/useAppStore.ts", "src/components/layout/Header.tsx", "src/components/layout/Footer.tsx", "src/components/layout/BottomSheet.tsx", "src/components/layout/StepTransition.tsx", "src/app/layout.tsx", "src/app/page.tsx"]
autonomous: true
---

# Phase 1: Foundation & Layout Plan

## Goal
Setup project structure, state management, and the core layout shell.

## Verification
- [ ] Next.js app builds successfully (`npm run build`)
- [ ] Zustand store has the mock state and is wired up to the root
- [ ] Shell layout component renders Header, Body, BottomSheet, Footer
- [ ] Layout transitions apply fade in/out correctly.

<must_haves>
- Zustand store with localStorage persistence (`persist` middleware)
- Framer Motion integrated for the fade in/out transition between steps
- The UI Shell components must be implemented matching the "elegant" style requirements from the context.
- BottomSheet hidden if `currentStep < 6`.
</must_haves>

<task>
<description>
Initialize Next.js project with TailwindCSS and install dependencies.
</description>
<read_first>
- `package.json` (if exists)
- `.planning/phases/01-foundation-layout/01-foundation-layout-CONTEXT.md`
</read_first>
<action>
1. If project is empty, run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` non-interactively.
2. Install dependencies: `npm install zustand lucide-react framer-motion clsx tailwind-merge`
3. Configure `tailwind.config.ts` with brand colors based on `prototipos/design-modelo1.png` (using placeholder elegant palette like deep greens/blacks if exact hex isn't provided).
</action>
<acceptance_criteria>
- `package.json` contains `zustand` and `framer-motion`.
- `tailwind.config.ts` is configured with extended theme colors.
</acceptance_criteria>
</task>

<task>
<description>
Create Zustand Global Store with localStorage persistence.
</description>
<read_first>
- `src/store/useAppStore.ts`
</read_first>
<action>
1. Create `src/store/useAppStore.ts`.
2. Define `AppState` interface with `currentStep: number` (initial: 1), `guests: number` (initial: 10), and `totalCost: number` (initial: 0).
3. Configure `persist` middleware from Zustand to save to `localStorage` with name `chef-medeiros-storage`.
4. Export the hook `useAppStore`.
</action>
<acceptance_criteria>
- `src/store/useAppStore.ts` exists and exports `useAppStore`.
- File contains `persist(` and `'chef-medeiros-storage'`.
</acceptance_criteria>
</task>

<task>
<description>
Implement Shell Layout Components (Header, Footer, BottomSheet).
</description>
<read_first>
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/BottomSheet.tsx`
- `src/components/layout/StepTransition.tsx`
</read_first>
<action>
1. Create `src/components/layout/Header.tsx` with a refined, elegant look, containing the logo placeholder and a progress bar based on `currentStep`.
2. Create `src/components/layout/Footer.tsx` with 'Voltar' and 'Continuar' buttons.
3. Create `src/components/layout/BottomSheet.tsx` that receives or reads `totalCost` and `currentStep`. Add conditional rendering: `if (currentStep < 6) return null;`. Otherwise, display the total.
4. Create `src/components/layout/StepTransition.tsx` using `framer-motion` `<AnimatePresence>` and `<motion.div>` to implement fade-in/fade-out transitions for its children based on a generic step key prop.
</action>
<acceptance_criteria>
- `Header.tsx` contains progress bar logic.
- `BottomSheet.tsx` contains `if (currentStep < 6) return null;`.
- `StepTransition.tsx` contains `motion.div` with `opacity` animation properties.
</acceptance_criteria>
</task>

<task>
<description>
Assemble Main Application Shell in layout.tsx and page.tsx.
</description>
<read_first>
- `src/app/layout.tsx`
- `src/app/page.tsx`
</read_first>
<action>
1. Update `src/app/layout.tsx` to set an elegant background color and standard typography.
2. Update `src/app/page.tsx` to compose the `Header`, `StepTransition` (wrapping a placeholder step body), `BottomSheet`, and `Footer`.
</action>
<acceptance_criteria>
- `src/app/page.tsx` imports and renders `Header`, `BottomSheet`, and `Footer`.
- Application runs without errors.
</acceptance_criteria>
</task>
