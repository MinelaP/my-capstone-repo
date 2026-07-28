# FE-03: AI-Assisted Workflow Drill Report

## Overview
This report compares two development workflows for building a user settings form: a vague single-prompt approach (Round 1) versus a precise, highly constrained prompt with verification (Round 2).

---

## Round 1 vs. Round 2 Detailed Diff Analysis

| Metric / Aspect | Round 1 (`round-1-vague`) | Round 2 (`round-2-precise`) |
| :--- | :--- | :--- |
| **Prompt Engineering** | Single-line vague prompt ("build a settings form"). | Precise spec defining stack (`react-hook-form`, `zod`, `vitest`), field validation rules, and explicit a11y requirements. |
| **Code Structure** | Single monolithic file with state managed manually using native React `useState`. | Modular architecture: UI component (`SettingsForm.tsx`), schema definition (`SettingsForm.schema.ts`), and unit tests (`SettingsForm.test.tsx`). |
| **Validation Mechanics** | Hand-written `if/else` checks, prone to edge-case bugs and poor maintainability. | Declarative type-safe validation schema using Zod, integrated via `@hookform/resolvers/zod`. |
| **Accessibility (a11y)** | Basic `<label>` wrappers, missing dynamic ARIA error linkages. | Full WCAG compliance: explicit `htmlFor` bindings, dynamic `aria-invalid` toggling, and conditional `aria-describedby` referencing error alerts. |
| **Verification & Testing** | Zero automated tests; manually verified in browser. | 3 automated unit tests using Vitest and React Testing Library (100% test pass rate). |

---

## AI Mistake Caught During Review
During the review of the AI-generated code in Round 2, I identified an edge-case oversight in the accessibility and state implementation:

* **The Issue:** The initial component draft did not disable the submit button while `isSubmitting` was active, nor did it conditionally clear the `aria-describedby` attribute when an error resolved. This caused screen readers to reference non-existent error DOM elements when fields became valid.
* **The Fix:** Constrained the Zod schema and enforced explicit conditional rendering (`aria-describedby={errors.username ? "username-error" : undefined}`) so screen reader nodes update dynamically upon successful validation.

---

## Key Takeaways & Review Time Impact
1. **End-to-End Speed:** Although Round 2 required more initial effort to write the prompt, it dramatically reduced debugging time. Round 1 produced code faster but required heavy manual review to catch validation bugs.
2. **Explicit Constraints Prevent Invention:** Requesting `react-hook-form` + `zod` stopped the AI from creating non-standard custom hook logic.
3. **Verification Loops are Mandatory:** Generating tests alongside code ensures immediate feedback on functionality without manual browser testing.