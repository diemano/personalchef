# Requirements

## v1 Requirements

### Core (CORE)
- [x] **CORE-01**: Setup React/Next.js environment with Tailwind CSS and Zustand/Context.
- [x] **CORE-02**: Implement single-page step-by-step navigation container with fade/horizontal transitions.
- [ ] **CORE-03**: Global state management to track selections and compute dynamic costs in real-time.
- [x] **CORE-04**: Debounced autosave (1 second) of lead progress to backend API.

### Layout (LAY)
- [x] **LAY-01**: Sticky Header with Chef's Logo, current step indicator, and progress bar.
- [x] **LAY-02**: Dynamic Body area for interaction elements.
- [x] **LAY-03**: Right-side (Desktop) or Bottom-Sheet (Mobile) Summary displaying partial data and total cost.
- [x] **LAY-04**: Fixed Footer with Back (secondary) and Continue (primary) buttons.
- [x] **LAY-05**: **Conversational Interface**: The UI must follow a chat-like layout where Chef Lucas interacts with the user via speech bubbles. Each interaction is a "message" from the chef followed by an input from the user.

### Steps (STEP)
- [x] **STEP-01**: Lead Capture - Collect name and WhatsApp with mask. Require LGPD consent checkbox.
- [x] **STEP-02**: Concept - Display 4-course menu cards, included items list with icons, and cost rules tags.
- [x] **STEP-03**: Event Data - Calendar (block past dates), shift buttons (Lunch/Dinner), Location inputs, occasion tags, and Guest counter (minimum 10).
- [x] **STEP-04**: Feasibility - Multiple-choice checklist for kitchen structure, decoration toggle (+R$250), and automatic waiter calculation (+R$120 per waiter depending on guest count).
- [x] **STEP-05**: Dietary - Binary question. If yes, expand grid of restriction tags and a free-text textarea.
- [x] **STEP-06**: Menu Selection - Grid of cards for Cold Starter, Hot Starter, Main, and Dessert. Restrict selection to 1 per category before enabling Continue.
- [ ] **STEP-07**: Upsell - Offer protein change (+R$20/pax), duplicate dish (+R$30/pax), additional time (+R$50/pax), updating the global total. If duplicate dish is selected, prompt which category to duplicate.
- [ ] **STEP-08**: Checkout - Final summary table, financial highlight box, edit buttons for specific steps, and CTA button generating WhatsApp deep link.

### WhatsApp (WAPP)
- [ ] **WAPP-01**: Generate a URI-encoded message string based on global state and trigger redirect to WhatsApp upon clicking final CTA.

## Deferred (v2)
- [ ] Native checkout/payment gateway integration.
- [ ] Admin dashboard to view captured leads.

## Out of Scope
- Support for events with less than 10 people (business rule constraint).
- Complex vertical scrolling designs (app is strictly step-by-step).

## Traceability
| Requirement | Gap closure phase | Status | Notes |
| --- | --- | --- | --- |
| CORE-03 | Phase 9 | Pending | Implemented in store/pricing flow; needs formal verification artifact. |
| STEP-07 | Phase 9 | Pending | Implemented in upsell flow; needs formal verification artifact. |
| STEP-08 | Phase 9 | Pending | Implemented in checkout/summary flow; needs formal verification artifact. |
| WAPP-01 | Phase 9 | Pending | Implemented with WhatsApp deeplink; needs formal verification artifact. |
