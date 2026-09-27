import { useState, useEffect } from 'react';

const BOT_API = 'https://swgoh-arena-bot.onrender.com';

export interface UserProfile {
  allyCode: string;
  playerName: string;
  portraitId: string;
  guildName?: string;
  title?: string;
}

export const useAuth = () => {
  if (typeof window !== 'undefined' && window.location.search.includes('logout')) {
    localStorage.clear();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem('arena_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(!user);

  useEffect(() => {
    const pendingSession = localStorage.getItem('pending_session');
    const existingToken = localStorage.getItem('arena_token');

    if (pendingSession) {
      const checkSession = async () => {
        try {
          const res = await fetch(`${BOT_API}/api/auth/check-session?token=${encodeURIComponent(pendingSession)}`);
          if (!res.ok) return;
          const data = await res.json();

          if (data?.status === 'approved' && data.authToken) {
            localStorage.removeItem('pending_session');
            localStorage.setItem('arena_token', data.authToken);
            if (data.user) {
              localStorage.setItem('arena_user', JSON.stringify(data.user));
              setUser(data.user);
            }
            window.location.reload();
          }
        } catch {
          // Polling
        }
      };

      checkSession();
      const interval = setInterval(checkSession, 2500);

      const onFocus = () => checkSession();
      window.addEventListener('focus', onFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', onFocus);
      };
    }

    if (!existingToken) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    fetch(`${BOT_API}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${existingToken}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem('arena_token');
          localStorage.removeItem('arena_user');
          setUser(null);
          return;
        }
        if (res.ok) {
          const data: UserProfile = await res.json();
          localStorage.setItem('arena_user', JSON.stringify(data));
          setUser(data);
        }
      })
      .catch(() => {
        // Keep cached
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updated };
      localStorage.setItem('arena_user', JSON.stringify(merged));
      return merged;
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    updateUser,
    logout,
  };
};
