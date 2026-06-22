# Phase 2: user-directory-rbac-integration - Pattern Map

**Generated:** 2026-06-22
**Domain:** RBAC components and tables layout patterns

## File-to-Pattern Mapping

| File Path | Role | Data Flow | Closest Analog | Pattern / Convention |
|---|---|---|---|---|
| `src/features/rbac/types/index.ts` | Data Contracts | Type checking | — | Clean TypeScript types/interfaces declarations. |
| `src/features/rbac/components/UserDirectory.tsx` | UI Feature View | Search input -> list filtering | `src/features/dashboard/components/DashboardOverview.tsx` | Functional component rendering user profiles list table. |
| `src/features/rbac/components/PermissionMatrix.tsx` | UI Feature View | Static table rendering | `src/features/dashboard/components/DashboardOverview.tsx` | Grid/matrix table displaying permissions vs roles. |
| `src/features/rbac/components/EditRoleModal.tsx` | UI Component | Active user update -> parent | `src/components/common/Sidebar.tsx` | Radix Dialog wrapper portal with select dropdown. |
| `src/features/rbac/components/RbacManagement.tsx` | Coordinator | State lifting to children | `src/App.tsx` | Master view mounting Directory, Matrix, and Modal. |

## Code Excerpts & Analogs

### Pattern 1: Table Cell Rendering with Dynamic Badges
Table badges are styled based on status and roles:
```typescript
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium border",
      status === 'active' 
        ? "bg-green-500/10 text-green-500 border-green-500/20" 
        : "bg-muted text-muted-foreground border-border"
    )}>
      <span className={cn("size-1.5 rounded-full", status === 'active' ? "bg-green-500" : "bg-muted-foreground")} />
      {status}
    </span>
  )
}
```

### Pattern 2: Portal Dialog overlay
Ensures dialog is rendered inside body using portal, preserving overlay layouts:
```typescript
import * as Dialog from '@radix-ui/react-dialog';

export function ModalPortalWrapper({ isOpen, onClose, children }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-lg">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

## Anti-Patterns Avoided

- **Direct State Mutation:** Overwriting state properties directly like `user.role = 'Admin'`. We strictly use immutable updates like `setUsers(users.map(u => u.id === id ? { ...u, role } : u))`.
- **Global Z-Index hardcoding:** Setting arbitrary values like `z-[99999]`. We use unified standard layers (`z-50` for overlays and dialogs).
