import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ activeTab, setSidebarOpen }: HeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'rbac':
        return 'Role-Based Access Control';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Menu Toggle */}
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-muted md:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="size-5 text-foreground" />
        </button>

        {/* Dynamic Title / Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Console</span>
          <span className="text-muted-foreground/30">/</span>
          <h1 className="text-sm font-semibold text-foreground">{getTitle()}</h1>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
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
