# Phase 2: user-directory-rbac-integration - Research

**Researched:** 2026-06-22
**Domain:** React 19 + Tailwind CSS v4 + Radix UI access matrix and user management components
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Renders a standard table displaying User profiles with fields: Name (with avatar), Email, Role Badge (custom styled for Admin, Moderator, User), Status Badge (Active/Inactive), and an Actions column.
- **D-02:** Includes a text input filter for real-time search matching name or email.
- **D-03:** Renders a Grid/Matrix where rows list specific permissions (e.g., read:messages, write:messages, admin:all, manage:roles) and columns represent roles. Checked states represent active permission claims.
- **D-04:** Actions column "Edit Role" opens a Dialog Modal window (using shadcn dialog/select primitives) displaying the user's name and a dropdown to pick their new role. Saving updates the local state in-place.

### the agent's Discretion
- Visual theme styling (using premium oklch tokens), badge color palettes, pagination layout and hover effects.
- Seed data set of mock users and roles to display.

### Deferred Ideas (OUT OF SCOPE)
- DASH-02 Interactive Recharts graphs (deferred to Phase 3)
- AUDIT-01 Real-time audit logs websocket feed (out of scope for v1)

</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

Single-tier application — all capabilities reside in Browser/Client.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| User Directory state | Browser/Client | — | Client-side reactive memory storing list of mock users. |
| Search Filtering | Browser/Client | — | Local array matching logic on user input. |
| RBAC Grid Matrix | Browser/Client | — | Visual table mapping permissions to roles, with toggles. |
| Role Modal Dialog | Browser/Client | — | Modal display using Radix UI Dialog primitives. |

</architectural_responsibility_map>

<research_summary>
## Summary

This research outlines the best practices for building access control management UIs in React 19.

The primary recommendation is to handle table layouts using standard, semantic HTML `<table>` elements styled with Tailwind v4 utilities, matching the shadcn visual guidelines without importing heavy grid libraries. Role mapping matrices should use a column-by-role structure where checkboxes are disabled for non-superusers, and the modal dialog must handle aria-attributes properly (using Radix primitives) to guarantee accessibility and escape key closing.

**Primary recommendation:** Build a single unified state provider inside `RbacManagement.tsx` to handle user state and pass setters to the dialog modal, ensuring instant rendering updates.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^19.2.6 | State and hooks | Standard UI framework |
| lucide-react | ^1.21.0 | Visual icons | Standard vector icon library |
| tailwindcss | ^4.3.1 | Visual styling | CSS-first configuration framework |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-dialog | ^1.1.0 | Accessible modals | Building custom modals with focus traps |
| @radix-ui/react-select | ^2.1.0 | Custom dropdowns | Accessible select dropdown inputs |

**Installation:**
If needed, install Radix Dialog and Select primitives:
```bash
npm install @radix-ui/react-dialog @radix-ui/react-select
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/features/rbac/
├── components/
│   ├── UserDirectory.tsx     # Searchable User Table (RBAC-01)
│   ├── PermissionMatrix.tsx  # Grid matrix display (RBAC-02)
│   ├── EditRoleModal.tsx     # Role updater Dialog Modal (RBAC-03)
│   └── RbacManagement.tsx    # Master RBAC coordinator
├── types/
│   └── index.ts              # RBAC domain interfaces
└── index.ts                  # Public API exports
```

### Pattern 1: Declarative Dialog Modal
Modals must use Radix UI's Dialog primitive to manage focus traps, escape key support, and backdrop blur:
```typescript
import * as Dialog from '@radix-ui/react-dialog';

export function EditRoleModal({ isOpen, onClose, user, onSave }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border p-6 rounded-xl shadow-lg w-full max-w-md z-50">
          <Dialog.Title className="text-lg font-semibold">Edit User Role</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mt-1">
            Change role for {user.name}.
          </Dialog.Description>
          {/* Form Content */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Anti-Patterns to Avoid
- **Uncontrolled Modal Portals:** Rendering dialog elements inline inside the table row without portals. This breaks page scrolling and overlays behind other elements.
- **Manual Input Debounce for Small Lists:** Implementing complex debouncing logic for client-side search lists of under 100 items. Direct filter on input change is faster and simpler.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal Overlays & Portals | Custom CSS overlays with display block/none | `@radix-ui/react-dialog` | Handles overlay z-index, ESC key close, scroll lock, and screen readers. |
| Avatars | Hardcoded image fallback icons | Initial-based placeholders | Bulletproof fallback when user profile images fail loading. |

</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Focus Escape in Modals
**What goes wrong:** User is tab-navigating the modal, and the cursor focus escapes back to the main user directory table in the background.
**Why it happens:** Custom modal overlays without focus-trap logic.
**How to avoid:** Use Radix Dialog Content which locks keyboard navigation focus inside the modal boundary.

### Pitfall 2: Local State Desynchronization
**What goes wrong:** User updates a role in the modal, clicks save, but the main user directory table fails to show the updated badge.
**Why it happens:** Modifying a copy of the state array instead of updating the single source of truth react state.
**How to avoid:** Lift user state to the parent `RbacManagement` component and update the state array using immutable mapping (`users.map(u => u.id === id ? ... : u)`).
</common_pitfalls>

<code_examples>
## Code Examples

### Standard Client-Side Search Filter
```typescript
const filteredUsers = users.filter(user => 
  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  user.email.toLowerCase().includes(searchQuery.toLowerCase())
);
```

### Permission Matrix Layout
```typescript
// Rows: permissions, Columns: roles
const permissions = ['read:messages', 'write:messages', 'admin:all'];
const roles = ['Admin', 'Moderator', 'User'];

export function PermissionMatrix() {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 font-medium">Permission</th>
          {roles.map(role => (
            <th key={role} className="text-center py-3 font-medium">{role}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {permissions.map(perm => (
          <tr key={perm} className="border-b border-border/50 hover:bg-muted/30">
            <td className="py-3 text-foreground font-medium">{perm}</td>
            {roles.map(role => (
              <td key={role} className="text-center py-3">
                <input 
                  type="checkbox" 
                  checked={hasPermission(role, perm)} 
                  disabled 
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom CSS Modals | Radix UI Primitive Portals | Modern React | Complete accessibility conformance out of the box. |
| Tables with absolute margins | Flex/Grid Table layouts | Tailwind v4 | Dynamic responsiveness, easier layout alignments. |

</sota_updates>

<open_questions>
## Open Questions

None. Primitives and patterns are fully validated.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- Radix UI Primitives documentation (Dialog and Select)
- Tailwind CSS v4 official layout patterns

</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: React 19, Tailwind CSS v4
- Ecosystem: Radix UI, Lucide React
- Patterns: Table styling, matrix grids, Dialog Modals

**Confidence breakdown:**
- Standard stack: HIGH — using standard official packages
- Architecture: HIGH — modular React architecture
- Pitfalls: HIGH — Radix focus traps verified

**Research date:** 2026-06-22
**Valid until:** 2026-07-22
</metadata>

---

*Phase: 02-user-directory-rbac-integration*
*Research completed: 2026-06-22*
*Ready for planning: yes*
