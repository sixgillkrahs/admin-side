import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t('dashboard.title');
      case 'rbac':
        return t('rbac.title');
      default:
        return t('sidebar.adminConsole');
    }
  };

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(nextLng);
    localStorage.setItem('i18nextLng', nextLng);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Shadcn Sidebar Toggle Trigger */}
        <SidebarTrigger />

        {/* Dynamic Title / Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Console</span>
          <span className="text-muted-foreground/30">/</span>
          <h1 className="text-sm font-semibold text-foreground">{getTitle()}</h1>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer select-none bg-background shadow-sm"
          aria-label="Toggle language"
        >
          <span className={i18n.language === 'en' ? 'text-primary font-bold' : 'text-muted-foreground'}>EN</span>
          <span className="text-muted-foreground/30">|</span>
          <span className={i18n.language === 'vi' ? 'text-primary font-bold' : 'text-muted-foreground'}>VI</span>
        </button>

        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>
      </div>
    </header>
  );
}
