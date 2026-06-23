---
status: testing
phase: 09-go-backend-auth-integration
source: [09-01-SUMMARY.md, 09-02-SUMMARY.md]
started: 2026-06-23T11:30:00Z
updated: 2026-06-23T11:30:00Z
---

## Current Test

number: 1
name: Step 1: Navigate to the login page
expected: |
  Navigate to http://localhost:5173. The login page renders in English or Vietnamese, showing the Antigravity Admin portal brand panel and language toggle switcher.
awaiting: user response

## Tests

### 1. Step 1: Navigate to the login page
expected: Navigate to http://localhost:5173. The login page renders in English or Vietnamese, showing the Antigravity Admin portal brand panel and language toggle switcher.
result: [pending]

### 2. Step 2: Submit invalid credentials
expected: Fill in invalid input (e.g., email "bademail", password "123"). Submitting shows inline client-side validation errors under the fields and blocks API requests.
result: [pending]

### 3. Step 3: Submit wrong email/password credentials
expected: Submit incorrect credentials (e.g. wrong@example.com / password123). Page POSTs to /api/v1/auth/login, returns 401, and displays a localized Alert banner warning: "The email or password you entered is incorrect."
result: [pending]

### 4. Step 4: Submit valid admin credentials
expected: Submit valid admin credentials. Page POSTs to /api/v1/auth/login, returns 200, saves token and user in Zustand (sessionStorage), and redirects/renders the main Layout dashboard.
result: [pending]

### 5. Check 5: Outgoing API Request Auth Header Injection
expected: Inspect outgoing requests (e.g., /api/v1/profile). The Authorization header contains "Bearer [token]" injected automatically.
result: [pending]

### 6. Check 6: Client IP Lock Verification (401 Response Interceptor)
expected: Simulate a 401 error with "client IP changed" error response. The app automatically clears session storage, redirects to login, and displays the localized Alert banner warning: "Your client IP address has changed. Please log in again to verify your identity."
result: [pending]

### 7. Check 7: Token Expiration Invalidations (401 Response Interceptor)
expected: Simulate a 401 error with token expired. The app clears session storage, redirects to login, and displays the localized Alert banner warning: "Your session has expired. Please log in again."
result: [pending]

### 8. Coverage: Verify User Story Outcome
expected: The outcome "I can securely access the admin dashboard" is satisfied: credentials verification, session storage, and client IP checking are integrated.
result: [pending]

## Summary

total: 8
passed: 0
issues: 0
pending: 8
skipped: 0
blocked: 0

## Gaps

[none yet]
