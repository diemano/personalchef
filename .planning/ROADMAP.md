# Roadmap

## Phase 1: Foundation & Layout
**Goal:** Setup project structure, state management, and the core layout shell.
**Requirements:** CORE-01, CORE-02, LAY-01, LAY-02, LAY-03, LAY-04
**Success Criteria:**
1. React/Next.js app runs successfully com Tailwind CSS.
2. Zustand store is initialized for the global state.
3. The main layout is visible with Header, Body, Sidebar/Bottom Sheet, and Footer.

## Phase 2: Lead Capture & Concept (Steps 1 & 2)
**Goal:** Implement the initial data collection and service presentation steps.
**Requirements:** CORE-04, STEP-01, STEP-02
**Success Criteria:**
1. User can enter name and phone number (with mask) and accept LGPD.
2. Menu concept cards and pricing rules are displayed.
3. Autosave logic triggers after inputs.

## Phase 3: Event Data & Feasibility (Steps 3 & 4)
**Goal:** Collect event specifics and compute base viability and mandatory costs.
**Requirements:** STEP-03, STEP-04
**Success Criteria:**
1. Calendar and shift buttons allow date/time selection.
2. Guest counter enforces a minimum of 10.
3. Waiter costs (+R$120) and decoration (+R$250) update the global total in real-time.

## Phase 4: Menu Selection & Dietary (Steps 5 & 6)
**Goal:** Implement the dietary restrictions form and the core 4-course menu selection.
**Requirements:** STEP-05, STEP-06
**Success Criteria:**
1. Dietary tags expand conditionally when 'Yes' is selected.
2. User selects exactly one dish per category (Cold, Hot, Main, Dessert).
3. Continue button only enables when the 4 selections are complete.

## Phase 5: Upsell & Checkout (Steps 7 & 8)
**Goal:** Add personalization options and generate the final checkout summary with the WhatsApp link.
**Requirements:** STEP-07, STEP-08, WAPP-01
**Success Criteria:**
1. Upsell selections properly recalculate the global total (+R$20/30/50).
2. Final summary displays a complete breakdown of costs.
3. Clicking "FALAR COM O CHEF" opens a WhatsApp window with the correct pre-filled message.

## Phase Details

**Phase 1: Foundation & Layout**
- **UI hint**: yes

**Phase 2: Lead Capture & Concept (Steps 1 & 2)**
- **UI hint**: yes

**Phase 3: Event Data & Feasibility (Steps 3 & 4)**
- **UI hint**: yes

**Phase 4: Menu Selection & Dietary (Steps 5 & 6)**
- **UI hint**: yes

**Phase 5: Upsell & Checkout (Steps 7 & 8)**
- **UI hint**: yes
