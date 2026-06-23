# Walking Skeleton — admin-side

**Phase:** 1
**Generated:** 2026-06-22

## Capability Proven End-to-End

An administrator can render the premium responsive app shell containing a Sidebar and a Header, and toggle between the "Dashboard" and "RBAC Management" placeholder views on screen.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | React 19 + Vite 8 + TypeScript | Modern, high-performance, and lightweight build tooling. |
| Styling | Tailwind CSS v4 | CSS-first custom theme variables inside `@theme` blocks for maximum speed and simplicity. |
| UI Primitives | Shadcn UI | Radix-based clean primitives matching high-fidelity layout guidelines. |
| Directory Layout | Feature-based (`src/features/*`) | Encapsulates routing, UI, state, and domain logic by module. |
| Shared Layout | Common components (`src/components/common/*`) | Segregates general wrappers (Sidebar, Header, Layout) from domain-specific features. |
| Client-Side Routing | Tab State navigation (Phase 1) | Establishes the visual shell and modular views before full route wiring. |

## Stack Touched in Phase 1

- [x] Project scaffold (React 19 + Vite 8 + TypeScript)
- [ ] Routing — simple Tab State routing proving modular feature mounting
- [ ] UI — responsive sidebar layout shell with dark/light themes and Lucide icons
- [ ] Deployment — local run using `npm run dev`

## Out of Scope (Deferred to Later Slices)

- DASH-01 KPI dashboard metric overview cards (Phase 3)
- RBAC-01 User Directory searchable table (Phase 2)
- RBAC-02 Role & Permission Matrix (Phase 2)
- RBAC-03 Role update forms and modals (Phase 2)
- TanStack Router Integration (Deferred to Phase 2)

## Subsequent Slice Plan

- **Phase 2: User Directory & RBAC Integration** — Build user profile directories, permission matrices, and role mapping modals.
- **Phase 3: Dashboard Vitals** — Build KPI summary cards and traffic charts.
