# Phase 2: Custom Role Creator - Context

**Gathered:** 2026-06-23
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers a Custom Role Creator modal form inside the `RbacManagement` screen, allowing admins to define new custom user roles and assign specific permission claims. The newly registered roles will dynamically populate the `PermissionMatrix` and be assignable to team members via `EditRoleModal`.

</domain>

<decisions>
## Implementation Decisions

### Custom Role Creator (RBAC-04)
- **D-01:** Utilizes Shadcn UI `Dialog` as the modal container and `Checkbox` for selecting/deselecting individual capability claims.
- **D-02:** Dynamically registers new roles by lifting the `roles` and `rolePermissions` states into `RbacManagement.tsx`.
- **D-03:** Form provides validation checking for empty inputs and duplicate role names (case-insensitive) to prevent state conflicts.
- **D-04:** Integrates with `react-i18next` so that all form labels, button CTAs, error messages, and descriptions are fully translated into English and Vietnamese.
- **D-05:** Passes the dynamic list of roles and permissions down to `PermissionMatrix` and `EditRoleModal` so they auto-update when a new custom role is created.

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
- [rbac/components/PermissionMatrix.tsx](file:///d:/works/business-chat/frontend/admin-side/src/features/rbac/components/PermissionMatrix.tsx) — Dynamic permission matrix table.
- [rbac/components/EditRoleModal.tsx](file:///d:/works/business-chat/frontend/admin-side/src/features/rbac/components/EditRoleModal.tsx) — User role assignment modal.
- [lib/i18n.ts](file:///d:/works/business-chat/frontend/admin-side/src/lib/i18n.ts) — Translations configuration.

</code_context>

<specifics>
## Specific Ideas

- Display a clear "Create Custom Role" button with a Lucide `Plus` icon at the top of the RBAC Management screen.
- Layout checkboxes clearly in a grid with descriptive help texts mapping to each permission claim.

</specifics>

<deferred>
- AUDIT-01 Real-time audit logs websocket feed (deferred to Phase 3 of v2.0)
</deferred>

---
*Phase: 02-custom-role-creator*
*Context gathered: 2026-06-23*
