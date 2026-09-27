import { useState, useEffect } from 'react';

export interface UserProfile {
  allyCode: string;
  playerName: string;
  portraitId: string;
  guildName?: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('arena_token');

    if (!token) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    fetch('https://arena-tracker-2uod.onrender.com/api/auth/me', {
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
      })
      .catch(() => {
        localStorage.removeItem('arena_token');
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem('arena_token');
    setUser(null);
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    logout,
  };
};
