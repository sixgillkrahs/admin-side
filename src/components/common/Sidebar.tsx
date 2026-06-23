import { LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', name: t('sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'rbac', name: t('sidebar.rbacAccess'), icon: ShieldCheck },
  ];

  return (
    <ShadcnSidebar>
      {/* Sidebar Header */}
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <span className="text-lg font-bold">BC</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Business Chat</h2>
            <span className="text-xs text-muted-foreground">{t('sidebar.adminConsole')}</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Navigation Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setActiveTab(item.id)}
                      className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 select-none"
                    >
                      <Icon className={`size-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-foreground truncate">Admin Account</p>
            <p className="text-[10px] text-muted-foreground truncate">admin@businesschat.com</p>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
