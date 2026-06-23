import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users, ShieldCheck, ScrollText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, Role } from '../types';
import { UserDirectory } from './UserDirectory';
import { PermissionMatrix } from './PermissionMatrix';
import { EditRoleModal } from './EditRoleModal';
import { CreateRoleModal } from './CreateRoleModal';
import { AuditLogsFeed } from './AuditLogsFeed';
import { api } from '@/lib/api';

interface RoleObject {
  id: number;
  name: string;
  description: string;
}

type TabId = 'users' | 'matrix' | 'audit';

interface Tab {
  id: TabId;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  badge?: number | null;
}

export function RbacManagement() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Active tab state
  const [activeTab, setActiveTab] = useState<TabId>('users');

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

  // Mutation for assigning a role to a user
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, oldRoleName, newRoleName }: { userId: string; oldRoleName: string; newRoleName: string }) => {
      const oldRoleObj = rolesData?.find((r) => r.name.toLowerCase() === oldRoleName.toLowerCase());
      const newRoleObj = rolesData?.find((r) => r.name.toLowerCase() === newRoleName.toLowerCase());

      if (!newRoleObj) throw new Error('Target role not found');

      if (oldRoleObj && oldRoleObj.id !== newRoleObj.id) {
        try {
          await api.delete(`/api/v1/users/${userId}/roles`, {
            data: { role_id: oldRoleObj.id },
          });
        } catch (e) {
          console.warn('Failed to revoke old role mapping:', e);
        }
      }

      await api.post(`/api/v1/users/${userId}/roles`, { role_id: newRoleObj.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Mutation for creating a new role
  const createRoleMutation = useMutation({
    mutationFn: (vars: { name: string; description: string }) =>
      api.post('/api/v1/roles', { name: vars.name, description: vars.description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveRole = (userId: string, newRole: Role) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      assignRoleMutation.mutate({ userId, oldRoleName: targetUser.role, newRoleName: newRole });
    }
  };

  const handleCreateRole = async (roleName: string, description: string) => {
    await createRoleMutation.mutateAsync({ name: roleName, description });
  };

  // Tab definitions
  const tabs: Tab[] = [
    {
      id: 'users',
      label: 'Người dùng',
      icon: Users,
      description: 'Quản lý danh sách và phân quyền người dùng',
      badge: usersData?.total ?? null,
    },
    {
      id: 'matrix',
      label: 'Ma trận quyền',
      icon: ShieldCheck,
      description: 'Cấu hình chính sách truy cập theo vai trò',
      badge: rolesList.length > 0 ? rolesList.length : null,
    },
    {
      id: 'audit',
      label: 'Nhật ký kiểm toán',
      icon: ScrollText,
      description: 'Theo dõi hoạt động hệ thống theo thời gian thực',
      badge: null,
    },
  ];

  const activeTabDef = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('rbac.title')}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('rbac.description')}</p>
        </div>
        {activeTab === 'users' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none cursor-pointer"
          >
            <Plus className="mr-2 size-4" />
            {t('rbac.createRoleBtn')}
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="relative">
        {/* Tab bar container */}
        <div className="flex items-stretch gap-1 rounded-xl border border-border bg-muted/40 p-1 backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'relative flex flex-1 items-center justify-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 select-none cursor-pointer outline-none',
                  isActive
                    ? 'bg-background text-foreground shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60',
                ].join(' ')}
              >
                <Icon className={`size-4 shrink-0 transition-colors ${isActive ? 'text-primary' : ''}`} />
                <span className="hidden sm:inline truncate">{tab.label}</span>
                {tab.badge != null && tab.badge > 0 && (
                  <span
                    className={[
                      'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-bold tabular-nums transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted-foreground/15 text-muted-foreground',
                    ].join(' ')}
                  >
                    {tab.badge > 999 ? '999+' : tab.badge}
                  </span>
                )}
                {/* Live dot for audit tab */}
                {tab.id === 'audit' && (
                  <span className="relative flex size-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab description strip */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground -mt-2">
        <activeTabDef.icon className="size-3.5 text-primary shrink-0" />
        <span>{activeTabDef.description}</span>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Users tab */}
        <div className={activeTab === 'users' ? 'block' : 'hidden'}>
          <UserDirectory
            users={users}
            onEditRole={handleEditRole}
            page={page}
            limit={limit}
            totalUsers={usersData?.total || 0}
            onPageChange={setPage}
            onLimitChange={(l) => { setLimit(l); setPage(1); }}
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
            onRoleChange={(r) => { setSelectedRole(r); setPage(1); }}
            selectedStatus={selectedStatus}
            onStatusChange={(s) => { setSelectedStatus(s); setPage(1); }}
            rolesList={rolesList}
          />
        </div>

        {/* Permission Matrix tab */}
        <div className={activeTab === 'matrix' ? 'block' : 'hidden'}>
          <PermissionMatrix />
        </div>

        {/* Audit Logs tab */}
        <div className={activeTab === 'audit' ? 'block' : 'hidden'}>
          <AuditLogsFeed />
        </div>
      </div>

      {/* Modals (always mounted, controlled by isOpen) */}
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
