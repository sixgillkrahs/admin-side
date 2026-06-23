# Stack Research

**Domain:** Admin Portal & Role-Based Access Control (RBAC) Management  
**Researched:** 2026-06-23  
**Confidence:** HIGH  

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Axios** | `^1.7.9` | Promise-based HTTP client | Provides request/response interceptors essential for handling authorization headers, automatic JSON parsing, request timeouts, and global handling of `401 Unauthorized` token failures. |
| **TanStack React Query** | `^5.62.0` | Asynchronous server-state management | Automatically manages API caching, background synchronization, request deduplication, and state updates (mutations) for dynamic views like the user directory, roles list, and permission matrix. |
| **Zustand** | `^5.0.1` | Lightweight global state management | Manages client-side authentication states (current user profile, token in-memory, login/logout transitions) and basic shell UI settings (sidebar state, theme) with zero boilerplate and hook-based selectors. |
| **Server-Sent Events (SSE)** | Native API | Unidirectional real-time audit log streaming | Enables real-time audit log feeds pushed directly from the Go API. Since audit logging is strictly read-only for clients, SSE is a lighter, simpler, and more robust solution than WebSockets. Gin has native SSE integration. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **jwt-decode** | `^4.0.0` | JWT payload decoding | When the frontend needs to inspect claims (e.g. token expiration `exp`, client IP `ip`, or user ID) in the in-memory access token without verifying its signature. |
| **event-source-polyfill** | `^1.0.31` | Polyfilled EventSource for custom headers | Since standard browser `EventSource` does not support custom headers (e.g., `Authorization: Bearer <token>`), this library allows passing headers during SSE handshakes. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **Mock Service Worker (MSW)** | API mocking library at network level | Ideal for frontend-only development and integration testing of the RBAC screens. Allows mocking roles, user assignments, and real-time SSE streams before backend changes are deployed. |
| **Vite** | Frontend build tool and dev server | Already configured in the project. It provides fast HMR (Hot Module Replacement) and optimized bundling. |

---

## Installation

```bash
# Core
npm install axios @tanstack/react-query zustand

# Supporting
npm install jwt-decode event-source-polyfill

# Dev dependencies
npm install -D msw
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Axios** | Fetch API | For lightweight, simple client integrations where custom interceptors, automated timeout handling, and request-level configurations are not required. |
| **Server-Sent Events (SSE)** | WebSockets | If bidirectional communication is required (e.g., if the client needs to send live commands, messages, or acknowledgments over the same persistent channel). |
| **Zustand** | Redux Toolkit (RTK) | If the application grows extremely large with hundreds of complex, interdependent state mutations, requiring structured middleware like Redux Saga, or standard developer conventions. |
| **In-Memory JWT + HttpOnly Cookie** | LocalStorage Storage | If deployment domains differ completely (e.g. cross-domain API without a proxy or backend-supported cookie domain sharing) and XSS mitigations (strict CSP/headers) are fully configured. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **LocalStorage for Access Tokens** | Storing JWTs directly in `localStorage` exposes them to Cross-Site Scripting (XSS) attacks. If any third-party script or dependency is compromised, the token can be exfiltrated. | Store the short-lived JWT in-memory (Zustand state) and use a Secure, HttpOnly, SameSite=Strict cookie for session persistence (Refresh Token). |
| **WebSockets for Audit Logs** | WebSockets require a protocol upgrade (ws/wss), custom ping/pong heartbeats, and complex connection state handling. Overkill for unidirectional server-to-client streaming. | Server-Sent Events (SSE) which operate over standard HTTP/2, natively handle reconnection, and use built-in browser APIs. |
| **React Context for API State Caching** | React Context lacks request deduplication, cache invalidation policies, background sync, and pagination optimization, leading to inefficient API usage and frequent re-renders. | TanStack React Query. |

---

## Technical Implementation Patterns

### 1. HTTP Client Configuration (Axios + TanStack Query)
Axios handles the underlying HTTP transport, request timeout, and credentials, while TanStack Query wraps the calls to manage query state, cache invalidation, and mutation.

**Axios Client Instance (`src/lib/api.ts`)**:
```typescript
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the current JWT from Zustand to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiration / unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear store to redirect user to login
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);
```

---

### 2. Authentication State Management (Zustand)
Global authentication state is held in-memory via Zustand. This separates UI state and volatile tokens from permanent browser storage, protecting against XSS.

**Zustand Auth Store (`src/features/auth/store.ts`)**:
```typescript
import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setAuth: (token, user) => set({
    token,
    user,
    isAuthenticated: true
  }),
  clearAuth: () => set({
    token: null,
    user: null,
    isAuthenticated: false
  }),
}));
```

---

### 3. Dynamic Token Storage Pattern
1. **In-Memory JWT Access Token**: The client receives the JWT token from `/api/v1/auth/login` and holds it in the Zustand store. It is never stored in `localStorage` or `sessionStorage`.
2. **HttpOnly Refresh Cookie**: When log-in succeeds, the Go backend sets a secure cookie (`Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh`).
3. **Session Rehydration**: On application startup or page refresh, the frontend calls the `/api/v1/auth/refresh` endpoint. Since the browser automatically sends the cookie, the server verifies it, checks if the client IP matches the active session (IP lock), and returns a fresh short-lived JWT Access Token.
4. **IP-Mismatch Handling**: Since the Go middleware (`middleware.AuthMiddleware`) checks if the client IP matches the IP embedded in the JWT claims, any IP shift triggers a `401 Unauthorized` response. The Axios interceptor captures this, clears the Zustand store, and prompts user re-authentication.

---

### 4. Real-time Audit Logging (SSE vs WebSockets)
Since audit logging is read-only for the client, Server-Sent Events (SSE) are selected over WebSockets.

**Authentication Challenge with SSE**:
Native browser `EventSource` does not support custom HTTP headers (such as `Authorization: Bearer <token>`). To authenticate SSE streams:
1. **Option A (Recommended)**: Use `event-source-polyfill` on the client, which supports sending custom headers.
2. **Option B**: Update the Go authentication middleware to extract tokens from a query parameter (e.g. `c.Query("token")`) for SSE routes.

**React SSE Hook (`src/hooks/useAuditLogs.ts`)**:
```typescript
import { useEffect, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useAuthStore } from '@/features/auth/store';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    setStatus('connecting');

    // Using polyfill to pass headers
    const eventSource = new EventSourcePolyfill('/api/v1/audit-logs/stream', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    eventSource.onopen = () => {
      setStatus('connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const newLog: AuditLog = JSON.parse(event.data);
        setLogs((prev) => [newLog, ...prev].slice(0, 100)); // Cap logs view at 100 items
      } catch (err) {
        console.error('Failed to parse SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      setStatus('disconnected');
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setStatus('disconnected');
    };
  }, [token]);

  return { logs, status };
}
```

---

## Stack Patterns by Variant

**If the backend does not support cookie-based refresh tokens (access token only):**
- Use Zustand with the `persist` middleware configured for `sessionStorage`.
- Because this restricts token lifetime to the tab session (preventing tab-sharing or long-term disk persistence), minimizing the threat window while using additional XSS protections (Content Security Policy).

**If high-concurrency real-time updates are needed on multiple dashboard sections:**
- Use TanStack Query combined with SSE streaming.
- Because SSE events can trigger target query invalidations in TanStack Query (`queryClient.invalidateQueries`), providing real-time data accuracy with minimal server overhead.

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `react@19.2.6` | `zustand@5.0.1` | Zustand v5 fully supports React 19 concurrent features. |
| `react@19.2.6` | `@tanstack/react-query@5.62.0` | React Query v5 is fully compatible with React 19. |
| `axios@1.7.9` | `typescript@~6.0.2` | Axios ships with native types that are compatible with TypeScript 5.x/6.x. |

---

## Sources

- [Vite, React, Tailwind Configuration] — Checked current package dependencies in `frontend/admin-side/package.json` to verify runtime compatibility.
- [Go Gin Router Config] — Checked `backend/internal/app/router.go` and `go.mod` to align authentication requirements (expecting Bearer token, Gin version supports SSE natively).
- [TanStack Query & Zustand Docs] — Verified compatibility matrices for React 19 support.

---
*Stack research for: Admin Portal & Go Backend API Integration*  
*Researched: 2026-06-23*  
