# Phase 3: Dashboard Vitals - Research

**Researched:** 2026-06-23
**Domain:** Overview KPI stat cards layout, icon representation, and responsive dashboards.
**Confidence:** HIGH

<user_constraints>
## User Constraints

- **D-01:** Renders Overview KPI Cards inside `DashboardOverview.tsx` for: Total Users (linked to MOCK_USERS size or dynamically computed), Active Roles (e.g. 3), Active Sessions (e.g. 12), API Traffic (e.g. 24.5k requests).
- **D-02:** Uses Lucide icons (`Users`, `ShieldCheck`, `Activity`, `Zap`) for the respective cards.
- **D-03:** Each card utilizes rich modern aesthetics with light-reflecting borders and hover animations.

</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

Client-only dashboard rendering.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| KPI Stat Rendering | Browser/Client | — | Renders overview metrics cards with reactive counts in-place. |
| Dashboard Responsiveness | Browser/Client | — | Tailwind grid properties that auto-wrap columns on smaller viewports. |

</architectural_responsibility_map>

<research_summary>
## Summary

This research focuses on premium KPI card layouts using CSS Grid and standard Tailwind. It outlines how to display metric information with supportive subtexts, colored accent icons, and hover transformations, keeping styling aligned with the established `oklch` palette.

</research_summary>

<standard_stack>
## Standard Stack

- `react` for state integration.
- `lucide-react` for KPI vector icons.
- `tailwindcss` for styling grid cards.

</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Responsive Stat Card Grid
Use Tailwind CSS grid properties to wrap elements automatically on tablet and mobile viewports:
```html
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  <!-- Cards -->
</div>
```

### Premium Hover Feedback
Ensure cards respond to user interaction with smooth transitions:
```html
<div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
  <!-- Card Content -->
</div>
```

</architecture_patterns>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Content Overflow in Stat Cards
**What goes wrong:** Large metric numbers (e.g. 1,000,000) or long trend subtexts cause card layouts to overflow and clip on narrow screens.
**How to avoid:** Ensure font sizes decrease appropriately on mobile viewports (`text-2xl sm:text-3xl`) and subtexts are wrapped properly.

</common_pitfalls>

---

*Phase: 03-dashboard-vitals*
*Research completed: 2026-06-23*
