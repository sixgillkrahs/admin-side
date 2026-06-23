# Phase 1: Interactive Dashboard Graphs - Research

**Researched:** 2026-06-23
**Domain:** Chart integration using Recharts, responsive container setups, and React 19 compatibility.
**Confidence:** HIGH

<user_constraints>
## User Constraints

- **D-01:** Utilizes `recharts` as the charting library.
- **D-02:** Renders a LineChart showing daily API traffic trends and a BarChart comparing active sessions per hour.
- **D-03:** Placed inside the `DashboardOverview` component below the KPI cards.
- **D-04:** Dynamic translation support for titles, legends, tooltips, and axis labels.
- **D-05:** Uses OKLCH-based theme variables.

</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Chart Rendering | Browser/Client | — | Client-side Canvas rendering via Recharts SVG paths. |
| Localization updates | Browser/Client | — | Dynamically updating chart titles, legends, and axes upon locale change. |

</architectural_responsibility_map>

<research_summary>
## Summary

Recharts version `^2.15.0` is compatible with React 19. When rendering SVG paths inside `ResponsiveContainer`, ensure the container has explicit heights (e.g. `height={300}`) to avoid layout collapse inside CSS flexboxes/grids. Tooltips should be customized to avoid generic light gray card backgrounds.

</research_summary>

<standard_stack>
## Standard Stack

- `react` for lifecycle hooks.
- `recharts` for vector data charts.
- `react-i18next` for i18n support.

**Installation:**
```bash
npm install recharts
```

</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Responsive Line Chart Template
```typescript
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function RequestVolumeChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
        <YAxis stroke="var(--muted-foreground)" fontSize={12} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
        <Line type="monotone" dataKey="requests" stroke="var(--primary)" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

</architecture_patterns>

---
*Phase: 01-interactive-dashboard-graphs*
*Research completed: 2026-06-23*
