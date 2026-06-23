import { useTranslation } from 'react-i18next';
import { Users, ShieldCheck, Activity, Zap } from 'lucide-react';

export function DashboardOverview() {
  const { t } = useTranslation();

  const kpiData = [
    {
      title: t('dashboard.kpis.totalUsers'),
      value: '5',
      subtext: t('dashboard.trends.usersSub'),
      icon: Users,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      borderAccent: 'border-t-2 border-t-purple-500',
    },
    {
      title: t('dashboard.kpis.activeRoles'),
      value: '3',
      subtext: t('dashboard.trends.rolesSub'),
      icon: ShieldCheck,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      borderAccent: 'border-t-2 border-t-blue-500',
    },
    {
      title: t('dashboard.kpis.activeSessions'),
      value: '12',
      subtext: t('dashboard.trends.sessionsSub'),
      icon: Activity,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      borderAccent: 'border-t-2 border-t-emerald-500',
      isLive: true,
    },
    {
      title: t('dashboard.kpis.apiTraffic'),
      value: '24.5k',
      subtext: t('dashboard.trends.trafficSub'),
      icon: Zap,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      borderAccent: 'border-t-2 border-t-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('dashboard.description')}</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 select-none ${kpi.borderAccent}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
                  <p className="mt-2 text-3xl font-bold text-foreground tracking-tight">{kpi.value}</p>
                </div>
                <div className={`size-10 rounded-full flex items-center justify-center border ${kpi.iconBg}`}>
                  <Icon className={`size-5 ${kpi.iconColor}`} />
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-1.5">
                {kpi.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {kpi.isLive ? `${t('dashboard.trends.live')} • ${kpi.subtext}` : kpi.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
