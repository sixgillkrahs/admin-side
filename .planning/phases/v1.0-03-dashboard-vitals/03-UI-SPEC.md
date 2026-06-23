# Phase 3 — UI Design Contract

> Visual and interaction contract for the dashboard overview vitals.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | radix-nova |
| Icon library | lucide-react |
| Font | Geist Variable |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Gaps between trends and indicator labels |
| sm | 8px | Margin between metrics value and subtext |
| md | 16px | Padding inside cards |
| lg | 24px | Card padding, outer layout grid gaps |
| xl | 32px | Heading vertical margins |

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Title | 30px | bold | 1.2 |
| Card Title | 14px | medium | 1.5 |
| Metric Value | 28px | bold | 1.2 |
| Trend Label | 12px | regular | 1.4 |

---

## Color & Aesthetics

Accent tones for KPI metrics card details:

| Card | Theme Color | Tailwind Utility Classes |
|------|-------------|--------------------------|
| Total Users | Purple | `text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20` |
| Active Roles | Blue | `text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20` |
| Active Sessions | Emerald | `text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20` |
| API Traffic | Amber | `text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20` |

### Card Glow & Hover State
Each overview card should utilize the following classes for premium feedback:
- Shadow: `shadow-sm hover:shadow-md`
- Border transition: `transition-all duration-300 hover:border-muted-foreground/30`
- Scale animation: `hover:-translate-y-0.5`

---

## Copywriting Contract

| Element | Title | Subtext | Value |
|---------|-------|---------|-------|
| Users Card | Total Users | +1 joined today | 5 |
| Roles Card | Active Roles | Admin, Moderator, User | 3 |
| Sessions Card | Active Sessions | 100% system uptime | 12 |
| Traffic Card | API Traffic | +8.2% vs yesterday | 24.5k |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-23
