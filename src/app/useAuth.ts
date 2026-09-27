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

  const fetchProfile = (token: string) => {
    return fetch(`${BOT_API}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: UserProfile) => {
        setUser(data);
        return data;
      })
      .catch(() => {
        localStorage.removeItem('arena_token');
        setUser(null);
        return null;
      });
  };

  useEffect(() => {
    const pendingSession = localStorage.getItem('pending_session');
    const existingToken = localStorage.getItem('arena_token');

    if (pendingSession && !existingToken) {
      fetch(`${BOT_API}/api/auth/check-session?token=${encodeURIComponent(pendingSession)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.status === 'approved' && data.authToken) {
            localStorage.removeItem('pending_session');
            localStorage.setItem('arena_token', data.authToken);
            setUser(data.user);
          }
        })
        .finally(() => setIsLoading(false));
      return;
    }

    if (!existingToken) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    fetchProfile(existingToken).finally(() => {
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
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    updateUser,
    logout,
  };
};
