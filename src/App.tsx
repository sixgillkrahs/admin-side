import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { DashboardOverview } from '@/features/dashboard';
import { RbacManagement } from '@/features/rbac';
import { LoginScreen, useAuthStore } from '@/features/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const token = useAuthStore((state) => state.token);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'rbac':
        return <RbacManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!token) {
    return <LoginScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
