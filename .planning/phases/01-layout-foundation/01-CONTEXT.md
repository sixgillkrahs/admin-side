# Phase 1: layout-foundation - Context

**Gathered:** 2026-06-22
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the modular feature-based folder skeleton under `src/features/` and the shared navigation layout shell under `src/components/common/` (Sidebar and Header).

</domain>

<decisions>
## Implementation Decisions

### Folder Structure
- **D-01:** Implement a feature-based folder structure inside `src/features/` for modular separation of dashboard and rbac features.
- **D-02:** Establish `src/components/common/` for shared, non-feature-specific UI components (e.g. layouts, Sidebar, Header).

### Navigation & Shell Layout
- **D-03:** Build a Sidebar navigation component `src/components/common/Sidebar.tsx` to handle navigation between Dashboard and RBAC modules.
- **D-04:** Wire the Sidebar layout into the root application component to serve as the unified admin application shell.

### the agent's Discretion
- Layout styling detail conforming to the dark-mode/premium Shadcn UI aesthetics.
- Visual micro-animations, icons selection, responsive sidebar toggle behavior.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- [PROJECT.md](file:///d:/works/business-chat/frontend/admin-side/.planning/PROJECT.md) — Tech stack, decisions, and constraints
- [REQUIREMENTS.md](file:///d:/works/business-chat/frontend/admin-side/.planning/REQUIREMENTS.md) — Product requirements and trace map
- [ROADMAP.md](file:///d:/works/business-chat/frontend/admin-side/.planning/ROADMAP.md) — Phase goals, plans, and success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- [ui/button.tsx](file:///d:/works/business-chat/frontend/admin-side/src/components/ui/button.tsx) — Reusable shadcn Button component
- [utils.ts](file:///d:/works/business-chat/frontend/admin-side/src/lib/utils.ts) — `cn` classname merger utility

### Established Patterns
- Tailwind CSS v4 custom theme mappings registered in `src/index.css` to prevent border utility compilation errors.

</code_context>

<specifics>
## Specific Ideas

- The sidebar should include quick navigation to "Dashboard" and "RBAC Management".
- Responsive layout where sidebar collapses/hides on small screens.

</specifics>

<deferred>
## Deferred Ideas

- DASH-01 KPIs and dashboard widgets (deferred to Phase 3)
- RBAC management screens, user lists, and modal forms (deferred to Phase 2)

</deferred>

---

*Phase: 01-layout-foundation*
*Context gathered: 2026-06-22*
