import { useState } from 'react';
import { HeroBanner } from '../uis/HeroBanner';
import { AuthBanner } from '../uis/AuthBanner';
import { Breadcrumbs } from '../uis/Breadcrumbs';
import { useAuth } from '../app/useAuth';

export const Main = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('Пешая арена');

  const breadcrumbCurrent = !isAuthenticated && !isLoading ? 'Вход' : activeTab;

  return (
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      <Breadcrumbs current={breadcrumbCurrent} onNavigateHome={() => {}} />
      <HeroBanner onTabChange={setActiveTab} />
      <div style={{ padding: '0 24px', width: '100%', margin: '0 auto 40px' }}>
        {!isLoading && !isAuthenticated && <AuthBanner />}
      </div>
    </main>
  );
};
