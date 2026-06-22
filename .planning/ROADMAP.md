# Roadmap: admin-side

## Overview

Roadmap for building the admin control panel. We will construct the application using a vertical MVP approach, delivering functional pieces slice-by-slice, starting from directory skeletons and layouts, moving to core access controls (RBAC), and concluding with visual dashboard metrics.

## Phases

- [x] **Phase 1: Layout & Foundation** - Initialize feature directories and render the navigation shell. (completed 2026-06-22)
- [ ] **Phase 2: User Directory & RBAC Integration** - Build user directory tables and role mapping utilities.
- [ ] **Phase 3: Dashboard Vitals** - Implement overview statistics cards and system summary grids.

## Phase Details

### Phase 1: Layout & Foundation

**Goal:** Initialize feature directories and render the navigation shell.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** [STRUCT-01, STRUCT-02]
**Success Criteria** (what must be TRUE):

  1. Directory structure matching feature-based rules created inside `src/features/`.
  2. Sidebar navigation shell rendered on screen inside common layout (`src/components/common/Sidebar.tsx`).

**Plans:** 2/2 plans complete

Plans:
**Wave 1**

- [x] 01-01: Initialize feature base directories and `src/components/common` folder.

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02: Build common Sidebar layout and wire it into the root component.

### Phase 2: User Directory & RBAC Integration

**Goal:** Implement user and role tables, role assignment modal.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** [RBAC-01, RBAC-02, RBAC-03]
**Success Criteria** (what must be TRUE):

  1. User directory table rendered on screen showing mock users with search functionality.
  2. Role & Permission matrix component rendered showing mapped access rules.
  3. User role assignment modal opens, updates selected user's role badge, and closes.

**Plans:** 3 plans

Plans:

- [ ] 02-01: Implement User Directory table (RBAC-01).
- [ ] 02-02: Implement Role & Permission Matrix (RBAC-02).
- [ ] 02-03: Implement User Role Assignment modal form (RBAC-03).

### Phase 3: Dashboard Vitals

**Goal:** Build overview metrics cards and server status dashboard widgets.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** [DASH-01]
**Success Criteria** (what must be TRUE):

  1. Dashboard summary cards displaying Total Users, Active Roles, Active Sessions, and API Traffic render on screen.

**Plans:** 1 plan

Plans:

- [ ] 03-01: Build Dashboard overview metrics cards (DASH-01).

## Progress

Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1 | 2/2 | Complete    | 2026-06-22 |
| 2 | 0/3 | Not started | - |
| 3 | 0/1 | Not started | - |

---
*Roadmap defined: 2026-06-22*
*Last updated: 2026-06-22 after initialization*
