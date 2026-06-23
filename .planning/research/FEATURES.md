# Feature Research

**Domain:** Dashboard & RBAC Admin Control Panel (Go Backend API Integration)
**Researched:** 2026-06-23
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Backend-Driven Authentication | Secures the dashboard and maps user sessions using JSON Web Tokens. | MEDIUM | Calls POST `/api/v1/auth/login`. Returns JWT token and User info. Extracted and validated via Go Gin auth middleware. |
| Session Hijacking Prevention (IP Lock) | Ensures that a hijacked token cannot be used from a different client location. | LOW | Backend checks `claims.IP != currentIP` and returns `401 Unauthorized` with `{"error": "Session invalidated: client IP changed"}`. |
| API-Driven User Directory | View, search, and manage platform users with database-backed data. | MEDIUM | Performs pagination (`page`, `limit`), remote sorting (`sort_by`, `sort_order`), and server-side filtering (`search`, `role`, `status`) via SQL queries. |
| Dynamic RBAC Assignment | Basic administrative control to change permissions for individual users. | LOW | Maps users to dynamic roles using POST/DELETE `/api/v1/users/:id/roles` with dynamic database write. |
| Permission Grid Editor | Visual matrix to view and toggle dynamic permission policies. | MEDIUM | Compiles dynamic matrix from `/api/v1/roles`, `/api/v1/resources`, `/api/v1/actions` and `/api/v1/policies`. |
| Dynamic Access Policy Synchronization | Persists dynamic policy overrides immediately to the database. | MEDIUM | Toggling cells fires POST `/api/v1/policies` (enable) or DELETE `/api/v1/policies/:id` (disable) to update system policies on the fly. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Live Security Audit Logs | Real-time observability of administrative actions and authentication events. | HIGH | Handled via Server-Sent Events (SSE) `/api/v1/audit/stream` or WebSockets, sending live payloads of admin operations. |
| Live Stream Reconnection Indicators | High reliability UI tracking the feed health without user interaction. | LOW | Status indicator (`Connected`, `Reconnecting`, `Disconnected`) using custom exponential backoff retries. |
| Ingestion Backpressure Management | Prevent browser UI lag and crash under heavy stream throughput. | MEDIUM | Employs buffered queueing (batched state updates via timer) and sliding window limits (max 100 items in state). |
| SVG Access Control Tree | Visual map of hierarchical role inheritances and paths. | HIGH | D3 or React-Flow SVG graph displaying path representations of policies. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Inline Permission Overrides | Quick override to assign a custom permission straight to a specific user. | Violates RBAC standards, bypasses role hierarchy, results in high security debt, and breaks simple auditing. | Create a dedicated micro-role for that specific user's requirements and assign it. |
| Direct DB Console | Modify Postgres DB tables/records directly from the browser admin panel. | Bypasses backend API business logic, database constraints, verification middlewares, and security logs. | Create dedicated, validated admin API endpoints that record actions in the security logs. |
| Continuous API Polling | Achieve "real-time" feeds by querying endpoints like `/policies` or `/logs` every few seconds. | Causes massive database load, wastes network bandwidth, and doesn't scale for active systems. | Implement Server-Sent Events (SSE) or WebSockets to push changes from the server only when they happen. |

## Feature Dependencies

```text
[Dynamic RBAC Assignment]
    └──requires──> [Role Directory API]
                       └──requires──> [Permission/Policy Directory]
                                          └──requires──> [Database Migration]

[Live Security Audit Feed] ──enhances──> [Dynamic RBAC Assignment]
```

### Dependency Notes

- **Dynamic RBAC Assignment requires Role Directory API:** Changing a user's role requires endpoints to list and assign available roles (POST/DELETE `/api/v1/users/:id/roles`).
- **Role Directory API requires Permission/Policy Directory:** Roles cannot be created or configured without queryable resource and action definitions.
- **Permission/Policy Directory requires Database Migration:** Storing dynamic policies, actions, resources, and user-role relations requires tables (`roles`, `resources`, `actions`, `policies`, `user_roles`) to be set up.
- **Live Security Audit Feed enhances Dynamic RBAC Assignment:** Streaming audit events in real-time provides immediate, visible confirmation of administrative actions.

## MVP Definition

### Launch With (v1)

- [ ] **Backend-Driven Authentication Flow** — POST `/api/v1/auth/login` integration with state persistence (Zustand) and IP lock checking.
- [ ] **API-Driven User Directory** — Implement server-side pagination, remote sorting, and query-based filtering on the user list table.
- [ ] **Dynamic RBAC Assignment** — Support assignment and revocation of roles on users via backend API sync.
- [ ] **Dynamic Access Policy Synchronization** — Connect the `PermissionMatrix` grid to the backend policies REST API.

### Add After Validation (v1.x)

- [ ] **Live Security Audit Logs** — Stream real-time log events to the dashboard using SSE.
- [ ] **Reconnection & Backpressure Ingestion** — Handle connection states and implement buffered updates to protect React render performance.

### Future Consideration (v2+)

- [ ] **SVG Access Control Tree** — Interactive visual model for permission mapping.
- [ ] **RBAC Simulator (Policy Tester)** — Dynamic policy trial module for staging permissions.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Backend-Driven Authentication | HIGH | MEDIUM | P1 |
| API-Driven User Directory | HIGH | MEDIUM | P1 |
| Dynamic RBAC Assignment | HIGH | LOW | P1 |
| Dynamic Access Policy Synchronization | HIGH | MEDIUM | P1 |
| Live Security Audit Logs | HIGH | HIGH | P2 |
| Reconnection & Backpressure Ingestion | MEDIUM | MEDIUM | P2 |
| SVG Access Control Tree | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch (core integration)
- P2: Should have, add when possible (observability)
- P3: Nice to have, future consideration (visual/simulator tool)

## Competitor Feature Analysis

| Feature | Competitor A (Keycloak) | Competitor B (Casbin Dashboard) | Our Approach |
|---------|-------------------------|---------------------------------|--------------|
| Auth Flow | OpenID Connect / OAuth2 redirects. Complex but standard. | Basic session credentials or custom JWT mapping. | Simple IP-locked JWT, verified at middleware level, with direct fallback redirection on token IP mismatch. |
| User Directory | Paginated, filterable database. Heavy directory structure. | Remote pagination with backend adapter hooks. | Simple query-param mapping (`page`, `limit`, `sort_by`, `sort_order`, `search`) mapping directly to Postgres GORM queries. |
| RBAC Sync | Complex client scope, client role, and group mapping models. | Direct Casbin policy file updates or database adapter writes. | Relies on REST APIs (`POST/DELETE` policies) mapping to structured tables, matching our lightweight Go model. |
| Live Audit Logs | Offers event listener plugins pushing to files, database, or JBoss logs. | Basic log table, reload-driven. | Lightweight Server-Sent Events (SSE) stream (`/api/v1/audit/stream`) with frontend queue batching for performance. |

## Sources

- [Go Gin Scaffold Codebase (router.go, auth.go, rbac.go)](file:///d:/works/business-chat/backend)
- [Microsoft Fetch-Event-Source Documentation](https://github.com/Azure/fetch-event-source)
- [OWASP Session Management Cheat Sheet (IP Locking Security)](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [React Render Optimization and Backpressure Strategies](https://react.dev/reference/react/transition)
