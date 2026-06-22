# Pitfalls Research

**Domain:** Dashboard & RBAC Admin Control Panel
**Researched:** 2026-06-22
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Client-Side Security Enforcement ONLY

**What goes wrong:**
Admins configure RBAC and the client hides buttons, forms, and pages based on permissions. However, malicious users can bypass the client UI (e.g. via DevTools or raw API requests) and perform unauthorized write/delete actions because the backend API lacks permission checking.

**Why it happens:**
Developers focus heavily on UI access control (hiding buttons) and assume the API endpoints are secured by default or rely on client-side route guards.

**How to avoid:**
Enforce absolute permission validation in the Go backend API. Client-side route locking and component toggling is ONLY for user experience (UX), not security.

**Warning signs:**
- Frontend performs role checks, but backend API endpoints do not validate specific scope claims on JWTs.
- Ability to perform POST/PUT requests using curl with a low-privilege token.

**Phase to address:**
Phase 1 (Requirements definition and API contracts).

---

### Pitfall 2: Recharts Rendering Performance lag on Dashboard

**What goes wrong:**
The dashboard lag or crashes when rendering charts with large datasets or during frequent resizing/re-renders.

**Why it happens:**
Recharts component mounts and DOM rendering calculations trigger frequently on parent state changes, or chart datasets are raw arrays loaded without memoization.

**How to avoid:**
- Memoize chart data arrays using React `useMemo`.
- Use CSS container size observers (`ResponsiveContainer` in Recharts) carefully and set fixed widths if parent flexbox width is fluctuating.

**Warning signs:**
- Frame drops when resizing the browser window.
- Slow component updates when clicking other dashboard controls.

**Phase to address:**
Phase 2 (Dashboard implementation).

---

### Pitfall 3: Brittle Role-Permission Hardcoding

**What goes wrong:**
Adding a new role or permission requires modifying hardcoded checks throughout the frontend views (e.g. `user.role === 'admin'`).

**Why it happens:**
Quick coding shortcut to get features working without fetching the permission mappings dynamically.

**How to avoid:**
Design the RBAC policy check based on granular permissions/scopes rather than roles (e.g. `hasPermission('write:users')` instead of `user.role === 'Admin'`).

**Warning signs:**
- Presence of multiple checks like `if (role === 'manager' || role === 'admin')` in components.

**Phase to address:**
Phase 3 (RBAC integration).

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hiding UI elements instead of routing | Quick setup without a router. | Heavy state management and lack of URL addressable pages. | Never. A robust router (like TanStack Router) must be set up early. |
| Storing permissions in localState only | Skip Zustand or Context wrapper. | Components must drill props to check access. | Only for tiny prototypes. |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| REST API | Hardcoded endpoint URLs. | Use a centralized API client with environment variables (`VITE_API_URL`). |
| JWT Tokens | Storing tokens in localStorage (vulnerable to XSS). | Store tokens in memory or HttpOnly cookies, and use silent refresh. |

---
*Pitfalls research for: Dashboard & RBAC Admin Control Panel*
*Researched: 2026-06-22*
