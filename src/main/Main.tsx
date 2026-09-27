import { HeroBanner } from '../uis/HeroBanner';
import { AuthBanner } from '../uis/AuthBanner';
import { useAuth } from '../app/useAuth';

export const Main = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
      <HeroBanner />
      <div style={{ padding: '0 24px', width: '100%', flex: 1 }}>
        {!isLoading && !isAuthenticated && <AuthBanner />}
      </div>
    </main>
  );
};
