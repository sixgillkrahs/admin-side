import { useState } from 'react';
import type { User, Role } from '../types';
import { UserDirectory } from './UserDirectory';
import { PermissionMatrix } from './PermissionMatrix';
import { EditRoleModal } from './EditRoleModal';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Nguyen', email: 'alice@businesschat.com', role: 'Admin', status: 'active', joinedDate: '2026-01-10' },
  { id: '2', name: 'Bob Tran', email: 'bob@businesschat.com', role: 'Moderator', status: 'active', joinedDate: '2026-02-15' },
  { id: '3', name: 'Charlie Le', email: 'charlie@businesschat.com', role: 'User', status: 'inactive', joinedDate: '2026-03-20' },
  { id: '4', name: 'Diana Pham', email: 'diana@businesschat.com', role: 'User', status: 'active', joinedDate: '2026-04-05' },
  { id: '5', name: 'Ethan Vu', email: 'ethan@businesschat.com', role: 'Moderator', status: 'active', joinedDate: '2026-05-12' },
];

export function RbacManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveRole = (userId: string, newRole: Role) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">RBAC Management</h1>
        <p className="text-muted-foreground mt-1">Manage user roles, access control claims, and system permissions.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* User Directory */}
        <div className="space-y-4">
          <UserDirectory users={users} onEditRole={handleEditRole} />
        </div>

        {/* Permission Matrix */}
        <div className="pt-4 border-t border-border">
          <PermissionMatrix />
        </div>
      </div>

      {/* Edit Role Modal (Recreated per user selection) */}
      {selectedUser && (
        <EditRoleModal
          key={selectedUser.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSave={handleSaveRole}
        />
      )}
    </div>
  );
}
