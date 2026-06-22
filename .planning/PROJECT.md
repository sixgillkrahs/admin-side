# admin-side

## What This Is

An admin control panel frontend for the Business Chat application. It serves as the administrative interface for managing platform features, viewing metrics, and controlling user access.

## Core Value

Enable secure, clear, and efficient administration of the platform, specifically focusing on user roles and permissions management (RBAC).

## Requirements

### Validated

- ✓ React + Vite + TypeScript development environment initialized — existing
- ✓ Tailwind CSS v4 & Shadcn UI design tokens and theme integration — existing
- ✓ Reusable Button primitive (`src/components/ui/button.tsx`) and `cn` utilities — existing
- ✓ Set up a feature-based folder structure inside `src/features/` — Validated in Phase 1: layout-foundation
- ✓ Create `src/components/common/` directory for shared UI layouts and components (e.g. Navigation, Headers) — Validated in Phase 1: layout-foundation

### Active

- [ ] Implement Dashboard screen with overview metrics and platform status
- [ ] Implement RBAC (Role-Based Access Control) management screens (User, Role, and Permission tables/forms)

### Out of Scope

- Go backend API development — handled separately by the backend service.

## Context

- **Backend Integration**: The application will communicate with a Go backend API service.
- **Design System**: Strict adherence to Shadcn UI aesthetic, styled via Tailwind CSS v4.

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

---
*Last updated: 2026-06-22 after Phase 1 completion*

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
