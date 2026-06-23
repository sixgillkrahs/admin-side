# Phase 1: Interactive Dashboard Graphs - Context

**Gathered:** 2026-06-23
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers interactive traffic visualization graphs inside the `DashboardOverview` screen using Recharts, presenting daily API traffic metrics and integrating with our multi-language toggle system.

</domain>

<decisions>
## Implementation Decisions

### Interactive Dashboard Graphs (DASH-02)
- **D-01:** Utilizes `recharts` as the charting library for rendering graphs reactively.
- **D-02:** Renders a LineChart showing daily API traffic trends (e.g. requests count over the last 7 days) and a BarChart comparing active sessions per hour.
- **D-03:** Embeds the charts inside `src/features/dashboard/components/DashboardOverview.tsx` beneath the KPI metrics cards.
- **D-04:** Integrates with `react-i18next` so that all titles, legends, tooltips, and axis labels update instantly when toggling English and Vietnamese locales.
- **D-05:** Charts will use premium OKLCH-based theme variables (primary, border, grid) to blend naturally with both Light and Dark mode styling sheets.

</decisions>

<canonical_refs>
## Canonical References

### Project Specifications
- [PROJECT.md](file:///d:/works/business-chat/frontend/admin-side/.planning/PROJECT.md) — Tech stack, decisions, and constraints
- [REQUIREMENTS.md](file:///d:/works/business-chat/frontend/admin-side/.planning/REQUIREMENTS.md) — Product requirements and trace map
- [ROADMAP.md](file:///d:/works/business-chat/frontend/admin-side/.planning/ROADMAP.md) — Phase goals, plans, and success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- [dashboard/components/DashboardOverview.tsx](file:///d:/works/business-chat/frontend/admin-side/src/features/dashboard/components/DashboardOverview.tsx) — KPI overview cards container.
- [lib/i18n.ts](file:///d:/works/business-chat/frontend/admin-side/src/lib/i18n.ts) — Translations configuration.

</code_context>

<specifics>
## Specific Ideas

- Accent charts using a subtle color gradient corresponding to the theme's Primary color.
- Make tooltips custom styled to match the dark card background and border colors.

</specifics>

<deferred>
- AUDIT-01 Real-time audit logs websocket feed (deferred to Phase 3 of v2.0)
</deferred>

---
*Phase: 01-interactive-dashboard-graphs*
*Context gathered: 2026-06-23*
