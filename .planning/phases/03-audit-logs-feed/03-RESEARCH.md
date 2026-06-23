# Phase 3: Audit Logs Feed - Research

**Researched:** 2026-06-23
**Domain:** Real-time Stream Simulation, React Lifecycle Hook Cleanup.
**Confidence:** HIGH

<user_constraints>
- **D-01:** Renders Audit Logs feed component inside `RbacManagement.tsx`.
- **D-02:** Simulates a websocket stream using a `useEffect` interval that appends randomized system access logs periodically.
- **D-03:** Reacts immediately to manual role changes and role creations.
- **D-04:** Dynamic translations with i18next parameter interpolation.

</user_constraints>

<research_summary>
## Summary
To prevent memory leaks and duplicate triggers under React 19's StrictMode, all interval triggers created in `useEffect` must return a cleanup function calling `clearInterval()`.
Log items should have a stable unique identifier (e.g. `id`) generated using `crypto.randomUUID()` or timestamp-index combinations.

</research_summary>

<architecture_patterns>
## Architecture Patterns

### 1. Simulated WebSocket Stream
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const randomEvent = generateRandomEvent();
    setLogs((prev) => [randomEvent, ...prev].slice(0, 20));
  }, 15000);
  
  return () => clearInterval(interval);
}, []);
```

### 2. Parameterized i18n Interpolation
```typescript
// in i18n config:
// changeRole: "Role of {{user}} changed to {{role}}."

// in UI component:
t('rbac.audit.event.changeRole', { user: event.user, role: event.role })
```

</architecture_patterns>
