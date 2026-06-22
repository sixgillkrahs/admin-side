import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { DashboardOverview } from '@/features/dashboard';
import { RbacManagement } from '@/features/rbac';

function App() {
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

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
