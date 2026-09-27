import { HeroBanner } from '../uis/HeroBanner';

export const Main = () => {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeroBanner />
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', flex: 1 }} />
    </main>
  );
};
