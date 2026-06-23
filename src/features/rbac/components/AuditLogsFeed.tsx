import { useTranslation } from 'react-i18next';
import { User, ShieldAlert, KeyRound, Eye, Shield } from 'lucide-react';

export interface AuditEvent {
  id: string;
  type: 'login' | 'changeRole' | 'createRole' | 'viewMatrix';
  timestamp: string;
  details: Record<string, string>;
}

interface AuditLogsFeedProps {
  logs: AuditEvent[];
}

export function AuditLogsFeed({ logs }: AuditLogsFeedProps) {
  const { t } = useTranslation();

  const getEventIcon = (type: AuditEvent['type']) => {
    switch (type) {
      case 'login':
        return <User className="size-4 text-muted-foreground" />;
      case 'changeRole':
        return <ShieldAlert className="size-4 text-blue-600 dark:text-blue-400" />;
      case 'createRole':
        return <KeyRound className="size-4 text-amber-600 dark:text-amber-400" />;
      case 'viewMatrix':
        return <Eye className="size-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <Shield className="size-4 text-muted-foreground" />;
    }
  };

  const getEventIconBg = (type: AuditEvent['type']) => {
    switch (type) {
      case 'login':
        return 'bg-muted/50 border-border/50';
      case 'changeRole':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'createRole':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'viewMatrix':
        return 'bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'bg-muted/50 border-border/50';
    }
  };

  const getEventCategory = (type: AuditEvent['type']) => {
    switch (type) {
      case 'login':
        return 'Auth';
      case 'changeRole':
        return 'Access';
      case 'createRole':
        return 'Policy';
      case 'viewMatrix':
        return 'Audit';
      default:
        return 'System';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          {t('rbac.audit.title')}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t('rbac.audit.description')}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center select-none">
            <Shield className="size-10 text-muted-foreground/45 stroke-[1.5]" />
            <p className="mt-3 text-sm text-muted-foreground font-medium">
              {t('rbac.audit.emptyState')}
            </p>
          </div>
        ) : (
          <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border bg-muted/10 hover:bg-muted/20 transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center border ${getEventIconBg(log.type)}`}>
                    {getEventIcon(log.type)}
                  </div>
                  <div className="grid gap-0.5">
                    <p className="text-xs font-semibold text-foreground leading-normal">
                      {t(`rbac.audit.event.${log.type}`, log.details)}
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                      {getEventCategory(log.type)}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
