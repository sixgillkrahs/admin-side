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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingRoles: string[];
  onSave: (roleName: string, description: string) => Promise<void>;
  isSaving?: boolean;
}

export function CreateRoleModal({
  isOpen,
  onClose,
  existingRoles,
  onSave,
  isSaving = false,
}: CreateRoleModalProps) {
  const { t } = useTranslation();
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

    await onSave(trimmedName, description.trim());
    // Reset form states
    setRoleName('');
    setDescription('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('rbac.createRoleModal.title')}</DialogTitle>
          <DialogDescription>
            {t('rbac.createRoleModal.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
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
              disabled={isSaving}
            />
            {error && (
              <p className="text-xs font-medium text-destructive mt-1.5 transition-all">
                {error}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="role-desc-input" className="text-xs font-semibold text-foreground">
              Description <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="role-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this role's purpose…"
              disabled={isSaving}
            />
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-2 sm:justify-end gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRoleName('');
                setDescription('');
                setError(null);
                onClose();
              }}
              className="cursor-pointer"
              disabled={isSaving}
            >
              {t('rbac.createRoleModal.cancel')}
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                  Creating…
                </>
              ) : (
                t('rbac.createRoleModal.submit')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
