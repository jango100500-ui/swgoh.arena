import { SearchInput } from '../uis/SearchInput';
import { useAuth } from './useAuth';

interface HeaderProps {
  showSearch?: boolean;
  onOpenProfile: () => void;
  onNavigateHome: () => void;
}

export const Header = ({ showSearch = true, onOpenProfile, onNavigateHome }: HeaderProps) => {
  const { user, isAuthenticated } = useAuth();

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
      <div
        onClick={onNavigateHome}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flexShrink: 0, cursor: 'pointer' }}
      >
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showSearch && <SearchInput />}

        <div
          onClick={isAuthenticated ? onOpenProfile : undefined}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            backgroundColor: '#080c14',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            cursor: isAuthenticated ? 'pointer' : 'default',
            border: isAuthenticated ? '1px solid #1e293b' : '1px solid #111726',
          }}
        >
          {isAuthenticated && user?.portraitId ? (
            <img
              src={`https://arena-tracker-proxy.onrender.com/portraitImage?portraitId=${encodeURIComponent(user.portraitId)}`}
              alt={user.playerName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
      </div>
    </header>
  );
};
