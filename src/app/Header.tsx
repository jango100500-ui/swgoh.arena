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
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flexShrink: 0 }}>
        <img
          src="/pngs/favicon.png"
          alt="Logo"
          style={{
            width: '28px',
            height: '28px',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', whiteSpace: 'nowrap' }}>
          swgoh<span style={{ color: '#2563EB' }}>.arena</span>
        </span>
      </div>

      <SearchInput />
    </header>
  );
};
