import { HeroBanner } from '../uis/HeroBanner';
import { AuthBanner } from '../uis/AuthBanner';
import { useAuth } from '../app/useAuth';

export const Main = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <main style={{ display: 'flex', flexDirection: 'column' }}>
      <HeroBanner />
      <div style={{ padding: '0 24px', width: '100%', margin: '0 auto 40px' }}>
        {!isLoading && !isAuthenticated && <AuthBanner />}
      </div>
    </main>
  );
};
