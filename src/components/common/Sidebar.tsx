import { LayoutDashboard, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'rbac', name: 'RBAC Access', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar px-4 py-6 text-sidebar-foreground transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <span className="text-lg font-bold">BC</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Business Chat</h2>
              <span className="text-xs text-muted-foreground">Admin Console</span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 select-none",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
              >
                <Icon className={cn("size-5 transition-transform group-hover:scale-105", isActive && "text-primary")} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border pt-4 px-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-foreground truncate">Admin Account</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@businesschat.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
