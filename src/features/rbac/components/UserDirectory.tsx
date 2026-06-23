import { useState } from 'react';
import { Search, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '../types';

interface UserDirectoryProps {
  users: User[];
  onEditRole: (user: User) => void;
}

export function UserDirectory({ users, onEditRole }: UserDirectoryProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on query
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  // Get initials for Avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Get role badge style class names
  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50';
      case 'Moderator':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/50';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            {t('rbac.directory.title')}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('rbac.directory.description')}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Search className="size-4" />
          </span>
          <input
            type="text"
            placeholder={t('rbac.directory.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider select-none">
                <th className="px-6 py-4">{t('rbac.directory.columns.user')}</th>
                <th className="px-6 py-4">{t('rbac.directory.columns.email')}</th>
                <th className="px-6 py-4">{t('rbac.directory.columns.role')}</th>
                <th className="px-6 py-4">{t('rbac.directory.columns.status')}</th>
                <th className="px-6 py-4">{t('rbac.directory.columns.joinedDate')}</th>
                <th className="px-6 py-4 text-right">{t('rbac.directory.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs border border-primary/20">
                          {getInitials(user.name)}
                        </div>
                        <div className="font-medium text-foreground">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClasses(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${
                            user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-400'
                          }`}
                        />
                        <span className="capitalize text-xs text-foreground font-medium">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.joinedDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onEditRole(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                        title={t('rbac.directory.actions.editRole')}
                      >
                        <Edit className="size-3.5" />
                        <span>{t('rbac.directory.actions.editRole')}</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <h4 className="text-base font-semibold text-foreground">
                        {t('rbac.directory.emptyState.title')}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {t('rbac.directory.emptyState.description')}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
