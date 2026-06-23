import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import type { User, Role } from '../types';
import { UserDirectory } from './UserDirectory';
import { PermissionMatrix } from './PermissionMatrix';
import { EditRoleModal } from './EditRoleModal';
import { CreateRoleModal } from './CreateRoleModal';
import { AuditLogsFeed, type AuditEvent } from './AuditLogsFeed';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Nguyen', email: 'alice@businesschat.com', role: 'Admin', status: 'active', joinedDate: '2026-01-10' },
  { id: '2', name: 'Bob Tran', email: 'bob@businesschat.com', role: 'Moderator', status: 'active', joinedDate: '2026-02-15' },
  { id: '3', name: 'Charlie Le', email: 'charlie@businesschat.com', role: 'User', status: 'inactive', joinedDate: '2026-03-20' },
  { id: '4', name: 'Diana Pham', email: 'diana@businesschat.com', role: 'User', status: 'active', joinedDate: '2026-04-05' },
  { id: '5', name: 'Ethan Vu', email: 'ethan@businesschat.com', role: 'Moderator', status: 'active', joinedDate: '2026-05-12' },
];

export function RbacManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [roles, setRoles] = useState<string[]>(['Admin', 'Moderator', 'User']);
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({
    Admin: { 'read:messages': true, 'write:messages': true, 'manage:roles': true, 'admin:all': true },
    Moderator: { 'read:messages': true, 'write:messages': true, 'manage:roles': false, 'admin:all': false },
    User: { 'read:messages': true, 'write:messages': false, 'manage:roles': false, 'admin:all': false }
  });

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

  useEffect(() => {
    const interval = setInterval(() => {
      const userNames = users.map((u) => u.name);
      const randomUser = userNames[Math.floor(Math.random() * userNames.length)] || 'System User';
      const eventTypes: AuditEvent['type'][] = ['login', 'viewMatrix'];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      addLog(randomType, { name: randomUser });
    }, 15000);

    return () => clearInterval(interval);
  }, [users]);

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveRole = (userId: string, newRole: Role) => {
    const targetUser = users.find((u) => u.id === userId);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    if (targetUser) {
      addLog('changeRole', { user: targetUser.name, role: newRole });
    }
  };

  const handleCreateRole = (roleName: string, permissions: Record<string, boolean>) => {
    setRoles((prev) => [...prev, roleName]);
    setRolePermissions((prev) => ({
      ...prev,
      [roleName]: permissions,
    }));
    addLog('createRole', { role: roleName });
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
          <UserDirectory users={users} onEditRole={handleEditRole} />
        </div>

        {/* Permission Matrix */}
        <div className="pt-4 border-t border-border">
          <PermissionMatrix roles={roles} rolePermissions={rolePermissions} />
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
          roles={roles}
          onSave={handleSaveRole}
        />
      )}

      {/* Create Custom Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        existingRoles={roles}
        onSave={handleCreateRole}
      />
    </div>
  );
}
