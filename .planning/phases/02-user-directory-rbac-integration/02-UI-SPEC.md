---
phase: 2
slug: user-directory-rbac-integration
status: approved
shadcn_initialized: true
preset: radix-nova
created: 2026-06-22
---

# Phase 2 — UI Design Contract

> Visual and interaction contract for frontend access control features.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | radix-nova |
| Component library | radix-ui |
| Icon library | lucide-react |
| Font | Geist Variable |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, table cell padding offsets |
| sm | 8px | Button inline gaps, badge padding |
| md | 16px | Card margins, search filter padding |
| lg | 24px | Layout padding, dialog modal padding |
| xl | 32px | Section headers gaps |
| 2xl | 48px | Page margins |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 14px | regular | 1.5 |
| Label | 12px | medium | 1.2 |
| Heading | 18px | semibold | 1.4 |
| Display | 30px | bold | 1.2 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | bg-background | Dark mode root window base |
| Secondary (30%) | bg-card | Table boundaries, dialog boxes |
| Accent (10%) | bg-primary | Primary button highlights, active tabs border |
| Destructive | bg-destructive | Suspend user red button actions |

Accent reserved for: Primary action buttons (Save Changes, Edit Role) and active state indicator dots.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | Save Changes |
| Empty state heading | No users found |
| Empty state body | Try adjusting your search query or role filter. |
| Error state | Failed to update user role. Please try again. |
| Destructive confirmation | Suspend User: Are you sure you want to suspend this user's platform access? |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | table, dialog, select, input, badge | not required |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-22
