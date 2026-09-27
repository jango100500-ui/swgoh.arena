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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const pendingSession = localStorage.getItem('pending_session');

    if (pendingSession) {
      const checkSession = async () => {
        try {
          const res = await fetch(`${BOT_API}/api/auth/check-session?token=${encodeURIComponent(pendingSession)}`);
          if (!res.ok) return;
          const data = await res.json();

          if (data?.status === 'approved' && data.authToken) {
            localStorage.removeItem('pending_session');
            localStorage.setItem('arena_token', data.authToken);
            window.location.reload();
          }
        } catch {
          // Keep polling
        }
      };

      checkSession();
      const interval = setInterval(checkSession, 2000);
      window.addEventListener('focus', checkSession);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', checkSession);
      };
    }

    const existingToken = localStorage.getItem('arena_token');

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
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: UserProfile) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem('arena_token');
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const logout = () => {
    localStorage.removeItem('arena_token');
    localStorage.removeItem('pending_session');
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
