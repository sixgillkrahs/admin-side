# Coding Conventions

**Analysis Date:** 2026-06-22

## Naming Patterns

**Files:**
- PascalCase for React components and pages (e.g. `App.tsx`, `Button.tsx`).
- camelCase or kebab-case for utilities, configs, and helper scripts (e.g. `utils.ts`, `vite.config.ts`, `eslint.config.js`).

**Functions:**
- camelCase for functions (e.g. `cn`, `buttonVariants`).
- Hook functions must be prefixed with `use` (e.g. `useState`, `useMemo`).
- Event handlers prefixed with `handle` (e.g. `handleClick`, `handleSubmit`).

**Variables:**
- camelCase for variables and hooks state (e.g. `buttonVariants`, `className`).
- UPPER_SNAKE_CASE for configurations and static constants.

**Types:**
- PascalCase for type aliases, interfaces, and enums (e.g. `ClassValue`, `ButtonProps`).
- Prefer interfaces for object structures and types for union types.

## Code Style

**Formatting:**
- Default code styles are managed by ESLint.
- Uses standard JavaScript/TypeScript style with 2-space indentation.
- Single quotes (e.g. `import * as React from "react"`) are common but double quotes are used in component imports and classes.

**Linting:**
- ESLint configuration in `eslint.config.js`.
- Configured using typescript-eslint and eslint-plugin-react-hooks.
- Lint check via command: `npm run lint`.

## Import Organization

**Order:**
1. React and React-related packages (e.g. `import * as React from "react"`).
2. Third-party UI primitives and helpers (e.g. `class-variance-authority`, `radix-ui`).
3. Internal utils using alias (e.g. `import { cn } from "@/lib/utils"`).
4. Relative imports (e.g. `import "./App.css"`).

**Path Aliases:**
- `@/*` resolves to `./src/*`.
- Configured in both `tsconfig.app.json` (TypeScript resolution) and `vite.config.ts` (bundler resolution).

## Error Handling

**Patterns:**
- Standard try/catch blocks within React interaction hooks.
- Validate parameters before executing state changes.

## Comments

**When to Comment:**
- Explain the reason *why* a particular workaround or logic is applied, rather than *what* it does.
- Document custom configuration overrides (e.g., in `vite.config.ts`).

---

*Conventions analysis: 2026-06-22*
*Update as coding guidelines evolve*
