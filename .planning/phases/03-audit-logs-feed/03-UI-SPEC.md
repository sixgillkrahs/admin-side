# Phase 3: Audit Logs Feed - UI Specification

**Mapped:** 2026-06-23
**Status:** Approved

## 1. Visual Layout & Structure

### 1.1. Audit Logs Container
- **Card Wrapper:** Structured matching other sections (`rounded-xl border border-border bg-card p-6 shadow-sm`).
- **Heading:**
  - Title: "Security Audit Logs"
  - Subtext: "Chronological log of administrative operations and access adjustments."
- **Event List area:**
  - A scrollable feed container (`max-h-[350px] overflow-y-auto space-y-3 mt-6 pr-1`).
  - Empty state (if no logs): centered text in muted gray with an icon indicator.

### 1.2. Log Event Row
- **Layout:** Flex container (`flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-colors select-none`).
- **Left Content:** Flex layout wrapping:
  - **Category Icon Wrapper:** A circle background (`size-8 rounded-full flex items-center justify-center border`) containing Category-specific icons:
    - User logins: `User` (muted colors)
    - Role changes: `ShieldAlert` (blue/purple colors)
    - Custom role creation: `KeyRound` (emerald/amber colors)
  - **Text details:** Column containing the event description message (`text-sm font-medium text-foreground`) and category tag (`text-[10px] uppercase font-bold text-muted-foreground tracking-wider`).
- **Right Content:**
  - **Timestamp badge:** Local time representation (`text-xs font-mono text-muted-foreground`).

---

## 2. i18n Copywriting Contract

We support English (`en`) and Vietnamese (`vi`) languages. All copy elements map to translations:

| Key Path | English Copy | Vietnamese Copy |
|----------|--------------|-----------------|
| `rbac.audit.title` | "Security Audit Logs" | "Nhật ký Kiểm toán Bảo mật" |
| `rbac.audit.description` | "Chronological log of administrative operations and access adjustments." | "Nhật ký theo thời gian của các hoạt động quản trị và điều chỉnh quyền truy cập." |
| `rbac.audit.emptyState` | "No audit logs recorded." | "Chưa ghi nhận nhật ký kiểm toán." |
| `rbac.audit.event.login` | "User {{name}} logged in." | "Người dùng {{name}} đã đăng nhập." |
| `rbac.audit.event.changeRole` | "Role of {{user}} changed to {{role}}." | "Vai trò của {{user}} đã được đổi thành {{role}}." |
| `rbac.audit.event.createRole` | "Custom role \"{{role}}\" created." | "Vai trò tùy chỉnh \"{{role}}\" đã được tạo." |
| `rbac.audit.event.viewMatrix` | "User {{name}} viewed permission matrix." | "Người dùng {{name}} đã xem ma trận phân quyền." |

---

## 3. Interaction & Stream Simulation

- **WebSocket Stream Simulation:** On mounting the component, a timer appends a randomized log event every 15 seconds to simulate a live server stream.
- **Triggered Logs:** When a user's role is updated or a new custom role is created, the system immediately dispatches a corresponding event to the top of the feed with the current timestamp.
