# Requirements: admin-side

**Defined:** 2026-06-22
**Core Value:** Enable secure, clear, and efficient administration of the platform, specifically focusing on user roles and permissions management (RBAC).

## v1 Requirements

### Structure & Foundation

- [x] **STRUCT-01**: Create a feature-based folder structure inside `src/features/` (for modular page segregation).
- [x] **STRUCT-02**: Initialize `src/components/common/` directory for shared navigation shells (Sidebar, Header).

### Dashboard Vitals

- [ ] **DASH-01**: Render Overview KPI summary cards displaying Total Users, Active Roles, Active Sessions, and API Traffic.

### Internationalization (i18n)

- [ ] **I18N-01**: Implement multi-language support (English and Vietnamese) for all text resources, UI strings, and navigation layouts, including a language toggle switch in the Header.

### RBAC Access Management

- [x] **RBAC-01**: Render a searchable, paginated User Directory Table containing profiles, user status, and role badges.
- [x] **RBAC-02**: Render a Role & Permission Matrix displaying all available roles and their granular access claims.
- [x] **RBAC-03**: Form/Modal window to assign and update roles for a selected user.

## v2 Requirements

### Dashboard Vitals

- **DASH-02**: Interactive Recharts graphs displaying platform traffic trends.

### RBAC Access Management

- **RBAC-04**: Role Creation and Permission Policy Editor form to register custom roles.

### Security & Auditing

- **AUDIT-01**: Real-time websocket audit log feed displaying admin operations.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Go backend API endpoints | Handled in the backend microservice codebase. |
| Per-user inline permission overrides | Violates RBAC best practices, introduces security debt, and breaks permission audit trails. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| STRUCT-01 | Phase 1 | Complete |
| STRUCT-02 | Phase 1 | Complete |
| DASH-01 | Phase 3 | Pending |
| I18N-01 | Phase 3 | Pending |
| RBAC-01 | Phase 2 | Complete |
| RBAC-02 | Phase 2 | Complete |
| RBAC-03 | Phase 2 | Complete |

**Coverage:**

- v1 requirements: 7 total
- Mapped to phases: 7
- Unmapped: 0

---
*Requirements defined: 2026-06-22*
*Last updated: 2026-06-22 after initialization*
