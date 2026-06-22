import { Check, Minus } from 'lucide-react';
import type { Role } from '../types';

interface PermissionRow {
  permission: string;
  description: string;
  claims: Record<Role, boolean>;
}

const PERMISSION_ROWS: PermissionRow[] = [
  {
    permission: 'read:messages',
    description: 'Allows reading conversation threads and message logs.',
    claims: { Admin: true, Moderator: true, User: true },
  },
  {
    permission: 'write:messages',
    description: 'Allows sending messages and creating new chat channels.',
    claims: { Admin: true, Moderator: true, User: false },
  },
  {
    permission: 'manage:roles',
    description: 'Allows assigning roles and modifying permission matrices.',
    claims: { Admin: true, Moderator: false, User: false },
  },
  {
    permission: 'admin:all',
    description: 'Full administrative override capability across all systems.',
    claims: { Admin: true, Moderator: false, User: false },
  },
];

export function PermissionMatrix() {
  const roles: Role[] = ['Admin', 'Moderator', 'User'];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Role Permission Matrix</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Access control matrix displaying authorized capability claims by role.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider select-none">
                <th className="px-6 py-4 max-w-xs">Capability Claim</th>
                {roles.map((role) => (
                  <th key={role} className="px-6 py-4 text-center">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {PERMISSION_ROWS.map((row) => (
                <tr key={row.permission} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{row.permission}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{row.description}</div>
                  </td>
                  {roles.map((role) => {
                    const hasAccess = row.claims[role];
                    return (
                      <td key={role} className="px-6 py-4 text-center">
                        <div className="inline-flex items-center justify-center">
                          {hasAccess ? (
                            <span className="flex items-center justify-center size-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <Check className="size-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="flex items-center justify-center size-6 rounded-full bg-muted/50 text-muted-foreground border border-border/50">
                              <Minus className="size-3.5 text-slate-400" />
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
