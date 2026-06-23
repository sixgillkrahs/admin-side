# Phase 3: Audit Logs Feed - Context

**Gathered:** 2026-06-23
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers a real-time Audit Logs Feed panel inside the `RbacManagement` layout. It displays a chronological list of administrative actions, updated dynamically through a simulated real-time event stream and reactive events triggered by user actions (such as role modifications and custom role creations).

</domain>

<decisions>
## Implementation Decisions

### Audit Logs Feed (AUDIT-01)
- **D-01:** Renders an Audit Logs panel inside `RbacManagement.tsx` below the User Directory and Permission Matrix.
- **D-02:** Simulates a real-time websocket stream using a `useEffect` interval that appends randomized system access logs periodically (e.g., every 12–15 seconds).
- **D-03:** Reacts immediately to manual user actions in the dashboard, adding logs for "role modified" and "custom role created" in real-time.
- **D-04:** Dynamic translation using `i18next` interpolations (e.g., `t('rbac.audit.event.changeRole', { user, role })`) to support bilingual English and Vietnamese rendering.
- **D-05:** Styles the list items using responsive card-based layout with Lucide icon indicators and timestamps.

</decisions>

<canonical_refs>
## Canonical References

### Project Specifications
- [PROJECT.md](file:///d:/works/business-chat/frontend/admin-side/.planning/PROJECT.md) — Tech stack, decisions, and constraints
- [REQUIREMENTS.md](file:///d:/works/business-chat/frontend/admin-side/.planning/REQUIREMENTS.md) — Product requirements and trace map
- [ROADMAP.md](file:///d:/works/business-chat/frontend/admin-side/.planning/ROADMAP.md) — Phase goals, plans, and success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- [rbac/components/RbacManagement.tsx](file:///d:/works/business-chat/frontend/admin-side/src/features/rbac/components/RbacManagement.tsx) — Main RBAC coordinator.
- [lib/i18n.ts](file:///d:/works/business-chat/frontend/admin-side/src/lib/i18n.ts) — Translations configuration.

</code_context>

<specifics>
## Specific Ideas

- Display events with clear timestamp details (e.g., HH:MM:ss) and distinct icons for different event categories (e.g., `Shield` for role edits, `Key` for custom roles, `User` for logins).
- Limit the total size of the log queue (e.g., max 20 events) to prevent client memory bloat.

</specifics>

<deferred>
None - last phase of milestone v2.0.
</deferred>

---
*Phase: 03-audit-logs-feed*
*Context gathered: 2026-06-23*
