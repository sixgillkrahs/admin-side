# Phase 3: Dashboard Vitals - Context

**Gathered:** 2026-06-23
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the dashboard vitals page, replacing the empty placeholder overview cards with four premium, responsive KPI metrics cards showing Total Users, Active Roles, Active Sessions, and API Traffic.

</domain>

<decisions>
## Implementation Decisions

### Overview KPI Summary Cards (DASH-01)
- **D-01:** Renders four distinct KPI overview cards inside `DashboardOverview.tsx` displaying:
  - **Total Users**: Displays the count of users (linked dynamically to the length of our mock user list or displaying `5` users).
  - **Active Roles**: Displays the count of registered system roles (`3`: Admin, Moderator, User).
  - **Active Sessions**: Displays active user sessions (e.g., `12` sessions, with a live green indicator dot).
  - **API Traffic**: Displays current API request traffic (e.g., `24.5k` requests, with a trend indicating +8.2% change).
- **D-02:** Integrates expressive Lucide icons for each card:
  - Total Users: `Users` (purple/indigo themed)
  - Active Roles: `ShieldCheck` (blue themed)
  - Active Sessions: `Activity` (emerald/green themed)
  - API Traffic: `Zap` (orange/amber themed)
- **D-03:** Each card will utilize rich modern aesthetics, including subtle hover scales, color-accented icon backgrounds, and light-reflecting glass border states to feel premium.

### Internationalization & Multi-language Support (I18N-01)
- **D-04:** Employs standard industry libraries `i18next` and `react-i18next` to implement internationalization support.
- **D-05:** Consolidates translation dictionaries for English (`en`) and Vietnamese (`vi`) in `src/lib/i18n.ts` for all interface text elements.
- **D-06:** Renders a language switch control (a button toggle or dropdown) in the navigation `Header.tsx` that changes the active language reactively. The selected language is stored in `localStorage` for session persistence.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- [PROJECT.md](file:///d:/works/business-chat/frontend/admin-side/.planning/PROJECT.md) — Tech stack, decisions, and constraints
- [REQUIREMENTS.md](file:///d:/works/business-chat/frontend/admin-side/.planning/REQUIREMENTS.md) — Product requirements and trace map
- [ROADMAP.md](file:///d:/works/business-chat/frontend/admin-side/.planning/ROADMAP.md) — Phase goals, plans, and success criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- [ui/button.tsx](file:///d:/works/business-chat/frontend/admin-side/src/components/ui/button.tsx) — Reusable shadcn Button component
- [common/Layout.tsx](file:///d:/works/business-chat/frontend/admin-side/src/components/common/Layout.tsx) — Page shell layout
- [dashboard/components/DashboardOverview.tsx](file:///d:/works/business-chat/frontend/admin-side/src/features/dashboard/components/DashboardOverview.tsx) — Target file to modify

</code_context>

<specifics>
## Specific Ideas

- Accent each card with a top border or a small glowing icon container corresponding to its metric category.
- Display positive/negative progress indicators underneath each metric value to simulate real platform feedback (e.g. "+12.4% last 24h").

</specifics>

<deferred>
## Deferred Ideas

- DASH-02 Interactive Recharts graphs (deferred to Phase 3 milestone post-v1 or v2 scope)

</deferred>

---

*Phase: 03-dashboard-vitals*
*Context gathered: 2026-06-23*
