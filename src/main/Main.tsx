import { HeroBanner } from '../uis/HeroBanner';
import { AuthBanner } from '../uis/AuthBanner';
import { useAuth } from '../app/useAuth';

export const Main = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeroBanner />
      <div style={{ padding: '0 24px', width: '100%' }}>
        {!isAuthenticated && <AuthBanner />}
      </div>
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', flex: 1 }} />
    </main>
  );
};
