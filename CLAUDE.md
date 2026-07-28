# Project Guidelines & Rules

1. **Form Handling**: Always use `react-hook-form` with `zod` for form validation. Do not write custom state validation.
2. **Testing**: Every new component or form logic must be accompanied by unit tests written in Vitest / React Testing Library.
3. **Accessibility**: Ensure all input controls have explicit labels and correct ARIA attributes (`aria-invalid`, `aria-describedby`).