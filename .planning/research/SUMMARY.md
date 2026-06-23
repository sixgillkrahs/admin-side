# Project Research Summary

**Project:** Admin Portal & Role-Based Access Control (RBAC) Management
**Domain:** Go Backend & React TypeScript API Integration (Admin Portal)
**Researched:** 2026-06-23
**Confidence:** HIGH

## Executive Summary

The business-chat Admin Portal is a role-based access control (RBAC) administration tool integrated with a Go backend. It is designed to allow administrators to manage users, roles, permissions, dynamic access policies, and observe administrative actions via real-time security audit logs. Experts build such admin interfaces using single-page application (SPA) architectures on React, separating UI-centric views and client session states from the backend APIs, which strictly enforce business logic and permission validations.

The recommended approach for this project is to leverage a React 19 and Vite-based frontend structured around a vertical "feature-based" architecture. In-memory authentication state is managed globally using Zustand, with token refresh flows handled via a secure, HttpOnly, SameSite=Strict cookie pattern. Asynchronous server-state management is coordinated using TanStack Query. Real-time audit logs are streamed to the frontend via Server-Sent Events (SSE) (using a polyfilled EventSource client for custom Authorization headers) or a single-connection WebSocket event broker.

The key technical risks identified during research are: (1) CORS errors during local development across different ports, which must be resolved using strict Gin CORS middleware; (2) token refresh race conditions when concurrent requests fail, which require a queue-and-retry locking interceptor in Axios; (3) database and connection resource exhaustion from unmounted components leaking WebSocket/SSE streams; and (4) casing differences (camelCase vs snake_case) leading to serialization bugs between Go and TypeScript, mitigated by explicit JSON tags and code generation.

## Key Findings

### Recommended Stack

The stack is centered on React 19, Vite, and TypeScript to ensure type safety, fast builds, and high-performance rendering. The networking layer uses Axios for structured HTTP client features, coupled with TanStack Query (v5) to manage queries, mutations, cache invalidation, and data rehydration, removing complex asynchronous state code from UI views. Global client states, such as authentication and theme, are managed using a lightweight Zustand store.

**Core technologies:**
- **Axios (`^1.7.9`)**: Promise-based HTTP client — Provides request/response interceptors to automatically inject authorization headers and globally catch `401 Unauthorized` token failures.
- **TanStack React Query (`^5.62.0`)**: Asynchronous server-state management — Handles API caching, request deduplication, loading/error states, and automated query invalidation on mutation success.
- **Zustand (`^5.0.1`)**: Lightweight global state management — Safely manages in-memory authentication states (volatile JWT, user profile metadata) and UI settings (sidebar state, theme) without boilerplate.
- **Server-Sent Events (SSE) (Native API)**: Unidirectional real-time audit log streaming — Provides lightweight, HTTP/2-compatible streaming of audit log events from the Go API.
- **event-source-polyfill (`^1.0.31`)**: Polyfilled EventSource client — Allows passing custom Authorization headers during the SSE connection handshake.
- **Mock Service Worker (MSW) (`^2.x`)**: Network-level API mocking — Enables rapid frontend development and integration testing of the user directory and permission matrix before the backend is fully deployed.

### Expected Features

The feature landscape covers core administrative utilities, real-time observability, and high-security session management to prevent unauthorized escalations.

**Must have (table stakes):**
- **Backend-Driven Authentication (with IP Lock)** — Secures the dashboard by mapping user sessions using JWTs; if a user's client IP changes mid-session, the backend invalidates the token to prevent session hijacking.
- **API-Driven User Directory** — A searchable, filterable data table that supports remote server-side pagination and sorting.
- **Dynamic RBAC Assignment** — Allows admins to assign or revoke user roles on the fly via POST/DELETE API endpoints.
- **Dynamic Access Policy Matrix & Sync** — A visual grid mapping roles to permissions (resources and actions) that immediately synchronizes updates (POST/DELETE policies) with the database.

**Should have (competitive):**
- **Live Security Audit Logs Feed** — A real-time stream of administrative actions and authorization events pushed from the server.
- **Live Stream Reconnection & Status Indicators** — High-reliability connection state tracking in the UI with automated exponential backoff reconnects.
- **Ingestion Backpressure Management** — Buffered state queues and sliding window limits (capping view at 100 items) to prevent UI freezes during high log throughput.

**Defer (v2+):**
- **SVG Access Control Tree** — An interactive hierarchical graph (using D3 or React-Flow) mapping role inheritance and policies.
- **RBAC Policy Simulator** — A permission playground module that allows administrators to dry-run and test policy combinations.

### Architecture Approach

The application uses a Client-Side Single Page Application (SPA) architecture utilizing a modular, vertical **feature-based folder structure** (e.g., `features/auth`, `features/rbac`). This ensures that presentation layers, custom hooks, API calls, and type definitions are co-located within self-contained modules, exposing clean public entry points. A global Axios instance handles JWT injection and `401` interceptors, while a centralized broker coordinates real-time events.

**Major components:**
1. **Presentation Layer (Shadcn UI + Custom Components)**: Renders the layout, directories, modals (e.g. `EditRoleModal`), and matrices (`PermissionMatrix`).
2. **State & Hook Layer (Zustand + TanStack Query)**: Encapsulates asynchronous API states inside custom hooks (e.g., `useRbacUsers`, `useRbacPolicies`) and holds volatile credentials in-memory.
3. **Network Service Layer (Axios Interceptors + EventSource/WebSocket Broker)**: Manages outgoing HTTP requests, JWT injection, automatic token refreshes, and incoming live feeds.
4. **Go Backend Engine (Gin Router + Middleware + Postgres/GORM)**: Validates sessions, checks permissions, streams audit logs, and handles DB updates.

### Critical Pitfalls

1. **CORS Failures and Preflight Blocks** — Configure explicit, non-wildcard origins (e.g., `http://localhost:5173`) in the backend Gin CORS middleware, enabling credentials and exposing custom headers to resolve cross-origin blocks.
2. **Token Refresh Race Conditions** — Implement an Axios interceptor queuing mechanism that locks the refresh flow. When multiple parallel requests fail with `401`, only a single request is sent to `/auth/refresh` while subsequent failed requests are queued and retried upon successful token rotation.
3. **WebSocket/SSE Connection Leaks** — Clean up all EventSource/WebSocket connections and event handlers inside the return cleanup function of React's `useEffect` hook to prevent Go backend file descriptor exhaustion.
4. **JSON Serialization Casing Mismatches** — Explicitly annotate Go structs with `snake_case` tags (`json:"user_id"`) and utilize automated code generators (like `openapi-typescript`) to synchronize types with TypeScript interfaces.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation, Auth & API Integration
**Rationale:** Establishes the core skeleton, API client configuration, and auth flows (the foundational dependency for all secure requests).
**Delivers:** Global routing layout, styled sidebar/header, Axios interceptor setups, in-memory Zustand auth store, and POST `/api/v1/auth/login` integration with IP-lock checking.
**Addresses:** Backend-Driven Authentication, Shell Layout, API client setup.
**Avoids:** CORS issues, initial serialization casing mismatches, and unsecured routes.

### Phase 2: User Directory & Dynamic RBAC Management
**Rationale:** Once authentication is established, we can implement the core database-driven tables and role assignments that form the heart of the administration panel.
**Delivers:** User list with server-side pagination/filtering/sorting, `EditRoleModal` for role mapping, and the `PermissionMatrix` editor syncing policy changes to the database.
**Uses:** TanStack Query, Axios Client, GORM models on Postgres.
**Implements:** Declarative Query Invalidation on Mutation Success (invalidating `['rbac', 'users']` on role change).

### Phase 3: Real-Time Observability & Performance Tuning
**Rationale:** Real-time features require stable APIs and core directories to be useful, and introducing streaming early can lead to debugging complexity.
**Delivers:** SSE/WebSocket client broker setup, live security audit logs feed, connection status indicators, and backpressure ingestion buffers.
**Uses:** `event-source-polyfill` or WebSocket singleton listeners.
**Avoids:** WebSocket connection leaks, DOM performance lag, and redundant server connections.

### Phase Ordering Rationale

- **Dependency Flow**: Security and routing are the foundational prerequisites. The API client must be fully configured with interceptors (Phase 1) before fetching user directories and permissions (Phase 2), which in turn must be operational before streaming administrative actions and auditing them in real-time (Phase 3).
- **Architecture Cleanliness**: Features are grouped around their architectural patterns (HTTP REST client in Phase 1-2 vs. EventSource/WebSocket streams in Phase 3). This lets developers focus on standard CRUD queries before tackling state concurrency and backpressure.
- **Pitfall Mitigation**: Separating real-time features into Phase 3 ensures that connection-leak prevention (`useEffect` cleanup) is addressed and verified under a stable component tree rather than during ongoing layout shifts.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** The native browser EventSource client does not support custom headers. The team needs to evaluate and test `event-source-polyfill` vs. passing tokens in query strings on the Go Gin router backend to ensure secure SSE handshakes.
- **Phase 2:** Large permission matrices can cause heavy DOM rendering loads and redundant database queries. Research is required on flattening Casbin/Postgres policies on the backend and virtualizing the table grid if the system scales.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Configuring Zustand, Axios interceptors, and Gin CORS middleware follows standard, well-documented patterns with low uncertainty.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | The compatibility of React 19, TanStack Query v5, Zustand v5, and Axios is verified and matches standard production-ready patterns. |
| Features | HIGH | Table stakes and differentiators are aligned with the Go Gin backend schemas and business requirements. |
| Architecture | HIGH | Vertical feature-based structures and query invalidation models are widely adopted and proven. |
| Pitfalls | HIGH | CORS, refresh race conditions, connection leaks, and JSON serialization casing are well-documented pitfalls with clear, coded mitigation strategies. |

**Overall confidence:** HIGH

### Gaps to Address

- **SSE Custom Headers**: Standard `EventSource` lacks header support; we must validate that `event-source-polyfill` works flawlessly with the Go Gin auth middleware.
- **Backpressure Ingestion Testing**: Under high audit log throughput, React state updates could lag. We must stress-test the log feed buffer with mock streams.

## Sources

### Primary (HIGH confidence)
- Go Gin Backend codebase (`backend/internal/app/router.go`, `backend/internal/pkg/auth/`, `backend/migrations/`)
- TanStack Query (React Query) v5 Official Documentation
- Axios Interceptors Guide
- OWASP Session Management & WebSocket Security Cheat Sheets

### Secondary (MEDIUM confidence)
- `event-source-polyfill` community usage guides for authenticated SSE streaming
- React 19 Concurrent rendering performance notes (useTransition for state batching)

---
*Research completed: 2026-06-23*
*Ready for roadmap: yes*
