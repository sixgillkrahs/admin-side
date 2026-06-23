import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, Role } from '../types';
import { UserDirectory } from './UserDirectory';
import { PermissionMatrix } from './PermissionMatrix';
import { EditRoleModal } from './EditRoleModal';
import { CreateRoleModal } from './CreateRoleModal';
import { AuditLogsFeed, type AuditEvent } from './AuditLogsFeed';
import { api } from '@/lib/api';

interface RoleObject {
  id: number;
  name: string;
  description: string;
}

export function RbacManagement() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Search, Pagination, Sorting and Filter States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [logs, setLogs] = useState<AuditEvent[]>(() => [
    {
      id: 'init-1',
      type: 'login',
      timestamp: new Date(Date.now() - 60000 * 5).toTimeString().split(' ')[0],
      details: { name: 'Alice Nguyen' },
    },
    {
      id: 'init-2',
      type: 'viewMatrix',
      timestamp: new Date(Date.now() - 60000 * 2).toTimeString().split(' ')[0],
      details: { name: 'Ethan Vu' },
    },
  ]);

  const addLog = (type: AuditEvent['type'], details: Record<string, string>) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:ss
    const newLog: AuditEvent = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type,
      timestamp,
      details,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 20));
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Roles from Backend
  const { data: rolesData } = useQuery<RoleObject[]>({
    queryKey: ['roles'],
    queryFn: () => api.get('/api/v1/roles').then((res) => res.data),
  });

  // Map Backend roles to string list for filters / dropdowns
  const rolesList = useMemo(() => {
    if (!rolesData || rolesData.length === 0) return ['Admin', 'Moderator', 'User'];
    return rolesData.map((r) => r.name.charAt(0).toUpperCase() + r.name.slice(1));
  }, [rolesData]);

  // Fetch Users from Backend
  const { data: usersData } = useQuery<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>({
    queryKey: ['users', page, limit, sortBy, sortOrder, debouncedSearch, selectedRole, selectedStatus],
    queryFn: async () => {
      const res = await api.get('/api/v1/users', {
        params: {
          page,
          limit,
          sort_by: sortBy,
          sort_order: sortOrder,
          search: debouncedSearch,
          role: selectedRole.toLowerCase(),
          status: selectedStatus,
        },
      });
      return res.data;
    },
  });

  const users = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.map((u) => ({
      ...u,
      role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
    }));
  }, [usersData]);

  // Sync log simulation with users query
  useEffect(() => {
    if (users.length === 0) return;
    const interval = setInterval(() => {
      const userNames = users.map((u) => u.name);
      const randomUser = userNames[Math.floor(Math.random() * userNames.length)] || 'System User';
      const eventTypes: AuditEvent['type'][] = ['login', 'viewMatrix'];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      addLog(randomType, { name: randomUser });
    }, 15000);

    return () => clearInterval(interval);
  }, [users]);

  // Mutation for assigning a role to a user
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, oldRoleName, newRoleName }: { userId: string; oldRoleName: string; newRoleName: string }) => {
      const oldRoleObj = rolesData?.find((r) => r.name.toLowerCase() === oldRoleName.toLowerCase());
      const newRoleObj = rolesData?.find((r) => r.name.toLowerCase() === newRoleName.toLowerCase());

      if (!newRoleObj) {
        throw new Error('Target role not found');
      }

      // Revoke old role if different
      if (oldRoleObj && oldRoleObj.id !== newRoleObj.id) {
        try {
          await api.delete(`/api/v1/users/${userId}/roles`, {
            data: { role_id: oldRoleObj.id },
          });
        } catch (e) {
          console.warn('Failed to revoke old role mapping:', e);
        }
      }

      // Assign new role
      await api.post(`/api/v1/users/${userId}/roles`, {
        role_id: newRoleObj.id,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      const targetUser = users.find((u) => u.id === variables.userId);
      if (targetUser) {
        addLog('changeRole', { user: targetUser.name, role: variables.newRoleName });
      }
    },
  });

  // Mutation for creating a new role
  const createRoleMutation = useMutation({
    mutationFn: (vars: { name: string; description: string }) =>
      api.post('/api/v1/roles', { name: vars.name, description: vars.description }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      addLog('createRole', { role: variables.name });
    },
  });

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveRole = (userId: string, newRole: Role) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      assignRoleMutation.mutate({
        userId,
        oldRoleName: targetUser.role,
        newRoleName: newRole,
      });
    }
  };

  const handleCreateRole = async (roleName: string, description: string) => {
    await createRoleMutation.mutateAsync({ name: roleName, description });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('rbac.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('rbac.description')}</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none cursor-pointer"
        >
          <Plus className="mr-2 size-4" />
          {t('rbac.createRoleBtn')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* User Directory */}
        <div className="space-y-4">
          <UserDirectory
            users={users}
            onEditRole={handleEditRole}
            page={page}
            limit={limit}
            totalUsers={usersData?.total || 0}
            onPageChange={setPage}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={(field) => {
              if (sortBy === field) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy(field);
                setSortOrder('asc');
              }
            }}
            searchQuery={search}
            onSearchChange={setSearch}
            selectedRole={selectedRole}
            onRoleChange={(r) => {
              setSelectedRole(r);
              setPage(1);
            }}
            selectedStatus={selectedStatus}
            onStatusChange={(s) => {
              setSelectedStatus(s);
              setPage(1);
            }}
            rolesList={rolesList}
          />
        </div>

        {/* Permission Matrix — self-contained, fetches its own data */}
        <div className="pt-4 border-t border-border">
          <PermissionMatrix />
        </div>

        {/* Security Audit Logs */}
        <div className="pt-4 border-t border-border">
          <AuditLogsFeed logs={logs} />
        </div>
      </div>

      {/* Edit Role Modal */}
      {selectedUser && (
        <EditRoleModal
          key={selectedUser.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          roles={rolesList}
          onSave={handleSaveRole}
        />
      )}

      {/* Create Custom Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        existingRoles={rolesList}
        onSave={handleCreateRole}
        isSaving={createRoleMutation.isPending}
      />
    </div>
  );
}
