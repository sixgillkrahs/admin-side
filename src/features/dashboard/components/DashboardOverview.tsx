

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Business Chat Admin Control Panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Mock Overview Cards to serve as placeholder */}
        {['Total Users', 'Active Roles', 'Active Sessions', 'API Traffic'].map((title, idx) => (
          <div key={idx} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="mt-2 text-2xl font-bold text-foreground">--</p>
            <span className="text-xs text-muted-foreground mt-1 block">Feature pending Phase 3</span>
          </div>
        ))}
      </div>
    </div>
  );
}
