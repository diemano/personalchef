---
wave: 1
depends_on: []
files_modified: ["src/store/useAppStore.ts", "src/hooks/useAutosave.ts", "src/components/features/lead/LeadCaptureForm.tsx", "src/components/features/concept/ConceptCards.tsx", "src/app/page.tsx", "package.json"]
autonomous: true
---

# Phase 2: Lead Capture & Concept Plan

## Goal
Implement the initial data collection and service presentation steps.

## Verification
- [ ] Application builds without errors (`npm run build`).
- [ ] Submitting the Lead Capture form updates the global store and advances to Step 2.
- [ ] The "Continuar" button is disabled if the name is < 2 words or phone is invalid.
- [ ] Changing form values triggers a `console.log` from the autosave hook after a 1s delay.
- [ ] Step 2 displays the menu concept cards statically.

<must_haves>
- Rigorous validation with `zod` and `react-hook-form`.
- Autosave logic using a custom hook with debounce.
</must_haves>

<task>
<description>
Install form handling and validation dependencies.
</description>
<read_first>
- `package.json`
</read_first>
<action>
1. Run `npm install react-hook-form @hookform/resolvers zod react-input-mask` (or `use-mask-input`) in the terminal. Wait, actually we can use `react-input-mask-next` or similar, or just a simple regex formatter on `onChange` to avoid dependency issues in React 19. Let's install `react-hook-form @hookform/resolvers zod`. For masks, we can use a custom utility function or `input-core`. Let's stick to `react-hook-form @hookform/resolvers zod`.
</action>
<acceptance_criteria>
- `package.json` contains `react-hook-form` and `zod`.
</acceptance_criteria>
</task>

<task>
<description>
Update global store to include lead data.
</description>
<read_first>
- `src/store/useAppStore.ts`
</read_first>
<action>
1. Add `lead: { name: string; phone: string }` to the `AppState`.
2. Add `setLead: (lead: { name: string; phone: string }) => void` to `AppState` actions.
3. Provide initial state for `lead` as `{ name: '', phone: '' }`.
</action>
<acceptance_criteria>
- `src/store/useAppStore.ts` includes `lead` state and `setLead` action.
</acceptance_criteria>
</task>

<task>
<description>
Create custom Autosave hook.
</description>
<read_first>
- `src/hooks/useAutosave.ts`
</read_first>
<action>
1. Create `src/hooks/useAutosave.ts`.
2. Implement a `useAutosave` hook that accepts the current `AppState` (or specific fields).
3. Use a `useEffect` with a `setTimeout` of 1000ms.
4. When the timeout resolves, call a mock async function `saveLeadToAPI` that outputs `console.log('Autosave executado:', data)`.
</action>
<acceptance_criteria>
- `src/hooks/useAutosave.ts` exports `useAutosave`.
- The file contains a debounce mechanism (`setTimeout`/`clearTimeout`) of 1000ms.
</acceptance_criteria>
</task>

<task>
<description>
Implement Step 1: Lead Capture Form.
</description>
<read_first>
- `src/components/features/lead/LeadCaptureForm.tsx`
- `.planning/phases/02-lead-capture-concept-steps-1-2/02-lead-capture-concept-steps-1-2-CONTEXT.md`
</read_first>
<action>
1. Create `src/components/features/lead/LeadCaptureForm.tsx`.
2. Define a `zod` schema: `name` must have at least 2 words. `phone` must match a regex for `(XX) XXXXX-XXXX` or have exactly 11 digits. `lgpd` must be `true`.
3. Setup `useForm` with `@hookform/resolvers/zod`.
4. Render inputs for Name, Phone (with manual `(99) 99999-9999` mask formatting applied on `onChange`), and a checkbox for LGPD consent.
5. Use `useEffect` to watch the form values (`watch()`) and update the `useAppStore` lead data dynamically.
6. Display validation error messages below inputs.
7. Return a boolean or state to the parent `page.tsx` indicating if the form `isValid`, so the Footer's "Continuar" button can be disabled.
</action>
<acceptance_criteria>
- `LeadCaptureForm.tsx` uses `zod` for validation.
- Schema explicitly requires 2 words for the name.
- Input onChange correctly applies the `(99) 99999-9999` mask.
</acceptance_criteria>
</task>

<task>
<description>
Implement Step 2: Concept Cards.
</description>
<read_first>
- `src/components/features/concept/ConceptCards.tsx`
</read_first>
<action>
1. Create `src/components/features/concept/ConceptCards.tsx`.
2. Build a static, elegant grid layout displaying the "4-Course Menu" concept (Entrada Fria, Entrada Quente, Prato Principal, Sobremesa).
3. Use `lucide-react` icons (e.g., `Utensils`, `ChefHat`) to highlight included services.
4. Include a clean rules section highlighting the pricing dynamics (R$ 120/garçom, R$ 250 louça).
</action>
<acceptance_criteria>
- `ConceptCards.tsx` exists and renders a static grid of the 4 courses.
- File imports icons from `lucide-react`.
</acceptance_criteria>
</task>

<task>
<description>
Integrate Steps 1 and 2 into the Main Shell.
</description>
<read_first>
- `src/app/page.tsx`
- `src/components/layout/Footer.tsx`
</read_first>
<action>
1. In `src/app/page.tsx`, import `useAutosave` and invoke it with the `useAppStore` state.
2. Render `LeadCaptureForm` when `currentStep === 1`.
3. Render `ConceptCards` when `currentStep === 2`.
4. Pass `isStepValid` state down to `Footer` or track it in `useAppStore` so `Footer` can disable the "Continuar" button on step 1 if the form is invalid. (Update `useAppStore` to include `isNextEnabled: boolean` and `setIsNextEnabled: (val: boolean) => void`).
</action>
<acceptance_criteria>
- `src/app/page.tsx` conditionally renders step 1 and step 2 components based on `currentStep`.
- The "Continuar" button respects `isNextEnabled` state on step 1.
</acceptance_criteria>
</task>
