# Phase 2: Custom Role Creator - Research

**Researched:** 2026-06-23
**Domain:** Dynamic State Lifting, Shadcn Dialog & Checkbox React 19 Compatibility.
**Confidence:** HIGH

<user_constraints>
## User Constraints
- **D-01:** Utilizes Shadcn Dialog and Checkbox primitives.
- **D-02:** State for roles and permissions is lifted to `RbacManagement` to enable dynamic updates in `PermissionMatrix` and `EditRoleModal`.
- **D-03:** Validation prevents blank role names or case-insensitive duplicate role entries.
- **D-04:** Translations supported dynamically on locale change.

</user_constraints>

<research_summary>
## Summary
Shadcn Dialog uses `@radix-ui/react-dialog` which handles focus trapping, Escape closures, and screen reader labels automatically.
By lifting state into `RbacManagement.tsx`, we can maintain the list of active roles (`string[]`) and their associated capability claims (`Record<string, Record<string, boolean>>`).
When a new role is saved, state setters update both tables reactively.

</research_summary>

<architecture_patterns>
## Architecture Patterns

### 1. Dynamic State Lifting in RbacManagement
```typescript
const [roles, setRoles] = useState<string[]>(['Admin', 'Moderator', 'User']);
const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({
  Admin: { 'read:messages': true, 'write:messages': true, 'manage:roles': true, 'admin:all': true },
  Moderator: { 'read:messages': true, 'write:messages': true, 'manage:roles': false, 'admin:all': false },
  User: { 'read:messages': true, 'write:messages': false, 'manage:roles': false, 'admin:all': false }
});
```

### 2. Validation Checks
```typescript
const trimmedName = roleName.trim();
if (!trimmedName) {
  setError(t('rbac.createRoleModal.errorEmpty'));
  return;
}
if (roles.some(r => r.toLowerCase() === trimmedName.toLowerCase())) {
  setError(t('rbac.createRoleModal.errorDuplicate'));
  return;
}
```

</architecture_patterns>
