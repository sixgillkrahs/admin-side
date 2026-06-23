# Phase 2: Custom Role Creator - UI Specification

**Mapped:** 2026-06-23
**Status:** Approved

## 1. Visual Layout & Structure

### 1.1. Trigger Button
- **Placement:** Placed at the top right of the `RbacManagement` layout, aligned with the main headings.
- **Styling:** Custom primary button layout (`bg-primary text-primary-foreground hover:bg-primary/90`) containing a Lucide `Plus` icon (`size-4 mr-2`) and text "Create Custom Role".

### 1.2. Dialog Form Modal
- **Container:** Accessible modal dialog (Shadcn `Dialog` primitive) centering on screen with smooth fade-in overlay.
- **Header:**
  - Title: "Create Custom Role"
  - Subtext: "Define a new administrative role and assign specific permissions."
- **Fields:**
  - **Role Name Input:** Label "Role Name" followed by a text field (`src/components/ui/input.tsx`) with a placeholder "e.g., Support Team, Auditor".
  - **Permissions Matrix Checklist:** Label "Permissions Policy". Followed by a vertical list of capability checkbox rows.
- **Checkbox Row Layout:**
  - Rendered inside a light muted border box.
  - Left: Shadcn `Checkbox` component.
  - Right: Vertical flex layout containing the permission code (e.g. `read:messages` in bold) and a small description label underneath.
- **Footer Buttons:**
  - Grouped at the bottom-right: "Cancel" (muted ghost button) and "Create Role" (primary fill button).

---

## 2. i18n Copywriting Contract

We support English (`en`) and Vietnamese (`vi`) languages. All copy elements map to translations:

| Key Path | English Copy | Vietnamese Copy |
|----------|--------------|-----------------|
| `rbac.createRoleBtn` | "Create Custom Role" | "Tạo vai trò tùy chỉnh" |
| `rbac.createRoleModal.title` | "Create Custom Role" | "Tạo Vai trò Tùy chỉnh" |
| `rbac.createRoleModal.description` | "Define a new administrative role and assign specific permissions." | "Định nghĩa một vai trò quản trị mới và phân quyền cụ thể." |
| `rbac.createRoleModal.nameLabel` | "Role Name" | "Tên vai trò" |
| `rbac.createRoleModal.namePlaceholder` | "e.g., Support Team, Auditor" | "Ví dụ: Nhóm Hỗ trợ, Người kiểm toán" |
| `rbac.createRoleModal.permissionsLabel` | "Permissions Policy" | "Chính sách Phân quyền" |
| `rbac.createRoleModal.errorDuplicate` | "A role with this name already exists." | "Vai trò với tên này đã tồn tại." |
| `rbac.createRoleModal.errorEmpty` | "Role name cannot be empty." | "Tên vai trò không được để trống." |
| `rbac.createRoleModal.cancel` | "Cancel" | "Hủy bỏ" |
| `rbac.createRoleModal.submit` | "Create Role" | "Tạo vai trò" |

---

## 3. Interaction Mechanics

- **Open/Close:** Clicking "Create Custom Role" opens the dialog modal. Clicking "Cancel" or backdrop overlay closes it.
- **Validations:**
  - Clicking "Create Role" checks input values. If invalid, displays a localized warning under the role name text input and prevents submission.
  - If valid, appends the new role to the state, closes the modal, and resets input states.
