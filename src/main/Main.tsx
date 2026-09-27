import { HeroBanner } from '../uis/HeroBanner';
import { AuthBanner } from '../uis/AuthBanner';
import { useAuth } from '../app/useAuth';

export const Main = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main style={{ display: 'flex', flexDirection: 'column', paddingBottom: '48px' }}>
      <HeroBanner />
      <div style={{ padding: '0 24px', width: '100%' }}>
        {!isAuthenticated && <AuthBanner />}
      </div>
    </main>
  );
};
