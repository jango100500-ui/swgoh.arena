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
      <img
        src="/pngs/arena.png"
        alt="swgoh.arena"
        style={{
          height: '32px',
          width: 'auto',
          objectFit: 'contain',
          flexShrink: 0,
        }}
      />

      <SearchInput />
    </header>
  );
};
