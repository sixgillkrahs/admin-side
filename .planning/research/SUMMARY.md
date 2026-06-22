# Project Research Summary

**Project:** admin-side
**Domain:** Dashboard & RBAC Admin Control Panel
**Researched:** 2026-06-22
**Confidence:** HIGH

## Executive Summary

This research covers the design and stack recommendations for building a secure and performant admin panel (Dashboard & RBAC) on React + Vite + Shadcn. Admin panels require clear data visualizations, strict access control policies, and modular directory structures to remain maintainable over time.

Our recommended approach uses React 19 + Vite 8 + TypeScript with Tailwind CSS v4 for fast, native CSS compilation. For data layer operations, TanStack Query is chosen for robust server-state management. For UI organization, we adopt a strict **feature-based** folder pattern where each admin feature (like dashboard, rbac) encapsulates its own components, hooks, APIs, and types.

Key risks include client-side bypasses of role checks (requiring backend-enforced scopes on all APIs) and performance lags during rendering complex Recharts widgets (which we mitigate using data memoization and ResponsiveContainer boundaries).

## Key Findings

### Recommended Stack

We leverage a modern, lightweight React stack optimized for dashboard data fetching and policy management.

**Core technologies:**
- **React 19 & Vite 8**: High performance UI rendering and build framework.
- **Tailwind CSS v4 & Shadcn UI**: Clean utility styling and highly accessible UI primitives.
- **TanStack Router**: Type-safe client-side routing to navigate pages with search param tracking.
- **TanStack Query**: Server-state synchronization, caching, and mutation tracking.
- **Recharts**: Declarative React chart rendering for dashboard stats.
- **Zustand**: Lightweight global client state store (User profile, session, theme).

### Expected Features

**Must have (table stakes):**
- **KPI Overview Cards**: Visual metrics summary (Total users, platform status).
- **User Directory**: Searchable, paginated data table showing active users and roles.
- **User Role Assignment**: Interactive form/modal to mutate a user's role.
- **Role & Permission Matrix**: Table or grid displaying active permissions per role.

**Should have (competitive):**
- **System Status Chart**: Interactive charts for traffic and server response times.
- **Role Creator & Policy Editor**: Custom role definition form.
- **Live Security Audit Logs**: Audit trail of admin actions.

**Defer (v2+):**
- **RBAC Policy Simulator**: Interactive access control debugger.
- **Access Control Heirarchy Tree**: Graphical representation of role structures.

### Architecture Approach

A Client-side Single Page Application (SPA) utilizing a **feature-based folder structure** where each feature acts as a decoupled module exposing a clean Public API.

**Major components:**
1. **Presentation Layer (Pages & Features)**: Renders route templates and interactive widgets.
2. **Application Layer (Zustand & Hooks)**: Stores local session state and encapsulates queries/mutations.
3. **Data Layer (TanStack Query & API Client)**: Communicates with Go API and caches responses.

### Critical Pitfalls

1. **Client-Side Access Enforcement Only**: Always enforce role-permission validation on the backend API.
2. **Brittle Role Hardcoding**: Bind views to granular permission scopes rather than naming strings like `Admin`/`Manager`.
3. **Recharts Rendering Lag**: Memoize chart datasets using React `useMemo` to prevent frequent redraw bottlenecks.

## Implications for Roadmap

### Phase 1: Foundation & Layout
**Rationale:** Establishing the project skeleton and global routing/sidebar layouts is needed before building specific features.
**Delivers:** Navigation shell, common UI layouts, and basic routing.
**Addresses:** Common Layouts (`src/components/common/`).

### Phase 2: User Directory & RBAC Integration
**Rationale:** Managing roles and permissions is the core value of this administration tool.
**Delivers:** Searchable user tables, role matrices, and assignment forms.
**Addresses:** User Directory, User Role Assignment, and Role/Permission Matrix.

### Phase 3: Dashboard Vitals
**Rationale:** Dashboard metrics require backend telemetry feeds and chart styling to be complete.
**Delivers:** KPI summary cards, area/bar status charts, and mock data bindings.
**Addresses:** KPI Overview Cards, System Status Chart.

### Phase Ordering Rationale

- We build the shell layout (Phase 1) first to provide a container for pages.
- We build RBAC management (Phase 2) next because it represents the core transactional utility of the admin app.
- We build Dashboard vitals (Phase 3) last because it depends on metrics data aggregation and charting libraries which can be integrated once the application layout is stable.

---
*Research summary for: Dashboard & RBAC Admin Control Panel*
*Researched: 2026-06-22*
