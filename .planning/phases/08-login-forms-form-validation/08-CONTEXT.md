---
phase: "08"
name: "login-forms-form-validation"
created: 2026-06-23
---

# Phase 8: login-forms-form-validation — Context

## Decisions

### Credentials Validation
- Client-side validation:
  - Email: Validate format using standard regex. Show warning message if invalid.
  - Password: Validate length (minimum 6 characters). Show warning message if invalid.
- Validation errors appear inline, directly below their respective input fields.
- Form fields and button become disabled during the simulated validation check and loading state.

### Loading Spinner & Redirection Flow
- When submitting valid credentials:
  - Submit button changes to active loading state with a spinner (Lucide Loader2 rotating) and text "Signing in..." / "Đang đăng nhập...".
  - Simulate a loading delay of 1.5 seconds using a `setTimeout` timer.
  - After 1.5 seconds, invoke the `onLoginSuccess` callback to redirect the user context to the Admin Dashboard.

### i18n Translation Keys
- Add translation keys for validation error messages in English and Vietnamese namespaces:
  - `auth.errorInvalidEmail`: "Please enter a valid email address." / "Vui lòng nhập địa chỉ email hợp lệ."
  - `auth.errorShortPassword`: "Password must be at least 6 characters." / "Mật khẩu phải có ít nhất 6 ký tự."
  - `auth.loadingText`: "Signing in..." / "Đang đăng nhập..."

## Discretion Areas
- Style properties of the error messages (e.g. text-red-500 text-xs mt-1).
- Timing adjustments (1.5 seconds is the baseline).
