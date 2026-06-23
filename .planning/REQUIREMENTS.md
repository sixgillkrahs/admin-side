# Requirements: admin-side (Milestone v3.0)

**Defined:** 2026-06-23
**Core Value:** Connect the standalone React administration portal to the Go backend API service for auth, RBAC, and real-time security audit logging.

## v1 Requirements

### Authentication & Sessions

- [ ] **API-01**: User can log in with email and password via POST `/api/v1/auth/login` to retrieve JWT access token and user info, persisted in Zustand memory.
- [ ] **API-02**: User session includes client IP checking. Frontend detects `401 Unauthorized` token failures (caused by token expiration or backend IP lock mismatch), clears the Zustand auth store, and redirects to the login screen with localized warnings.

### User Directory

- [ ] **API-03**: User can view User Directory query results loaded from `GET /api/v1/users` supporting page parameters (`page`, `limit`), remote sorting (`sort_by`, `sort_order`), and search/filter strings (`search`, `role`, `status`).

### Access Control (RBAC)

- [ ] **API-04**: User can assign and revoke user roles dynamically via POST/DELETE `/api/v1/users/:id/roles` which triggers query cache invalidations for the user list.
- [ ] **API-05**: User can view the dynamic Access Policy Matrix rendered from `/api/v1/roles`, `/api/v1/resources`, `/api/v1/actions`, and `/api/v1/policies`.
- [ ] **API-06**: User can toggle individual matrix cells to add/remove dynamic policies (POST/DELETE `/api/v1/policies`) with backend casbin database persistence.
- [ ] **API-07**: User can create new custom roles via POST `/api/v1/roles` to persist them dynamically in the backend DB, updating matrix columns.

### Security Audit Feed

- [ ] **API-08**: User can observe real-time audit log event feeds streamed from the backend SSE route `/api/v1/audit/stream` using EventSource polyfilled with custom authorization headers.
- [ ] **API-09**: User can track live feed connection health via visual status widgets (`Connected`, `Reconnecting`, `Disconnected`), with automated exponential backoff reconnect logic.
- [ ] **API-10**: Ingestion backpressure management (sliding window capped at 100 items, buffered log queue updates) prevents UI rendering freezes during heavy log output.

## v2 Requirements

### Advanced Access Control

- **API-11**: SVG Access Control Tree mapping role hierarchy visually.
- **API-12**: RBAC Policy Simulator (Policy Tester playground).

## Out of Scope

| Feature | Reason |
|---------|--------|
| Go backend database clustering | Handled at infrastructural level by DevOps. |
| Third-party OAuth2/OIDC provider | Standalone credentials authentication is sufficient for v3.0. |
| CASBIN backend engine optimization | Backend service Casbin engine tuning is out of scope for frontend integration. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| API-01 | Phase 9 | Pending |
| API-02 | Phase 9 | Pending |
| API-03 | Phase 10 | Pending |
| API-04 | Phase 10 | Pending |
| API-05 | Phase 11 | Pending |
| API-06 | Phase 11 | Pending |
| API-07 | Phase 11 | Pending |
| API-08 | Phase 12 | Pending |
| API-09 | Phase 12 | Pending |
| API-10 | Phase 12 | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-23*
*Last updated: 2026-06-23 after v3.0 milestone initialization*
