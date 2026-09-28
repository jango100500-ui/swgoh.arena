import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from '../main/Main';
import { Profile } from '../pages/Profile';
import { useAuth } from './useAuth';
import { TabType, TAB_PATHS } from '../uis/HeroBanner';

const getInitialRoute = (): { view: 'home' | 'profile'; tab: TabType } => {
  if (typeof window === 'undefined') return { view: 'home', tab: 'Пешая арена' };
  const path = window.location.pathname;

  if (path === '/profile') return { view: 'profile', tab: 'Пешая арена' };
  if (path === '/fleet') return { view: 'home', tab: 'Флот' };
  if (path === '/rating') return { view: 'home', tab: 'Рейтинг' };
  if (path === '/history') return { view: 'home', tab: 'История' };

  return { view: 'home', tab: 'Пешая арена' };
};

export const App = () => {
  const [route, setRoute] = useState(getInitialRoute);
  const { user, isAuthenticated, isLoading, updateUser, logout } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string, newRoute: { view: 'home' | 'profile'; tab: TabType }) => {
    window.history.pushState({}, '', path);
    setRoute(newRoute);
  };

  const handleSelectTab = (tab: TabType) => {
    navigateTo(TAB_PATHS[tab], { view: 'home', tab });
  };

  const handleOpenProfile = () => {
    navigateTo('/profile', { view: 'profile', tab: route.tab });
  };

  const handleNavigateHome = () => {
    navigateTo('/', { view: 'home', tab: 'Пешая арена' });
  };

  const handleLogout = () => {
    logout();
    handleNavigateHome();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        showSearch={route.view === 'home'}
        onOpenProfile={handleOpenProfile}
        onNavigateHome={handleNavigateHome}
      />
      <div style={{ flex: 1, paddingTop: '64px' }}>
        {route.view === 'profile' && user ? (
          <Profile
            user={user}
            onUpdateUser={updateUser}
            onLogout={handleLogout}
            onNavigateHome={handleNavigateHome}
          />
        ) : (
          <Main
            user={user}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            activeTab={route.tab}
            onSelectTab={handleSelectTab}
            onNavigateHome={handleNavigateHome}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};
