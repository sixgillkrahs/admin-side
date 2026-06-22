# Phase 2: User Directory & RBAC Integration - Context

**Gathered:** 2026-06-22
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the access management screens: a searchable User Directory Table, a Grid-based Role & Permission Matrix, and a Role Assignment Modal.

</domain>

<decisions>
## Implementation Decisions

### User Directory Table (RBAC-01)
- **D-01:** Renders a standard table displaying User profiles with fields: Name (with avatar), Email, Role Badge (custom styled for Admin, Moderator, User), Status Badge (Active/Inactive), and an Actions column.
- **D-02:** Includes a text input filter for real-time search matching name or email.

### Role & Permission Matrix (RBAC-02)
- **D-03:** Renders a Grid/Matrix where rows list specific permissions (e.g., read:messages, write:messages, admin:all, manage:roles) and columns represent roles. Checked states represent active permission claims.

### Role Assignment Modal (RBAC-03)
- **D-04:** Actions column "Edit Role" opens a Dialog Modal window (using shadcn dialog/select primitives) displaying the user's name and a dropdown to pick their new role. Saving updates the local state in-place.

### the agent's Discretion
- Visual theme styling (using premium oklch tokens), badge color palettes, pagination layout and hover effects.
- Seed data set of mock users and roles to display.

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
- [common/Layout.tsx](file:///d:/works/business-chat/frontend/admin-side/src/components/common/Layout.tsx) — Page shell layout with Sidebar and Header navigation
- [App.tsx](file:///d:/works/business-chat/frontend/admin-side/src/App.tsx) — Entry point hosting tab state routing

### Established Patterns
- Clean public index exports inside feature directories.
- Dark/light responsive CSS variables integration inside `src/index.css`.

</code_context>

<specifics>
## Specific Ideas

- Highlight Admin roles with premium purple/indigo badges, Moderators with blue, and Users with slate.
- Active status is marked with a vibrant green indicator dot, inactive with gray.

</specifics>

<deferred>
## Deferred Ideas

- DASH-02 Interactive Recharts graphs (deferred to Phase 3)
- AUDIT-01 Real-time audit logs websocket feed (out of scope for v1)

</deferred>

---

*Phase: 02-user-directory-rbac-integration*
*Context gathered: 2026-06-22*
