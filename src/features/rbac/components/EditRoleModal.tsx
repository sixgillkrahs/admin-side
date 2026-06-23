import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User, Role } from '../types';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (userId: string, newRole: Role) => void;
}

export function EditRoleModal({ isOpen, onClose, user, onSave }: EditRoleModalProps) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user.id, selectedRole);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300" />
        
        {/* Modal content container */}
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl focus:outline-none transition-all duration-300">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-foreground tracking-tight">
              {t('rbac.modal.title')}
            </Dialog.Title>
            <Dialog.Close className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-xs text-muted-foreground mt-1">
            {t('rbac.modal.description')}
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            {/* User Details Display */}
            <div className="rounded-lg bg-muted/40 p-4 border border-border/50 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t('rbac.modal.nameLabel')}</span>
                <span className="font-semibold text-foreground">{user.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t('rbac.modal.emailLabel')}</span>
                <span className="font-medium text-foreground select-all">{user.email}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t('rbac.modal.currentRoleLabel')}</span>
                <span className="font-medium px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Role Selector input */}
            <div className="space-y-2">
              <label htmlFor="role-select" className="text-xs font-semibold text-foreground">
                {t('rbac.modal.assignRoleLabel')}
              </label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
              >
                <option value="User">{t('rbac.modal.options.user')}</option>
                <option value="Moderator">{t('rbac.modal.options.moderator')}</option>
                <option value="Admin">{t('rbac.modal.options.admin')}</option>
              </select>
            </div>

            {/* Dialog Footer Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              >
                {t('rbac.modal.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-colors cursor-pointer"
              >
                {t('rbac.modal.save')}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
