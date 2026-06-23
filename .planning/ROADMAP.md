# Roadmap: admin-side

## Milestones

- ✅ **v1.0 Layout & Access Control Foundation** — Phases 1-3 (shipped 2026-06-23)
- ✅ **v2.0 Features** — Phases 4-6 (shipped 2026-06-23)
- ✅ **v2.1 Login Screen & Authentication UI** — Phases 7-8 (shipped 2026-06-23)
- 🚧 **v3.0 Go Backend API Integration** — Phases 9-12 (planned)

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

<details>
<summary>✅ v2.1 Login Screen & Authentication UI — SHIPPED 2026-06-23</summary>

- [x] Phase 7: Login Layout & Branding Visuals (1/1 plan) — completed 2026-06-23
- [x] Phase 8: Login Forms & Form Validation (1/1 plan) — completed 2026-06-23

</details>

### 🚧 v3.0 Go Backend API Integration (Planned)

- [ ] **Phase 9: Go Backend Auth Integration** - Connect credentials verification, session storage, and client IP checking to the backend API. (planned)
- [ ] **Phase 10: User Directory API & Assignments** - Connect the user list table, remote pagination/sorting/filtering, and dynamic role modifications. (planned)
- [ ] **Phase 11: Dynamic Access Policy Matrix** - Integrate role matrices, permission toggling (Casbin synchronization), and custom role creation. (planned)
- [ ] **Phase 12: Real-Time Observability Audit logs** - Implement Server-Sent Events (SSE) stream client with connection status monitoring and backpressure management. (planned)

## Phase Details

### Phase 9: Go Backend Auth Integration

**Goal:** Connect credentials verification, session storage, and client IP checking to the Go backend API service.
**Mode:** mvp
**Depends on:** Phase 8
**Requirements:** [API-01, API-02]
**Success Criteria** (what must be TRUE):

  1. Submitting valid credentials requests POST `/api/v1/auth/login`, retrieves JWT access token, and stores it in-memory via Zustand.
  2. Frontend automatically catches `401 Unauthorized` token failures (e.g. expiration, IP mismatch), clears the Zustand auth store, and redirects to the login screen with localized warnings.

**Plans:** 2 plans

Plans:

- [ ] 09-01: Connect login credentials verification and token-based session retrieval via POST `/api/v1/auth/login` to Zustand state (API-01).
- [ ] 09-02: Implement client IP verification response handling and centralize `401 Unauthorized` token failure catching to clear session data and redirect to login screen (API-02).

### Phase 10: User Directory API & Assignments

**Goal:** Integrate User Directory queries, server-side pagination, remote sorting/filtering, and role assignments/revocations with the backend.
**Mode:** mvp
**Depends on:** Phase 9
**Requirements:** [API-03, API-04]
**Success Criteria** (what must be TRUE):

  1. The User Directory loads dynamic data from `GET /api/v1/users` and updates correctly when pagination (`page`, `limit`), remote sorting (`sort_by`, `sort_order`), and filters (`search`, `role`, `status`) change.
  2. Modifying user roles (POST/DELETE `/api/v1/users/:id/roles`) updates the backend and invalidates TanStack Query cache to reload the updated list.

**Plans:** 2 plans

Plans:

- [ ] 10-01: Integrate User Directory component with TanStack Query to fetch from `GET /api/v1/users` supporting pagination, remote sorting, and filters (API-03).
- [ ] 10-02: Wire user role assignments and revocations via POST/DELETE `/api/v1/users/:id/roles` to trigger query cache invalidation on the user list (API-04).

### Phase 11: Dynamic Access Policy Matrix

**Goal:** Integrate the permission matrix, custom role creations, and policy cell modifications with backend Casbin persistence.
**Mode:** mvp
**Depends on:** Phase 10
**Requirements:** [API-05, API-06, API-07]
**Success Criteria** (what must be TRUE):

  1. The access control grid dynamically renders roles, resources, actions, and current active policy checkboxes based on backend dynamic payloads.
  2. Toggling individual grid checkboxes triggers immediate POST/DELETE `/api/v1/policies` calls to persist policies in the backend Casbin DB.
  3. The custom role creator dialog saves new roles via POST `/api/v1/roles` and updates the matrix layout instantly.

**Plans:** 3 plans

Plans:

- [ ] 11-01: Dynamically render the permission matrix mapping roles, resources, and actions using backend payloads (API-05).
- [ ] 11-02: Implement cell check toggles connecting to POST/DELETE `/api/v1/policies` endpoints to write or clear Casbin policies (API-06).
- [ ] 11-03: Connect Custom Role creator form submission to POST `/api/v1/roles` for DB persistence and matrix synchronization (API-07).

### Phase 12: Real-Time Observability Audit logs

**Goal:** Integrate real-time audit log stream, connection health widgets, and backpressure ingestion control.
**Mode:** mvp
**Depends on:** Phase 11
**Requirements:** [API-08, API-09, API-10]
**Success Criteria** (what must be TRUE):

  1. The chronological audit log feed streams backend administrative events in real-time from `/api/v1/audit/stream` using EventSource polyfilled with custom headers.
  2. Connection state widgets dynamically transition between Connected, Reconnecting, and Disconnected using exponential backoff logic on drops.
  3. UI frame rate remains stable under high throughput using a sliding window buffer capped at 100 logs.

**Plans:** 3 plans

Plans:

- [ ] 12-01: Setup Server-Sent Events stream feed from `/api/v1/audit/stream` with authorization headers (API-08).
- [ ] 12-02: Build stream health status indicator and custom exponential backoff reconnect logic for SSE drops (API-09).
- [ ] 12-03: Implement state queue backpressure buffering to cap visible logs at 100 items (API-10).

## Progress

Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12

| Phase | Milestone | Plans Complete | Status | Completed |
|---|---|---|---|---|
| 1. Layout & Foundation | v1.0 | 2/2 | Complete | 2026-06-22 |
| 2. User Directory & RBAC Integration | v1.0 | 3/3 | Complete | 2026-06-22 |
| 3. Dashboard Vitals | v1.0 | 3/3 | Complete | 2026-06-23 |
| 4. Interactive Dashboard Graphs | v2.0 | 1/1 | Complete | 2026-06-23 |
| 5. Custom Role Creator | v2.0 | 1/1 | Complete | 2026-06-23 |
| 6. Audit Logs Feed | v2.0 | 1/1 | Complete | 2026-06-23 |
| 7. Login Layout & Branding Visuals | v2.1 | 1/1 | Complete | 2026-06-23 |
| 8. Login Forms & Form Validation | v2.1 | 1/1 | Complete | 2026-06-23 |
| 9. Go Backend Auth Integration | v3.0 | 0/2 | Planned | — |
| 10. User Directory API & Assignments | v3.0 | 0/2 | Planned | — |
| 11. Dynamic Access Policy Matrix | v3.0 | 0/3 | Planned | — |
| 12. Real-Time Observability Audit logs | v3.0 | 0/3 | Planned | — |

---
*Roadmap updated: 2026-06-23 after v3.0 milestone initialization*
