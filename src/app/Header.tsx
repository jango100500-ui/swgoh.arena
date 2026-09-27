import { SearchInput } from '../uis/SearchInput';

export const Header = () => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
        backgroundColor: '#111726',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src="/pngs/arena.png"
          alt="Arena Logo"
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
        <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
          swgoh<span style={{ color: '#2563EB' }}>.arena</span>
        </span>
      </div>

      <SearchInput />
    </header>
  );
};
