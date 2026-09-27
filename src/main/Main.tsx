import { useState } from 'react';
import { HeroBanner, TabType } from '../uis/HeroBanner';
import { AuthBanner } from '../uis/AuthBanner';
import { SquadArena } from '../uis/SquadArena';
import { BattleHistory } from '../uis/BattleHistory';
import { UserProfile } from '../app/useAuth';

interface MainProps {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const Main = ({ user, isAuthenticated, isLoading }: MainProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('Пешая арена');

  const breadcrumbCurrent = !isAuthenticated && !isLoading ? 'Вход' : activeTab;

  return (
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      <HeroBanner
        activeTab={activeTab}
        breadcrumbCurrent={breadcrumbCurrent}
        onNavigateHome={() => setActiveTab('Пешая арена')}
        onTabChange={setActiveTab}
      />
      <div style={{ padding: '0 24px', width: '100%', margin: '0 auto 40px' }}>
        {!isLoading && !isAuthenticated && <AuthBanner />}
        {isAuthenticated && user && activeTab === 'Пешая арена' && (
          <SquadArena user={user} onViewHistory={() => setActiveTab('История')} />
        )}
        {isAuthenticated && user && activeTab === 'История' && (
          <BattleHistory user={user} />
        )}
      </div>
    </main>
  );
};
