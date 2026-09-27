import { useState } from 'react';
import { UserProfile } from '../app/useAuth';
import { Breadcrumbs } from '../uis/Breadcrumbs';
import { Toast } from '../uis/Toast';

const BOT_API = 'https://swgoh-arena-bot.onrender.com';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const Profile = ({ user, onUpdateUser, onLogout, onNavigateHome }: ProfileProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isToastLeaving, setIsToastLeaving] = useState(false);

  const triggerToast = (type: 'success' | 'error', text: string) => {
    setIsToastLeaving(false);
    setToast({ type, text });

    setTimeout(() => {
      setIsToastLeaving(true);
      setTimeout(() => setToast(null), 300);
    }, 3000);
  };

  const handleSync = async () => {
    if (isSyncing || toast) return;

    const token = localStorage.getItem('arena_token');
    if (!token) return;

    setIsSyncing(true);

    try {
      const res = await fetch(`${BOT_API}/api/auth/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const freshUser: UserProfile = await res.json();
      onUpdateUser(freshUser);
      triggerToast('success', 'Синхронизировано!');
    } catch {
      triggerToast('error', 'Упс, ошибка!');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {toast && <Toast type={toast.type} text={toast.text} isLeaving={isToastLeaving} />}

      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
        <Breadcrumbs current="Профиль" onNavigateHome={onNavigateHome} showBackButton={true} />
      </div>

      <section style={{ maxWidth: '800px', width: '100%', margin: '8px auto 48px', padding: '0 24px' }}>
        <div
          style={{
            backgroundColor: '#0e1422',
            borderRadius: '6px',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {isSyncing ? (
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '6px',
                  backgroundColor: '#1b2438',
                  animation: 'pulseSkeleton 1.2s infinite ease-in-out',
                  flexShrink: 0,
                }}
              />
            ) : (
              <img
                src={`https://arena-tracker-proxy.onrender.com/portraitImage?portraitId=${encodeURIComponent(user.portraitId)}`}
                alt={user.playerName}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  backgroundColor: '#080c14',
                  flexShrink: 0,
                }}
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0, flex: 1 }}>
              {isSyncing ? (
                <>
                  <div style={{ width: '160px', height: '22px', backgroundColor: '#1b2438', borderRadius: '4px', animation: 'pulseSkeleton 1.2s infinite ease-in-out' }} />
                  <div style={{ width: '120px', height: '16px', backgroundColor: '#1b2438', borderRadius: '4px', animation: 'pulseSkeleton 1.2s infinite ease-in-out' }} />
                  <div style={{ width: '200px', height: '16px', backgroundColor: '#1b2438', borderRadius: '4px', animation: 'pulseSkeleton 1.2s infinite ease-in-out' }} />
                </>
              ) : (
                <>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', wordBreak: 'break-word' }}>
                    {user.playerName}
                  </span>
                  <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 600 }}>
                    {user.title || '—'}
                  </span>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>
                    Гильдия:{' '}
                    <span style={{ color: user.guildName ? '#cbd5e1' : '#64748b', fontWeight: 600 }}>
                      {user.guildName || '—'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleSync}
              disabled={isSyncing || Boolean(toast)}
              style={{
                width: '100%',
                backgroundColor: '#2563EB',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                padding: '13px 24px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease, opacity 0.15s ease',
                opacity: isSyncing || Boolean(toast) ? 0.45 : 1,
                cursor: isSyncing || Boolean(toast) ? 'default' : 'pointer',
              }}
              onMouseOver={(e) => !isSyncing && !toast && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseOut={(e) => !isSyncing && !toast && (e.currentTarget.style.backgroundColor = '#2563EB')}
            >
              {isSyncing ? 'Синхронизация...' : 'Синхронизировать'}
            </button>

            <button
              onClick={onLogout}
              style={{
                width: '100%',
                backgroundColor: '#141a29',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1e283d';
                e.currentTarget.style.color = '#f8fafc';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#141a29';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
