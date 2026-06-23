import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingRoles: string[];
  onSave: (roleName: string, permissions: Record<string, boolean>) => void;
}

export function CreateRoleModal({ isOpen, onClose, existingRoles, onSave }: CreateRoleModalProps) {
  const { t } = useTranslation();
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    'read:messages': false,
    'write:messages': false,
    'manage:roles': false,
    'admin:all': false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = roleName.trim();

    if (!trimmedName) {
      setError(t('rbac.createRoleModal.errorEmpty'));
      return;
    }

    if (existingRoles.some((role) => role.toLowerCase() === trimmedName.toLowerCase())) {
      setError(t('rbac.createRoleModal.errorDuplicate'));
      return;
    }

    onSave(trimmedName, permissions);
    // Reset form states
    setRoleName('');
    setPermissions({
      'read:messages': false,
      'write:messages': false,
      'manage:roles': false,
      'admin:all': false,
    });
    setError(null);
    onClose();
  };

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const permissionItems = [
    {
      key: 'read:messages',
      label: 'read:messages',
      descKey: 'rbac.matrix.readMessages',
    },
    {
      key: 'write:messages',
      label: 'write:messages',
      descKey: 'rbac.matrix.writeMessages',
    },
    {
      key: 'manage:roles',
      label: 'manage:roles',
      descKey: 'rbac.matrix.manageRoles',
    },
    {
      key: 'admin:all',
      label: 'admin:all',
      descKey: 'rbac.matrix.adminAll',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('rbac.createRoleModal.title')}</DialogTitle>
          <DialogDescription>
            {t('rbac.createRoleModal.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Role Name Field */}
          <div className="space-y-2">
            <label htmlFor="role-name-input" className="text-xs font-semibold text-foreground">
              {t('rbac.createRoleModal.nameLabel')}
            </label>
            <Input
              id="role-name-input"
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t('rbac.createRoleModal.namePlaceholder')}
              className={error ? 'border-destructive focus-visible:ring-destructive/50' : ''}
              autoFocus
            />
            {error && (
              <p className="text-xs font-medium text-destructive mt-1.5 transition-all">
                {error}
              </p>
            )}
          </div>

          {/* Permissions Checklist */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-foreground">
              {t('rbac.createRoleModal.permissionsLabel')}
            </label>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {permissionItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3 select-none hover:bg-muted/40 transition-colors"
                >
                  <Checkbox
                    id={`permission-${item.key}`}
                    checked={permissions[item.key]}
                    onCheckedChange={(checked) => handleCheckboxChange(item.key, !!checked)}
                    className="mt-0.5 cursor-pointer"
                  />
                  <div className="grid gap-1">
                    <label
                      htmlFor={`permission-${item.key}`}
                      className="text-xs font-bold leading-none text-foreground cursor-pointer"
                    >
                      {item.label}
                    </label>
                    <span className="text-[11px] text-muted-foreground leading-normal">
                      {t(item.descKey)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-2 sm:justify-end gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRoleName('');
                setError(null);
                onClose();
              }}
              className="cursor-pointer"
            >
              {t('rbac.createRoleModal.cancel')}
            </Button>
            <Button type="submit" className="cursor-pointer">
              {t('rbac.createRoleModal.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
