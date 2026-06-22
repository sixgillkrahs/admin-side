# Architecture

**Analysis Date:** 2026-06-22

## Pattern Overview

**Overall:** Client-Side Single Page Application (SPA).

**Key Characteristics:**
- **Component-Driven UI**: UI constructed as a hierarchy of reusable React components.
- **Atomic/Modular CSS**: Styles declared using Tailwind CSS utility classes directly on components.
- **Component Primitives**: Uses Radix UI headless components for complex UI interactions (accessible popovers, dropdowns, etc.), wrapped in customizable Tailwind styling via Shadcn.

## Layers

**UI Layer (Views & Pages):**
- Purpose: Render views and accept user inputs.
- Contains: React components, hooks, layouts under `src/components/`, `src/App.tsx`.
- Depends on: Component UI layer (`src/components/ui/`), utilities (`src/lib/`).
- Used by: Application entry point (`src/main.tsx`).

**Component UI Layer (Shadcn Primitives):**
- Purpose: Provide reusable, accessible low-level building blocks.
- Contains: Headless wrapping components (like `src/components/ui/button.tsx`).
- Depends on: Styling utilities (`src/lib/utils.ts`), Radix UI primitives.
- Used by: UI Layer (Pages and custom views).

**Utility Layer:**
- Purpose: Common formatting, styling, and helper logic.
- Contains: Helpers like `cn` class merging.
- Depends on: External libraries (`clsx`, `tailwind-merge`).
- Used by: All layers.

## Data Flow

**User Interaction Flow:**
1. User interacts with a React component (e.g. clicks a Button).
2. Local component state updates, triggering a re-render.
3. (Future) API requests sent via fetch/Axios to the Go backend API.
4. UI updates based on the response.

**State Management:**
- Component-level state handled by React `useState`/`useReducer`.
- Global state (Future) can be managed using standard React Context or Zustand.

## Key Abstractions

**CSS Class Merging (`cn`):**
- Purpose: Merges Tailwind CSS classes dynamically while correctly handling class overrides.
- Location: `src/lib/utils.ts`
- Pattern: Helper function wrapping `clsx` and `twMerge`.

**UI Primitives:**
- Purpose: Base component variants mapping directly to design system styles.
- Location: `src/components/ui/`
- Pattern: Variants defined via `class-variance-authority` (CVA).

## Entry Points

**Main Entry Point:**
- Location: `src/main.tsx`
- Triggers: Browser loading `index.html`.
- Responsibilities: Renders React application root (`<App />`) into the `#root` DOM element.

**Root Component:**
- Location: `src/App.tsx`
- Responsibilities: Organizes layouts, routing (future), and global providers.

## Error Handling

**Strategy:**
- Client-side error handling via try/catch inside user event handler hooks.
- React Error Boundaries (future) to catch rendering crashes.

## Cross-Cutting Concerns

**Styling:**
- Consistent design tokens mapped in `src/index.css` under the `@theme` directive, utilizing CSS variables.

**Path Mapping:**
- Module paths resolved using the `@/*` alias pointing to `src/*` for cleaner imports.

---

*Architecture analysis: 2026-06-22*
*Update when introducing global state or routing patterns*
