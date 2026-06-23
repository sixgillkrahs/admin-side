# admin-side

## What This Is

An admin control panel frontend for the Business Chat application. It serves as the administrative interface for managing platform features, viewing metrics, and controlling user access.

## Core Value

Enable secure, clear, and efficient administration of the platform, specifically focusing on user roles and permissions management (RBAC).

## Current State

Shipped milestone **v2.1** (`Login Screen & Authentication UI`). Currently planning the next milestone.

## Requirements

### Validated

- ✓ React + Vite + TypeScript development environment initialized — existing
- ✓ Tailwind CSS v4 & Shadcn UI design tokens and theme integration — existing
- ✓ Reusable Button primitive (`src/components/ui/button.tsx`) and `cn` utilities — existing
- ✓ Set up a feature-based folder structure inside `src/features/` — Validated in Phase 1: layout-foundation
- ✓ Create `src/components/common/` directory for shared UI layouts and components (e.g. Navigation, Headers) — Validated in Phase 1: layout-foundation
- ✓ User Directory & RBAC Integration (User and Role tables, assignment modals, permission matrices) — Validated in Milestone v1.0 (Phase 2)
- ✓ Dashboard Vitals (overview statistics cards, metrics grids, dynamic English/Vietnamese translations switcher) — Validated in Milestone v1.0 (Phase 3)
- ✓ Interactive Dashboard Graphs (Recharts daily traffic line charts and hourly active session charts with i18n support) — Validated in Milestone v2.0 (Phase 1)
- ✓ Custom Role Creator (form dialog, checkable/uncheckable permission fields, lifting state logic, form validation) — Validated in Milestone v2.0 (Phase 2)
- ✓ Security Audit Logs Feed (chronological feed displaying admin changes with simulated web socket real-time logger) — Validated in Milestone v2.0 (Phase 3)
- ✓ Premium split-screen login layout with brand illustration/graphic and interactive login form — Validated in Milestone v2.1 (Phase 7)
- ✓ Full localization (English & Vietnamese translation support for all form fields, labels, and placeholders) — Validated in Milestone v2.1 (Phase 7)
- ✓ Basic form validation (email format, password length) and simulated redirect to the admin dashboard — Validated in Milestone v2.1 (Phase 8)

### Active

(None yet — initialize next milestone to define requirements)

### Out of Scope

- Go backend API development — handled separately by the backend service.

## Context

- **Backend Integration**: Shipped milestone v2.0 with mock APIs/real-time streams, and v2.1 with client-side authentication mock routing. The next milestone will begin connecting components to the real Go backend API service.
- **Design System**: Strict adherence to Shadcn UI aesthetic, styled via Tailwind CSS v4. Added Shadcn UI Label component.
- **Codebase Size**: Standalone React administration application with structured authentication features.

## Constraints

- **Tech Stack**: Must use React 19, Vite 8, TypeScript, Tailwind CSS v4, and Shadcn UI.
- **Project Structure**: Must follow a feature-based structure for modularity and ease of maintenance.
- **Common Components**: Shared non-design system primitives must live in `src/components/common/`.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Feature-based folders | Group related files (components, hooks, api, types) under modular folders for better control | ✓ Good |
| Shared components location | Put shared non-shadcn elements under `src/components/common/` to keep UI components separate | ✓ Good |
| Tailwind v4 + Vite plugin | Leverages Vite native css compilation instead of legacy PostCSS setups | ✓ Good |
| Recharts integration | Visualizing traffic trends and session details interactively | ✓ Good |
| Custom Role dialog | Using Shadcn Checkbox/Dialog for policy mapping modal | ✓ Good |
| Simulated WebSocket stream | Emulates real-time system log changes for frontend standalone demo | ✓ Good |
| App State Integration Routing | Used simple React state hook `isLoggedIn` in `App.tsx` since tab-state-based navigation is sufficient for the MVP | ✓ Good |
| CSS Branding Panel | Used custom abstract CSS gradient styling for the branding panel background to avoid external assets and keep bundle size low | ✓ Good |
| Localized Input Validation | Provided inline validation warning messages in red below fields, disabling input elements and language switcher during active loading redirection to prevent duplicate actions | ✓ Good |

---
*Last updated: 2026-06-23 after v2.1 milestone close*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
