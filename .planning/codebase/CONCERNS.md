# Technical Concerns

**Analysis Date:** 2026-06-22

## Technical Debt & Known Issues

*This is a newly initialized, clean React + Vite + Shadcn project. There is currently no legacy technical debt or bugs.*

## Areas of Future Focus

1. **Routing**:
   - The application does not have a router yet. **React Router v7** or **TanStack Router** needs to be added before creating admin-side pages.

2. **State Management**:
   - Currently relies on raw React state. Complex panels will require centralized state (e.g. **Zustand** or **TanStack Query**).

3. **Backend Communication Layer**:
   - Standard fetch client or Axios needs to be configured with the Go API URL environment variable (`VITE_API_URL`).

4. **Testing Coverage**:
   - Currently, there are no tests. A testing framework needs to be initialized.

---

*Concerns analysis: 2026-06-22*
*Update as technical debt accumulates or concerns are resolved*
