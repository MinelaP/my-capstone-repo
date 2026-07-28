# FE-03: AI-Assisted Workflow Drill Report

## Round 1 vs. Round 2 Comparison

| Metric / Aspect | Round 1 (Vague Prompt) | Round 2 (Precise / Constrained Prompt) |
| :--- | :--- | :--- |
| **Prompt Precision** | Low (Single-line request) | High (Defined stack, rules, constraints) |
| **Code Architecture** | Monolithic, inline state & manual validation logic | Modular (separated UI, Zod schema, and Vitest suite) |
| **Accessibility (a11y)** | Partial / basic aria attributes | Robust (`htmlFor`, dynamic `aria-invalid`, `aria-describedby`) |
| **Test Coverage** | None generated | 3 passing unit tests included |
| **Production Readiness** | Low (hard to maintain custom validation) | High (uses standard `react-hook-form` + `zod`) |

## Key Takeaways
1. **Specificity drives quality**: Providing explicit constraints (`react-hook-form`, `zod`) prevents the AI from inventing non-standard patterns.
2. **Verification is crucial**: Prompting the AI to include and run tests ensures the output is functional before integration.