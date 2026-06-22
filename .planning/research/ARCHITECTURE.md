# Architecture Research

**Domain:** Dashboard & RBAC Admin Control Panel
**Researched:** 2026-06-22
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                    │
│  (React Components: Pages, Feature Layouts, Common Layouts) │
├─────────────────────────────────────────────────────────────┤
│                       Application Layer                     │
│  (Custom React Hooks, Route guards, Client state: Zustand)   │
├─────────────────────────────────────────────────────────────┤
│                        Data Layer                           │
│  (TanStack Query Cache, REST Api client / fetch wrapper)    │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Pages (Route handlers) | Orchestrates page structure and loads data. | TanStack Router component files under `src/routes/`. |
| Feature Components | Implements specific visual elements like Charts, Tables. | React files under `src/features/[feature]/components/`. |
| Shared UI Components | Standard design system visual primitives. | Shadcn files under `src/components/ui/`. |
| Common UI Components | Shared non-primitive blocks (Header, Sidebar). | React files under `src/components/common/`. |
| State Stores | Caches user profile and active policies. | Zustand stores under `src/features/auth/hooks/` or `src/lib/`. |

## Recommended Project Structure

```text
src/
├── components/
│   ├── common/         # Layouts, Sidebar, Header (shared non-primitives)
│   └── ui/             # Shadcn primitives (button.tsx, input.tsx, etc.)
├── features/           # Modularized feature folders
│   ├── dashboard/      # Dashboard feature
│   │   ├── components/ # Dashboard-specific UI (StatsCards, KPICharts)
│   │   ├── hooks/      # useDashboardStats queries
│   │   ├── api/        # getDashboardSummary REST requests
│   │   └── types/      # Dashboard data types
│   └── rbac/           # Role-based access control feature
│       ├── components/ # UserTable, RoleList, PolicyEditor
│       ├── hooks/      # useUsers, useRoles queries & mutations
│       ├── api/        # getUsers, updateRolePermissions APIs
│       └── types/      # User, Role, Permission schemas
├── lib/                # Shared utilities (api client, utils.ts)
├── routes/             # TanStack Router folder
└── main.tsx            # React DOM mounting entry point
```

### Structure Rationale

- **src/features/**: Keeps codebase modular. Developers can find everything related to `rbac` inside one folder instead of hopping between global `components`, `hooks`, and `services` directories.
- **src/components/common/**: Separates shared structural components (Sidebar, Navbar) from low-level reusable building blocks (Shadcn components under `src/components/ui/`).

## Architectural Patterns

### Pattern 1: Feature encapsulation with Public API (Index files)

**What:** Each feature folder exports only a selected set of public interfaces (components, hooks, types) via a root `index.ts`. All inner workings (subcomponents, raw API calls) are kept private to the feature.
**When to use:** Crucial for feature-based structures to prevent cross-feature imports from coupling features tightly.
**Trade-offs:** Prevents circular dependencies, but requires developers to maintain explicit export maps.

**Example:**
```typescript
// src/features/rbac/index.ts
export { UserDirectory } from "./components/UserDirectory"
export { useUserRoles } from "./hooks/useUserRoles"
export type { User, Role } from "./types"
```

### Pattern 2: Cache-first query patterns

**What:** Manage server communication through TanStack Query (React Query), separating client state (Zustand) from server state.
**When to use:** Essential for dashboards to minimize server load and handle loading/caching.
**Trade-offs:** Handles caching and automatic background updating, but increases bundle size and has a learning curve.

## Data Flow

### Request Flow (Dashboard loading)

1. **Route Match**: TanStack Router matches URL `/dashboard`.
2. **Page Load**: Dashboard page component mounts.
3. **Query Fire**: React component calls custom hook `useDashboardStats()`.
4. **Cache Check**: TanStack Query checks cache.
   - If hit: immediately return cached stats.
   - Background fetch fires to sync data.
5. **API Request**: Axios/fetch wrapper calls `/api/v1/dashboard/summary`.
6. **UI Sync**: Component re-renders with fresh statistics once request finishes.

---
*Architecture research for: Dashboard & RBAC Admin Control Panel*
*Researched: 2026-06-22*
