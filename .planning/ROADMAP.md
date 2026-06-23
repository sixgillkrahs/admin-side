# Roadmap: admin-side

## Milestones

- ✅ **v1.0 Layout & Access Control Foundation** — Phases 1-3 (shipped 2026-06-23)
- ✅ **v2.0 Features** — Phases 4-6 (shipped 2026-06-23)
- 🚧 **v2.1 Login Screen & Authentication UI** — Phases 7-8 (in progress)
- 📋 **v3.0 Future Enhancements** — (planned)

## Phases

<details>
<summary>✅ v1.0 Layout & Access Control Foundation — SHIPPED 2026-06-23</summary>

- [x] Phase 1: Layout & Foundation (2/2 plans) — completed 2026-06-22
- [x] Phase 2: User Directory & RBAC Integration (3/3 plans) — completed 2026-06-22
- [x] Phase 3: Dashboard Vitals (3/3 plans) — completed 2026-06-23

</details>

<details>
<summary>✅ v2.0 Features — SHIPPED 2026-06-23</summary>

- [x] Phase 4: Interactive Dashboard Graphs (1/1 plan) — completed 2026-06-23
- [x] Phase 5: Custom Role Creator (1/1 plan) — completed 2026-06-23
- [x] Phase 6: Audit Logs Feed (1/1 plan) — completed 2026-06-23

</details>

### 🚧 v2.1 Login Screen & Authentication UI (In Progress / Planned)

- [x] **Phase 7: Login Layout & Branding Visuals** - Build responsive split-screen wrapper with product branding graphic and localized basic fields. (completed 2026-06-23)
- [ ] **Phase 8: Login Forms & Form Validation** - Implement active form validation, loading states, and redirect routing handler.

## Phase Details

### Phase 7: Login Layout & Branding Visuals

**Goal:** Build responsive split-screen wrapper with product branding graphic and localized basic fields.
**Mode:** mvp
**Depends on:** Nothing (first phase of v2.1)
**Requirements:** [AUTH-01, AUTH-02]
**Success Criteria** (what must be TRUE):
  1. The login route displays a side-by-side split screen on desktop viewports (left side visual branding asset, right side login form).
  2. All text labels, placeholders, titles, and switcher components dynamically translate when toggled.

**Plans:** 1 plan

Plans:
- [x] 07-01: Implement Login page split-screen routing wrapper and localized basic fields (AUTH-01, AUTH-02).

### Phase 8: Login Forms & Form Validation

**Goal:** Implement active form validation, loading states, and redirect routing handler.
**Mode:** mvp
**Depends on:** Phase 7
**Requirements:** [AUTH-03, AUTH-04]
**Success Criteria** (what must be TRUE):
  1. Login form prevents submission and shows validation errors if input email format is incorrect or password is under 6 characters.
  2. Submitting valid credentials displays an animated loading spinner for 1.5 seconds, then redirects the browser context to the Admin Dashboard layout.

**Plans:** 1 plan

Plans:
- [ ] 08-01: Build credentials inputs validation, submit loading state, and redirect routing handler (AUTH-03, AUTH-04).

## Progress

Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Milestone | Plans Complete | Status | Completed |
|---|---|---|---|---|
| 1. Layout & Foundation | v1.0 | 2/2 | Complete | 2026-06-22 |
| 2. User Directory & RBAC Integration | v1.0 | 3/3 | Complete | 2026-06-22 |
| 3. Dashboard Vitals | v1.0 | 3/3 | Complete | 2026-06-23 |
| 4. Interactive Dashboard Graphs | v2.0 | 1/1 | Complete | 2026-06-23 |
| 5. Custom Role Creator | v2.0 | 1/1 | Complete | 2026-06-23 |
| 6. Audit Logs Feed | v2.0 | 1/1 | Complete | 2026-06-23 |
| 7. Login Layout & Branding Visuals | v2.1 | 1/1 | Complete | 2026-06-23 |
| 8. Login Forms & Form Validation | v2.1 | 0/1 | Not started | - |

---
*Roadmap updated: 2026-06-23 after v2.1 milestone initialization*
