import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TooltipProvider } from '@/components/ui/tooltip';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          {/* Sidebar Navigation */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main App Container */}
          <SidebarInset className="flex flex-col min-h-screen">
            <Header activeTab={activeTab} />
            
            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
