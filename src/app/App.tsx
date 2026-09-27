import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from '../main/Main';
import { Profile } from '../pages/Profile';
import { useAuth } from './useAuth';

export const App = () => {
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');
  const { user, updateUser } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        showSearch={currentView === 'home'}
        onOpenProfile={() => setCurrentView('profile')}
        onNavigateHome={() => setCurrentView('home')}
      />
      <div style={{ flex: 1, paddingTop: '64px' }}>
        {currentView === 'profile' && user ? (
          <Profile
            user={user}
            onUpdateUser={updateUser}
            onNavigateHome={() => setCurrentView('home')}
          />
        ) : (
          <Main />
        )}
      </div>
      <Footer />
    </div>
  );
};
