import { useMemo } from 'react';
import { Check, Minus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ---- Backend model shapes ----
interface RoleObj {
  id: number;
  name: string;
  description: string;
}

interface ResourceObj {
  id: number;
  name: string;
  description: string;
}

interface ActionObj {
  id: number;
  name: string;
  description: string;
}

interface PolicyObj {
  id: number;
  role_id: number;
  resource_id: number;
  action_id: number;
  effect: string;
  role?: RoleObj;
  resource?: ResourceObj;
  action?: ActionObj;
}

// ---- Helpers ----
function makePolicyKey(roleId: number, resourceId: number, actionId: number) {
  return `${roleId}:${resourceId}:${actionId}`;
}

export function PermissionMatrix() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // ---- Queries ----
  const { data: roles = [], isLoading: rolesLoading } = useQuery<RoleObj[]>({
    queryKey: ['roles'],
    queryFn: () => api.get('/api/v1/roles').then((r) => r.data),
    staleTime: 30_000,
  });

  const { data: resources = [], isLoading: resourcesLoading } = useQuery<ResourceObj[]>({
    queryKey: ['resources'],
    queryFn: () => api.get('/api/v1/resources').then((r) => r.data),
    staleTime: 30_000,
  });

  const { data: actions = [], isLoading: actionsLoading } = useQuery<ActionObj[]>({
    queryKey: ['actions'],
    queryFn: () => api.get('/api/v1/actions').then((r) => r.data),
    staleTime: 30_000,
  });

  const { data: policies = [], isLoading: policiesLoading } = useQuery<PolicyObj[]>({
    queryKey: ['policies'],
    queryFn: () => api.get('/api/v1/policies').then((r) => r.data),
    staleTime: 10_000,
  });

  const isLoading = rolesLoading || resourcesLoading || actionsLoading || policiesLoading;

  // Build a set of active policy keys for O(1) lookups
  const activePolicyMap = useMemo(() => {
    const map = new Map<string, number>(); // key -> policy id
    for (const p of policies) {
      if (p.effect !== 'deny') {
        map.set(makePolicyKey(p.role_id, p.resource_id, p.action_id), p.id);
      }
    }
    return map;
  }, [policies]);

  // ---- Mutations ----
  const addPolicy = useMutation({
    mutationFn: (vars: { roleId: number; resourceId: number; actionId: number }) =>
      api.post('/api/v1/policies', {
        role_id: vars.roleId,
        resource_id: vars.resourceId,
        action_id: vars.actionId,
        effect: 'allow',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });

  const removePolicy = useMutation({
    mutationFn: (policyId: number) => api.delete(`/api/v1/policies/${policyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });

  const handleToggle = (role: RoleObj, resource: ResourceObj, action: ActionObj) => {
    const key = makePolicyKey(role.id, resource.id, action.id);
    const existingPolicyId = activePolicyMap.get(key);

    if (existingPolicyId !== undefined) {
      removePolicy.mutate(existingPolicyId);
    } else {
      addPolicy.mutate({ roleId: role.id, resourceId: resource.id, actionId: action.id });
    }
  };

  const isMutating = addPolicy.isPending || removePolicy.isPending;

  // Build a flat list of permission rows: resource × action
  const rows = useMemo(() => {
    const result: { resource: ResourceObj; action: ActionObj }[] = [];
    for (const resource of resources) {
      for (const action of actions) {
        result.push({ resource, action });
      }
    }
    return result;
  }, [resources, actions]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            {t('rbac.matrix.title')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('rbac.matrix.description')}
          </p>
        </div>
        {isMutating && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <Loader2 className="size-3 animate-spin" />
            <span>Saving…</span>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin" />
              <span>Loading policy matrix…</span>
            </div>
          ) : roles.length === 0 || resources.length === 0 || actions.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No roles, resources, or actions configured yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider select-none">
                  <th className="px-6 py-4 max-w-xs">{t('rbac.matrix.claimHeader')}</th>
                  {roles.map((role) => (
                    <th key={role.id} className="px-6 py-4 text-center capitalize">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {rows.map(({ resource, action }) => {
                  const permissionLabel = `${action.name}:${resource.name}`;
                  return (
                    <tr key={permissionLabel} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{permissionLabel}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                          {action.description || `${action.name} access to ${resource.name}`}
                        </div>
                      </td>
                      {roles.map((role) => {
                        const key = makePolicyKey(role.id, resource.id, action.id);
                        const hasAccess = activePolicyMap.has(key);
                        return (
                          <td key={role.id} className="px-6 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggle(role, resource, action)}
                              disabled={isMutating}
                              title={hasAccess ? 'Revoke this policy' : 'Grant this policy'}
                              className="inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 transition-transform hover:scale-110 active:scale-95"
                            >
                              {hasAccess ? (
                                <span className="flex items-center justify-center size-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                                  <Check className="size-3.5 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="flex items-center justify-center size-6 rounded-full bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted transition-colors">
                                  <Minus className="size-3.5 text-slate-400" />
                                </span>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
