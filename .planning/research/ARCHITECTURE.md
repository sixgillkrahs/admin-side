# Architecture Research

**Domain:** Admin Portal Go Backend Integration
**Researched:** 2026-06-23
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌──────────────┐  ┌─────────────┐             │
│  │  Views  │  │ Common Layout│  │ Modals      │             │
│  │ (Dash,  │  │ (Header,     │  │ (Edit/Create│             │
│  │  RBAC)  │  │  Sidebar)    │  │  Role)      │             │
│  └────┬────┘  └──────┬───────┘  └──────┬──────┘             │
│       │              │                 │                    │
├───────┴──────────────┴─────────────────┴────────────────────┤
│                  State & Data Access Layer                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   TanStack Query                    │    │
│  │    (Custom Hooks: useUsers, useRoles, usePolicies)  │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                     Auth Context                    │    │
│  │       (JWT token, User Profile, activeTab state)    │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                Network & Service Integration                │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌────────────────────────────────┐  │
│  │ Axios HTTP Client  │  │ WebSocket Listener Service     │  │
│  │ (JWT Interceptors) │  │ (Real-time updates broker)     │  │
│  └─────────┬──────────┘  └──────────────┬─────────────────┘  │
└────────────┼────────────────────────────┼───────────────────┘
             │ (REST / JSON)              │ (WS Protocol)
             ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Go Backend Engine                        │
│   (Gin Router, Middleware, GORM / Postgres, Redis Cache)    │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `Axios Client` | Handles network requests, automatically injecting JWT Bearer tokens and intercepting 401 Unauthorized responses to perform cleanup. | Single Axios instance in `src/api/client.ts` with request/response interceptors. |
| `Auth Context & Hook` | Tracks authenticated state, stores JWT in LocalStorage, fetches current user profile metadata, and handles login/logout triggers. | React Context and a custom `useAuth` hook wrapping TanStack Query mutations. |
| `TanStack Query Client` | Manages server state caching, background refetching, query invalidation, and request deduplication. | Global `QueryClient` initialized in `src/lib/query-client.ts`, wrapping the React app root. |
| `RBAC Custom Hooks` | Abstract API requests into React-friendly query and mutation hooks, returning typed data and operational states (loading, error). | Custom hooks in `src/features/rbac/hooks/` (e.g. `useRbacUsers`, `useRbacRoles`, `useRbacPolicies`). |
| `WebSocket Service` | Manages a persistent WebSocket connection to receive backend push events (e.g., dynamic audit logs, role updates) and updates client state. | A singleton listener class in `src/services/websocket.ts` with connection health checks and custom event emitter. |
| `RBAC UI Components` | Present the table lists, matrix tables, and modal dialogs, binding user actions to query queries and mutation triggers. | Shadcn tables, select dropdowns, and forms in `src/features/rbac/components/`. |

## Recommended Project Structure

```
frontend/admin-side/src/
├── api/
│   ├── client.ts             # Global Axios instance configured with JWT & 401 interceptors
│   └── index.ts              # Global API helper methods
├── components/
│   ├── common/               # Layout components (Header, Sidebar, Layout)
│   └── ui/                   # Shadcn UI primitives (button, input, select, dialog)
├── features/
│   ├── auth/
│   │   ├── api/              # Authentication-specific API calls (login, getProfile)
│   │   ├── components/       # LoginScreen UI layout
│   │   ├── hooks/            # useAuth hook managing local credentials state
│   │   └── index.ts          # Auth entry exports
│   ├── dashboard/
│   │   ├── components/       # Dashboard metrics widgets
│   │   └── index.ts          # Dashboard entry exports
│   └── rbac/
│       ├── api/              # RBAC-specific API calls (users, roles, permissions, policies)
│       ├── components/       # UserDirectory, PermissionMatrix, AuditLogsFeed, modals
│       ├── hooks/            # TanStack Query custom hooks (useRbacUsers, useRbacRoles)
│       ├── types/            # TypeScript interface definitions aligned with Go schema models
│       └── index.ts          # RBAC module entry exports
├── hooks/
│   └── use-mobile.ts         # Generic UI viewport hook
├── lib/
│   ├── i18n.ts               # Localized translations setup
│   ├── query-client.ts       # Global QueryClient and default configurations
│   └── utils.ts              # Tailwind CSS class merging utilities
├── services/
│   └── websocket.ts          # Global WebSocket listener for real-time state synchronization
├── App.tsx                   # Orchestrates layout, state-based routing and providers
└── main.tsx                  # Mounts the application inside QueryClientProvider and AuthProvider
```

### Structure Rationale

- **`src/api/`:** Centralizing the HTTP client configuration ensures a single location for base URL updates, headers, request timing out, and interceptor behaviors.
- **`src/features/*/api/`:** Co-locating feature-specific API calls alongside the components and hooks that consume them aligns with vertical slice architecture, improving modularity and searchability.
- **`src/features/rbac/hooks/`:** Abstracting queries and mutations into hooks keeps UI components clean and readable, keeping raw API handling out of markup files.
- **`src/services/`:** Isolating long-lived network services (like WebSockets) prevents duplicate connections and allows standard integration with global query invalidations.

## Architectural Patterns

### Pattern 1: Axios Request/Response Interceptors for JWT & 401 Management

**What:** Injects the authentication token into every outgoing request automatically and intercepting response errors to trigger auth cleanup on 401 Unauthorized.
**When to use:** Required for all secure communications where resource protection middleware is active on the Go backend.
**Trade-offs:** Centralizes route-guarding logic cleanly, but must handle local storage carefully to avoid inconsistencies.

**Example:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Trigger a global custom event to update application auth states
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Pattern 2: Declarative Query Invalidation on Mutation Success

**What:** Instructs TanStack Query to mark cache segments as stale after performing an update, causing dependent components to automatically refetch fresh data.
**When to use:** On all POST, PUT, and DELETE operations targeting users, roles, resources, policies, or mapping entries.
**Trade-offs:** Eliminates complex manual reactive array mapping code, but incurs an extra HTTP GET call on success (mitigated by fast indexing on Go-Postgres).

**Example:**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: number }) => {
      const response = await api.post(`/users/${userId}/roles`, { role_id: roleId });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both users list and audit logs
      queryClient.invalidateQueries({ queryKey: ['rbac', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['rbac', 'logs'] });
    },
  });
};
```

### Pattern 3: Centralized WebSocket Event Broker

**What:** A class singleton managing a single connection to the backend WebSocket server, routing incoming real-time notifications to trigger cache refreshes.
**When to use:** Keeping multiple open client views in sync (such as live audit feeds or changes made by other admins).
**Trade-offs:** Minimizes connection count and keeps event listeners organized, but depends on structured event payloads from the Go backend.

**Example:**
```typescript
import { QueryClient } from '@tanstack/react-query';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private queryClient: QueryClient;
  private reconnectAttempts = 0;

  constructor(url: string, queryClient: QueryClient) {
    this.url = url;
    this.queryClient = queryClient;
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleEvent(message);
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    this.socket.onclose = () => {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts++), 10000);
      setTimeout(() => this.connect(), delay);
    };
  }

  private handleEvent(message: { type: string; payload: any }) {
    switch (message.type) {
      case 'AUDIT_LOG_ADDED':
        this.queryClient.invalidateQueries({ queryKey: ['rbac', 'logs'] });
        break;
      case 'POLICY_UPDATED':
        this.queryClient.invalidateQueries({ queryKey: ['rbac', 'roles'] });
        this.queryClient.invalidateQueries({ queryKey: ['rbac', 'policies'] });
        break;
      default:
        break;
    }
  }
}
```

## Data Flow

### Request Flow

```
[User interacts with RBAC table]
     ↓
[Custom Query/Mutation Hook (useRbacUsers)]
     ↓ (triggers)
[TanStack Query (mutates/fetches)]
     ↓ (calls fetcher)
[API Service Layer (src/features/rbac/api)]
     ↓ (uses)
[Axios Client (injects JWT via interceptor)]
     ↓ (HTTP Request)
[Go Backend API (Gin Auth & RBAC Middleware)]
     ↓ (queries)
[Postgres Database]
```

### State Management

```
┌────────────────────────────────────────────────────────┐
│                      Query Cache                       │
│  ['rbac', 'users']  ['rbac', 'roles']  ['rbac', 'logs']│
└───────────────────────────▲────────────────────────────┘
                            │ (invalidate)
┌───────────────────────────┴────────────────────────────┐
│                    Zustand/Auth Store                  │
│          token: string | null, userProfile: User       │
└───────────────────────────▲────────────────────────────┘
                            │ (dispatch / mutate)
┌───────────────────────────┴────────────────────────────┐
│                      UI Components                     │
│    UserDirectory  PermissionMatrix  AuditLogsFeed      │
└────────────────────────────────────────────────────────┘
```

### Key Data Flows

1. **Authentication State Propagation:**
   Upon successful login mutation, the response JWT and user profile data are saved. The global authorization store sets `isLoggedIn = true` and updates headers. If Axios encounters a `401 Unauthorized` during any endpoint fetch, it clears the token and triggers a route redirection to the Login Screen.
2. **RBAC Table Synchronization:**
   The `UserDirectory` component loads data via the `useRbacUsers` query hook. When the admin reassigns a user's role in the `EditRoleModal`, it runs the `useAssignRole` mutation. On success, the cache for key `['rbac', 'users']` is invalidated, prompting a background refetch that updates the tables seamlessly without full page refreshes.
3. **Real-time Event Refresh:**
   The backend publishes change events on user, policy, or role mutations. The WebSocket Service listens for these events and dispatches invalidations directly into TanStack Query, refreshing tables on all other concurrent admin panels automatically.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Simple state-based tab routing, default Axios interceptors, in-memory React Query caching is fully sufficient. |
| 1k-100k users | Implement pagination (cursor-based for logs, offset-based for directories) to keep DOM tree size and payload sizes light. |
| 100k+ users | Use optimistic UI updates for mutations, split bundle builds using lazy-loading for code paths like RBAC features, offload WebSocket connection scaling to a message broker (e.g. Redis pub/sub). |

### Scaling Priorities

1. **Audit Logs Volume:** Live audit logging can quickly bloat client DOM trees. Refactor the `AuditLogsFeed` to render virtual lists and limit active memory cache array sizes.
2. **Permission Matrix Resolution:** Fetching every user's dynamic policy rules can cause nested iteration overhead. Flatten policy mappings on the server, returning optimized permission key-value objects.

## Anti-Patterns

### Anti-Pattern 1: Direct API Call Inlining in UI Components
**What people do:** Running raw `fetch` or `axios` operations inside component `useEffect` blocks.
**Why it's wrong:** Leads to code duplication, breaks separation of concerns, and bypasses cache capabilities.
**Do this instead:** Wrap all requests in central API methods under `features/*/api` and consume them via TanStack Query custom hooks.

### Anti-Pattern 2: Dynamic Local State Copying
**What people do:** Synchronizing data fetched from query keys into local `useState` arrays to manipulate locally.
**Why it's wrong:** Introduces source-of-truth conflicts, synchronization bugs, and layout lag.
**Do this instead:** Depend directly on the query state (`data`, `isLoading`, `error`) and use mutations to update server status, invalidating the cache to refresh data.

### Anti-Pattern 3: Nested Component Sockets
**What people do:** Opening separate WebSocket connections from individual feed widgets.
**Why it's wrong:** Multiplies backend socket connections unnecessarily, leading to connection exhaustion.
**Do this instead:** Maintain a singleton connection wrapper service that handles routing and distributes messages internally.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `Go REST API` | Axios HTTP Client wrapper | Intercepts all requests to add JWT tokens and handles CORS preflight requirements. |
| `Go WebSocket Gateway` | Persistent WebSocket socket listener | Listens on `/api/v1/ws` or `/ws` for dynamic event synchronization. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `Auth Feature ↔ RBAC Feature` | Shared React Context / Event bus | Auth state handles token validation, which gates mounting or querying RBAC data. |
| `WebSocket Service ↔ Query Client` | Direct execution | WebSocket triggers invalidations directly on the QueryClient to invoke queries. |

## Sources

- [TanStack Query (React Query) Documentation v5](https://tanstack.com/query/latest)
- [Axios Interceptors Guide](https://axios-http.com/docs/interceptors)
- [RFC 6750: The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)

---
*Architecture research for: Admin Portal Go Backend Integration*
*Researched: 2026-06-23*
