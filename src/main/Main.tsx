import { useState } from 'react';
import { HeroBanner } from '../uis/HeroBanner';
import { AuthBanner } from '../uis/AuthBanner';
import { useAuth } from '../app/useAuth';

export const Main = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('Пешая арена');

  const breadcrumbCurrent = !isAuthenticated && !isLoading ? 'Вход' : activeTab;

  return (
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      <HeroBanner
        breadcrumbCurrent={breadcrumbCurrent}
        onNavigateHome={() => {}}
        onTabChange={setActiveTab}
      />
      <div style={{ padding: '0 24px', width: '100%', margin: '0 auto 40px' }}>
        {!isLoading && !isAuthenticated && <AuthBanner />}
      </div>
    </main>
  );
};
