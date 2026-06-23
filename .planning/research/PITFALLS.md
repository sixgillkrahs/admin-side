# Pitfalls Research

**Domain:** Go Backend & React TypeScript API Integration
**Researched:** 2026-06-23
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: CORS Issues with Go Backend on Different Ports

**What goes wrong:**
During development, the React frontend (running by default on `http://localhost:5173` via Vite) is blocked from making API requests to the Go backend (running on `http://localhost:8080`). All cross-origin API calls fail, and custom headers like `Authorization` are stripped or rejected.

**Why it happens:**
Browsers enforce the Same-Origin Policy (SOP). Since the frontend and backend run on different ports, they are treated as distinct origins. If the Go server fails to handle preflight `OPTIONS` requests or returns responses without the appropriate CORS headers, the browser block occurs. Developers often mistakenly use wildcard origins (`*`) while enabling credentials (`AllowCredentials: true`), which is explicitly disallowed by browsers.

**How to avoid:**
Configure CORS middleware in the Go backend using the official `github.com/gin-contrib/cors` library. Do not use wildcards when authentication headers or cookies are required.
```go
import (
	"time"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.New()
	
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	// register routes...
	return r
}
```

**Warning signs:**
- Browser console shows: `Access to fetch at 'http://localhost:8080/...' from origin 'http://localhost:5173' has been blocked by CORS policy`.
- Preflight `OPTIONS` requests returning `404 Not Found` or `405 Method Not Allowed`.

**Phase to address:**
Phase 1 (Initial Setup / API Integration setup)

---

### Pitfall 2: Token Refresh Race Conditions with Concurrent Requests

**What goes wrong:**
When a user's JWT access token expires while they are viewing a dashboard, multiple parallel API requests are fired at once. All of them return `401 Unauthorized`. If each failed request individually triggers a refresh flow, the application makes multiple parallel requests to `/auth/refresh`. Under token rotation schemes, the first request invalidates the refresh token, causing subsequent concurrent refresh requests to fail and trigger an abrupt, unexpected user logout.

**Why it happens:**
Asynchronous API requests are fired concurrently in Single Page Applications. Without a centralized locking or queuing mechanism, Axios interceptors treat each 401 response in isolation.

**How to avoid:**
Implement a refresh locking and queuing mechanism inside the frontend's API client (e.g. Axios interceptors) to ensure only one refresh request is in flight at any given time.
```typescript
import axios from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post('/api/v1/auth/refresh');
        const { accessToken } = response.data;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        processQueue(null, accessToken);
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear session and redirect to login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

**Warning signs:**
- Multiple parallel calls to `/api/v1/auth/refresh` appearing in the network tab.
- Intermittent logouts or 400 Bad Request responses on refresh endpoints when navigating pages.

**Phase to address:**
Phase 2 (Authentication / API Integration hardening)

---

### Pitfall 3: WebSocket Connection Leaks on Component Unmount

**What goes wrong:**
When a user navigates between views, the React components that listen to real-time events unmount. If the WebSocket connections or event listeners are not cleared, they stay active in memory. This leads to duplicate event processing (triggering errors like "Cannot update state on an unmounted component"), client-side memory leaks, and Go server socket/file descriptor exhaustion.

**Why it happens:**
React `useEffect` hooks lack appropriate cleanup functions, or connections are re-established on every component re-render instead of being cached.

**How to avoid:**
Always clean up WebSocket event handlers and close connection instances within the cleanup return statement of the component's `useEffect` hook.
```typescript
import { useEffect, useRef } from 'react';

export function useWebSocket(url: string, onMessage: (data: any) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.onmessage = null;
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, [url, onMessage]);
}
```

**Warning signs:**
- Ever-growing number of open file descriptors or TCP connections on the Go backend.
- Console warnings: `Can't perform a React state update on an unmounted component`.
- Duplicate executions of real-time event handlers.

**Phase to address:**
Phase 3 (Real-time features / WebSockets integration)

---

### Pitfall 4: JSON Serialization Casing Mismatches (snake_case vs camelCase)

**What goes wrong:**
Data sent by the frontend is silently ignored by the backend (resulting in zero-values or validation errors), or data sent by the backend is not parsed correctly by React (resulting in `undefined` variables and empty tables).

**Why it happens:**
Go struct fields must start with an uppercase letter to be exported for JSON marshalling (e.g. `UserID`, `CreatedAt`). By default, Go serializes them using the exact PascalCase name. TypeScript developers default to standard camelCase (`userId`, `createdAt`). Mismatches occur when Go `json` tags are missing or when types are manually typed out with typos.

**How to avoid:**
1. Explicitly tag all Go struct fields with the corresponding `snake_case` (or camelCase) serialization string.
2. Use automated code generators (like `openapi-typescript` or `oapi-codegen`) to generate TypeScript types directly from Go OpenAPI specs.
```go
type UserProfile struct {
	UserID    uint      `json:"user_id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}
```
Matching TypeScript interface:
```typescript
interface UserProfile {
  user_id: number;
  email: string;
  created_at: string;
}
```

**Warning signs:**
- Database writes saving empty values for required fields.
- Frontend rendering blank values for keys like `createdAt` while the network tab shows `created_at` in the payload.

**Phase to address:**
Phase 1 (Initial Setup / API Integration setup)

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Storing raw JWT tokens in local storage | Fast setup; no HTTP-only cookie configuration needed. | Vulnerable to XSS token theft. | Acceptable only in sandbox/MVP environments; never in production. |
| Hardcoding localhost APIs in frontend config | Faster local testing and zero setup. | Broken production deployment; configuration synchronization issues. | Never acceptable. Always use environment variables. |
| Skipping WebSocket heartbeat/ping-pong | Simplifies frontend and backend WebSocket code. | Client connection drops silently without reconnection; server retains dead TCP sockets. | Temporary debugging/internal testing only. |
| Manually writing duplicate TypeScript types | Avoids configuring code-gen tooling. | High maintenance overhead; casing and schema drift bugs. | Acceptable only for very small applications with <5 endpoints. |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Go Gin CORS Middleware | Setting `AllowOrigins: []string{"*"}` with `AllowCredentials: true`. | Restrict `AllowOrigins` to explicit whitelists (e.g., frontend host URLs) in production. |
| Axios Interceptors | Retrying the original request on 401 without updating the `Authorization` header. | Retrieve the new token, update the configuration headers, and then invoke the retry. |
| Gorilla WebSocket | Forgetting to set a read limit or write timeouts on the server side. | Apply `conn.SetReadLimit` and maintain `ReadDeadline`/`WriteDeadline` values on message receipt. |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| WebSocket Connection Accumulation | High server RAM and file descriptor limits exceeded. | Implement connection cleanup and ping/pong heartbeats. | >1,000 active concurrent browser sessions. |
| Infinite Axios Retry Loop | App freezes, spamming Auth Server with requests on expired refresh tokens. | Track retry count per request; break loop and redirect to login on 2nd consecutive failure. | Instantly when the refresh token itself expires. |
| Bulk List Serialization | Slow response payload size; server memory spike on large DB fetches. | Enforce pagination (limit/offset) and select only required fields. | Responses >5MB or queries returning >10,000 records. |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Broad CORS configuration in Production | Malicious sites can issue credentialed requests on behalf of users. | Use strict environment-based origin whitelists. |
| Storing long-lived refresh tokens in JS memory | User session remains vulnerable if state is hijacked. | Store refresh tokens in `HttpOnly`, `Secure`, `SameSite=Strict` cookies. |
| Lack of WebSocket Origin check | Cross-Site WebSocket Hijacking (CSWSH) allows attackers to open sockets. | Enforce origin checking inside the WebSocket Upgrader (`CheckOrigin`). |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Silent WebSocket disconnection | User stops receiving real-time updates and is unaware the application is disconnected. | Provide a visual socket status indicator (e.g. "Connecting...") and auto-reconnect. |
| Unhandled API casing bugs | Empty data tables or failing buttons with no error messages. | Ensure strict casing validation and alert users when loading fails. |
| Abrupt logout on token expiration | Sudden redirection during active form editing causes lost progress. | Implement proactive token refresh before expiration or display a warning modal. |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **CORS Configuration:** Often missing preflight handler for custom headers — verify that OPTIONS requests return status 200/204 with correct headers.
- [ ] **Token Refresh Interceptor:** Often missing concurrent request queueing — verify by firing 5 parallel endpoints while the token is expired and checking that `/auth/refresh` is called exactly once.
- [ ] **WebSocket Component Lifecycle:** Often missing cleanup on routing changes — verify by navigating between tabs multiple times and inspecting the browser network panel/backend to confirm only one active connection remains.
- [ ] **Struct / Type Casing:** Often missing tag validation on nested structs — verify that nested structs in Go are serialized to `snake_case` and map perfectly to their frontend interface counterparts.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| WebSocket file descriptor exhaustion | HIGH | Restart the Go backend service; immediately deploy server-side `ReadDeadline` check. |
| Token refresh lockout loop | LOW | Clear client-side `localStorage`/cookies; redirect the user to login and restart retry count. |
| Production CORS breakdown | MEDIUM | Correct environment variables on host/docker configurations; perform rolling backend restart. |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| CORS Configuration Mismatch | Phase 1 (Initial Setup) | Run frontend and backend on distinct local ports and execute CRUD requests successfully. |
| JSON Serialization Casing Mismatch | Phase 1 (Initial Setup) | Dry-run all endpoints with nested structures, ensuring no fields save as zero-values. |
| Token Refresh Race Conditions | Phase 2 (Authentication) | Mock expired token, load dashboard with parallel endpoints, and verify only one refresh is requested. |
| WebSocket Connection Leaks | Phase 3 (Real-time Integration) | Connect to WebSockets, navigate away from the page, and check if the backend connection count drops. |

## Sources

- [Official Gin CORS Middleware](https://github.com/gin-contrib/cors)
- [Axios Interceptors Documentation](https://axios-http.com/docs/interceptors)
- [Gorilla WebSocket Documentation](https://github.com/gorilla/websocket)
- [MDN Web Docs on Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP WebSocket Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#websockets)

---
*Pitfalls research for: Go Backend & React TypeScript API Integration*
*Researched: 2026-06-23*
