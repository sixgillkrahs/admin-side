import { useTranslation } from 'react-i18next';
import { User, ShieldAlert, KeyRound, Eye, Shield, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useAuditStream, type AuditEvent, type ConnectionStatus } from '@/hooks/useAuditStream';

// ---- Connection Status Indicator ----
function ConnectionBadge({ status, reconnectCount }: { status: ConnectionStatus; reconnectCount: number }) {
  const configs: Record<ConnectionStatus, { label: string; className: string; Icon: React.FC<{ className?: string }> }> = {
    connected: {
      label: 'Live',
      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      Icon: ({ className }) => <Wifi className={className} />,
    },
    connecting: {
      label: 'Connecting…',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      Icon: ({ className }) => <Loader2 className={`${className ?? ''} animate-spin`} />,
    },
    reconnecting: {
      label: `Reconnecting${reconnectCount > 1 ? ` (×${reconnectCount})` : '…'}`,
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      Icon: ({ className }) => <Loader2 className={`${className ?? ''} animate-spin`} />,
    },
    disconnected: {
      label: 'Disconnected',
      className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      Icon: ({ className }) => <WifiOff className={className} />,
    },
  };

  const { label, className, Icon } = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${className}`}>
      <Icon className="size-3" />
      {label}
    </span>
  );
}

// ---- Icon helpers (kept for prop-based manual logs from RbacManagement) ----
function getEventIcon(type: AuditEvent['type']) {
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
}

function getEventIconBg(type: AuditEvent['type']) {
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
}

function getEventCategory(type: AuditEvent['type']) {
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
}

// ---- AuditLogsFeed ----
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export function AuditLogsFeed() {
  const { t } = useTranslation();

  const { logs, status, reconnectCount } = useAuditStream({
    url: `${BACKEND_BASE_URL}/api/v1/audit/stream`,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            {t('rbac.audit.title')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('rbac.audit.description')}
          </p>
        </div>
        <div className="pt-1">
          <ConnectionBadge status={status} reconnectCount={reconnectCount} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center select-none">
            {status === 'connecting' || status === 'reconnecting' ? (
              <>
                <Loader2 className="size-8 text-muted-foreground/45 animate-spin" />
                <p className="mt-3 text-sm text-muted-foreground font-medium">
                  Waiting for live audit events…
                </p>
              </>
            ) : (
              <>
                <Shield className="size-10 text-muted-foreground/45 stroke-[1.5]" />
                <p className="mt-3 text-sm text-muted-foreground font-medium">
                  {status === 'disconnected'
                    ? 'Stream disconnected. Check backend connection.'
                    : t('rbac.audit.emptyState')}
                </p>
              </>
            )}
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

// Re-export AuditEvent type for external use (still used in RbacManagement addLog)
export type { AuditEvent };
