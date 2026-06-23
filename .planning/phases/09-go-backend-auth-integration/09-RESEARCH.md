# Phase 9 Research: Go Backend Auth Integration

This research document analyzes the technical implementation options, codebase structures, and integration requirements for connecting the standalone React administrator portal to the Go backend API service's authentication layer.

## 1. Executive Summary

Phase 9 integrates credentials authentication (login) and session management between the React admin portal and the Go API service. This phase delivers the following core outcomes:
- Configures global API client communication using **Axios** with request/response interceptors.
- Establishes a secure global authentication state using **Zustand**.
- Implements backend credentials verification through `POST /api/v1/auth/login`.
- Detects `401 Unauthorized` token failures (expiration, invalid credentials, or client IP mismatch), invalidates the frontend session, and redirects to the login screen with localized warnings.

---

## 2. Backend Authentication Architecture

### 2.1 API Endpoints
Based on the Go backend routing configuration (`backend/internal/app/router.go`), the authentication endpoints are:

1. **User Login (Public)**:
   - **Path**: `POST /api/v1/auth/login`
   - **Handler**: `LoginHandler` in `backend/internal/app/handler/auth.go`
   - **Request Payload (`application/json`)**:
     ```json
     {
       "email": "admin@example.com",
       "password": "securepassword"
     }
     ```
   - **Success Response (`200 OK`)**:
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "id": 1,
         "name": "Admin User",
         "email": "admin@example.com",
         "created_at": "2026-06-23T11:00:00Z",
         "updated_at": "2026-06-23T11:00:00Z"
       }
     }
     ```
   - **Failure Responses**:
     - `400 Bad Request`: Payload validation fails (missing email or password).
     - `401 Unauthorized`: Invalid email or password.
     - `500 Internal Server Error`: JWT generation or database error.

2. **User Profile (Protected)**:
   - **Path**: `GET /api/v1/profile`
   - **Handler**: `ProfileHandler` in `backend/internal/app/handler/auth.go`
   - **Headers**: `Authorization: Bearer <JWT_TOKEN>`
   - **Success Response (`200 OK`)**:
     ```json
     {
       "user": {
         "id": 1,
         "name": "Admin User",
         "email": "admin@example.com",
         "created_at": "2026-06-23T11:00:00Z",
         "updated_at": "2026-06-23T11:00:00Z"
       },
       "client_ip": "127.0.0.1",
       "token_ip": "127.0.0.1"
     }
     ```

### 2.2 JWT Structure
The JWT is generated in `backend/internal/pkg/auth/jwt.go` and contains the following claims:
```go
type JWTClaims struct {
	UserID uint   `json:"user_id"`
	IP     string `json:"ip"`
	jwt.RegisteredClaims
}
```
- **`user_id`**: Identifies the logged-in administrator.
- **`ip`**: The IP address of the client at the time of login (`c.ClientIP()`).
- **`exp`**: Expiration duration configured dynamically in hours (e.g. 24 hours).

### 2.3 Client IP Lock Mechanism
In `backend/internal/app/middleware/auth.go`, the backend validates that the incoming request's client IP matches the IP embedded inside the JWT claims:
```go
currentIP := c.ClientIP()
if claims.IP != currentIP {
    slog.Warn("JWT IP mismatch",
        slog.Uint64("user_id", uint64(claims.UserID)),
        slog.String("token_ip", claims.IP),
        slog.String("request_ip", currentIP),
    )
    c.JSON(http.StatusUnauthorized, gin.H{"error": "Session invalidated: client IP changed"})
    c.Abort()
    return
}
```
If the IP has changed mid-session, the backend immediately rejects the request with `401 Unauthorized` and the specific JSON error string: `"Session invalidated: client IP changed"`.

---

## 3. Frontend Client Auth Implementation

### 3.1 Install Missing Dependencies
Axios, Zustand, and TanStack Query are not yet declared in the frontend `package.json`. These must be installed at the start of Phase 9:
```bash
npm i axios zustand @tanstack/react-query
```

### 3.2 Zustand Auth Store Setup
Create `frontend/admin-side/src/features/auth/store/useAuthStore.ts` to manage in-memory authentication states. By storing the JWT in-memory and only keeping the user metadata or simple persistence flag (or sessionStorage) for basic UI retention, we mitigate XSS risk. 

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  authError: string | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setAuthError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      authError: null,
      setAuth: (token, user) => set({ token, user, authError: null }),
      clearAuth: () => set({ token: null, user: null }),
      setAuthError: (authError) => set({ authError }),
    }),
    {
      name: 'antigravity-auth-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage to survive page reloads but auto-clear on tab close
      partialize: (state) => ({ token: state.token, user: state.user }), // Persist only token and user
    }
  )
);
```

### 3.3 Axios Client and Interceptors Setup
Create `frontend/admin-side/src/lib/api.ts` to coordinate HTTP requests. Interceptors will automatically append the JWT token and intercept `401` errors to clear state and display warnings.

```typescript
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor injecting token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor capturing 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorMsg = error.response.data?.error || 'Unauthorized';
      
      const { clearAuth, setAuthError } = useAuthStore.getState();
      clearAuth();
      
      // Determine user-friendly/localized error reason
      if (errorMsg.includes('client IP changed')) {
        setAuthError('IP_MISMATCH');
      } else if (errorMsg.includes('expired') || errorMsg.includes('invalid')) {
        setAuthError('SESSION_EXPIRED');
      } else {
        setAuthError('UNAUTHORIZED');
      }
    }
    return Promise.reject(error);
  }
);
```

### 3.4 Localized Warning & Language Setup
Update translation bundles in `frontend/admin-side/src/lib/i18n.ts` under the `auth` namespace to include warning descriptions:

```typescript
// English Resource additions:
auth: {
  // ... existing keys
  errorIpMismatch: "Your session was invalidated because your client IP address changed. Please sign in again.",
  errorSessionExpired: "Your session has expired. Please sign in again.",
  errorUnauthorized: "You are not authorized. Please log in with valid credentials.",
  errorConnectionFailed: "Could not connect to the authentication server. Please check your network.",
  errorInvalidCredentials: "The email or password you entered is incorrect."
}

// Vietnamese Resource additions:
auth: {
  // ... existing keys
  errorIpMismatch: "Phiên đăng nhập bị hủy do địa chỉ IP của bạn thay đổi. Vui lòng đăng nhập lại.",
  errorSessionExpired: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  errorUnauthorized: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại.",
  errorConnectionFailed: "Không thể kết nối đến máy chủ xác thực. Vui lòng kiểm tra lại kết nối mạng.",
  errorInvalidCredentials: "Email hoặc mật khẩu bạn nhập không đúng."
}
```

### 3.5 Updating the Login Screen Component
Modify `frontend/admin-side/src/features/auth/components/LoginScreen.tsx` to handle true API logins, display the store's `authError` warnings, and leverage Zustand states:

```typescript
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Laptop, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '@/lib/api';

export function LoginScreen() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; api?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth, authError, setAuthError } = useAuthStore();

  // Clear previous session errors when editing fields
  useEffect(() => {
    if (authError) {
      setAuthError(null);
    }
  }, [email, password]);

  const toggleLanguage = () => {
    if (isLoading) return;
    const nextLng = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(nextLng);
    localStorage.setItem('i18nextLng', nextLng);
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = t('rbac.createRoleModal.errorEmpty');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('auth.errorInvalidEmail');
    }

    if (!password) {
      newErrors.password = t('rbac.createRoleModal.errorEmpty');
    } else if (password.length < 6) {
      newErrors.password = t('auth.errorShortPassword');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (validateForm()) {
      setIsLoading(true);
      setErrors({});
      try {
        const response = await api.post('/api/v1/auth/login', { email, password });
        const { token, user } = response.data;
        setAuth(token, user);
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 401) {
            setErrors({ api: t('auth.errorInvalidCredentials') });
          } else {
            setErrors({ api: err.response.data?.error || t('auth.errorUnauthorized') });
          }
        } else {
          setErrors({ api: t('auth.errorConnectionFailed') });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Maps Zustand state errors to localized error text
  const getSessionWarning = () => {
    if (authError === 'IP_MISMATCH') return t('auth.errorIpMismatch');
    if (authError === 'SESSION_EXPIRED') return t('auth.errorSessionExpired');
    if (authError === 'UNAUTHORIZED') return t('auth.errorUnauthorized');
    return null;
  };

  const warningMsg = getSessionWarning();

  return (
    // ... UI Layout ...
    // Note: Render warningMsg (if present) and errors.api (if present) as red Alert banners inside the form container
  );
}
```

### 3.6 Updating App.tsx Routing Layout
Refactor `frontend/admin-side/src/App.tsx` to mount the main system `Layout` only when a valid token is present:

```typescript
import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { DashboardOverview } from '@/features/dashboard';
import { RbacManagement } from '@/features/rbac';
import { LoginScreen } from '@/features/auth';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'rbac':
        return <RbacManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!token) {
    return <LoginScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
```

---

## 4. Risk Mitigation & Edge Cases

### 4.1 Missing Backend CORS Configuration
- **Finding**: The backend's `SetupRouter` in `backend/internal/app/router.go` does **not** currently configure CORS middleware. Initiating Axios requests from `http://localhost:5173` to `http://localhost:8080` will cause browser-level CORS blocking.
- **Mitigation**: Introduce standard CORS middleware in the Go backend setup:
  ```go
  // Configure CORS middleware before setup routes in backend/internal/app/router.go
  r.Use(func(c *gin.Context) {
      c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
      c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
      c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
      c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

      if c.Request.Method == "OPTIONS" {
          c.AbortWithStatus(204)
          return
      }
      c.Next()
  })
  ```

### 4.2 In-Memory Zustand Persistence
- **Finding**: If Zustand is fully volatile, pressing refresh in the browser will wipe the auth token and kick the admin out to the login screen immediately, disrupting the administrator experience.
- **Mitigation**: Set up Zustand with the `persist` middleware configured for `sessionStorage` (as done in Section 3.2). This keeps the token alive for reload events within the tab but ensures the token is wiped if the tab or browser is closed.

### 4.3 Concurrent Request Failures (Mitigation plan)
- **Finding**: If multiple TanStack queries fire in parallel, and the token expires or client IP changes mid-flight, all requests will return 401s concurrently, causing multiple redundant store resets and alert displays.
- **Mitigation**: Interceptor logic should throttle or prevent multiple notifications. By tracking when `clearAuth` has triggered, subsequent errors are swallowed until a new login session begins.

---

## 5. Answers to Key Planning Questions

### What do I need to know to PLAN this phase well?
1. **API Contracts**: Login takes `"email"` and `"password"`. Response returns `"token"` (JWT) and a `"user"` object (`id`, `name`, `email`, `created_at`, `updated_at`).
2. **IP Locks Details**: The backend's `AuthMiddleware` verifies that the current client IP matches the `ip` claim inside the JWT token. Any mismatch triggers `401 Unauthorized` with error string `Session invalidated: client IP changed`.
3. **CORS Requirement**: Before frontend integration can start, backend CORS middleware must be added. Without it, development is blocked by origin validation.
4. **Library Prerequisites**: Frontend packages `axios`, `zustand`, and `@tanstack/react-query` must be added to `package.json` at the start of implementation.
5. **Session Strategy**: To preserve administrator session integrity while guarding against persistence vulnerabilities, utilize Zustand `persist` with `sessionStorage` storage.
