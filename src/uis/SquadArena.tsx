import { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../app/useAuth';

interface SquadArenaProps {
  user: UserProfile;
  onNavigateToHistory?: () => void;
}

interface Unit {
  id: string;
  name: string;
  alignment: 'light' | 'dark' | 'neutral' | 'galactic_legend';
  image: string;
}

interface ArenaData {
  rank: number;
  squad: Unit[];
}

interface BattleEvent {
  id: string;
  time: number;
  from: number;
  to: number;
  result: 'win' | 'loss';
}

const ALIGNMENT_COLORS: Record<Unit['alignment'], string> = {
  light: '#38bdf8',
  dark: '#ef4444',
  neutral: '#ffffff',
  galactic_legend: '#eab308',
};

export const SquadArena = ({ user, onNavigateToHistory }: SquadArenaProps) => {
  const [arena, setArena] = useState<ArenaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date>(new Date());
  const [history, setHistory] = useState<BattleEvent[]>([]);
  const lastRankRef = useRef<number | null>(null);

  const getStorageKey = () => `arena_history_${user.allyCode}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      setHistory([]);
    }
  }, [user.allyCode]);

  const addBattleEvent = (fromRank: number, toRank: number) => {
    if (fromRank === toRank) return;

    const isWin = fromRank > toRank;
    const newEvent: BattleEvent = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      time: Date.now(),
      from: fromRank,
      to: toRank,
      result: isWin ? 'win' : 'loss',
    };

    setHistory((prev) => {
      const updated = [newEvent, ...prev].slice(0, 50);
      try {
        localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const fetchArena = async () => {
    try {
      const res = await fetch(
        `https://arena-tracker-proxy.onrender.com/arena?allyCode=${encodeURIComponent(user.allyCode)}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();

      const profiles = Array.isArray(data.pvpProfile) ? data.pvpProfile : [];
      const squadProfile = profiles.find((p: { tab?: number | string }) => String(p.tab) === '1') || profiles[0];

      if (squadProfile) {
        const currentRank = Number(squadProfile.rank) || 0;

        if (lastRankRef.current !== null && lastRankRef.current !== currentRank) {
          addBattleEvent(lastRankRef.current, currentRank);
        }
        lastRankRef.current = currentRank;

        const cells = squadProfile.squad?.cell || [];
        const units: Unit[] = cells.map((u: Record<string, string>) => {
          const id = u.unitDefId || u.definitionId || '';
          return {
            id,
            name: u.name || u.baseId || id,
            alignment: (u.alignment as Unit['alignment']) || 'neutral',
            image: `https://arena-tracker-proxy.onrender.com/characterImage?definitionId=${encodeURIComponent(id)}`,
          };
        });

        setArena({
          rank: currentRank,
          squad: units,
        });
        setLastUpdatedTime(new Date());
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArena();
    const interval = setInterval(fetchArena, 1000);
    return () => clearInterval(interval);
  }, [user.allyCode]);

  const formattedTime = lastUpdatedTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const recentHistory = history.slice(0, 3);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <section
        style={{
          width: '100%',
          maxWidth: '1100px',
          padding: '24px 22px',
          backgroundColor: '#0e1422',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
            Ранг {loading ? '...' : `#${arena?.rank || '—'}`}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formattedTime}</span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            alignItems: 'start',
          }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '50%',
                      backgroundColor: '#1b2438',
                      animation: 'pulseSkeleton 1.2s infinite ease-in-out',
                    }}
                  />
                  <div
                    style={{
                      width: '52px',
                      height: '10px',
                      borderRadius: '3px',
                      backgroundColor: '#1b2438',
                      animation: 'pulseSkeleton 1.2s infinite ease-in-out',
                    }}
                  />
                </div>
              ))
            : arena?.squad.map((unit) => {
                const borderColor = ALIGNMENT_COLORS[unit.alignment] || '#ffffff';
                return (
                  <div key={unit.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0 }}>
                    <div
                      style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: '50%',
                        padding: '2px',
                        border: `2px solid ${borderColor}`,
                        backgroundColor: '#080c14',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={unit.image}
                        alt={unit.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          backgroundColor: '#080c14',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        marginTop: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        lineHeight: '13px',
                        maxHeight: '26px',
                        minHeight: '26px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                      }}
                    >
                      {unit.name}
                    </span>
                  </div>
                );
              })}
        </div>
      </section>

      <section
        style={{
          width: 'calc(100% - 36px)',
          maxWidth: '1064px',
          marginTop: '-4px',
          backgroundColor: '#090e18',
          border: '1px solid #162035',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          padding: '24px 20px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
          История боёв
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '80px' }}>
          {recentHistory.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 0', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>
                История пока что пуста
              </span>
              <span style={{ fontSize: '12px', color: '#475569' }}>
                Сыграй разок на арене
              </span>
            </div>
          ) : (
            recentHistory.map((item) => {
              const isWin = item.result === 'win';
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #111a2d',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isWin ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" stroke="#22c55e" strokeWidth="2" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" stroke="#ef4444" strokeWidth="2" />
                      </svg>
                    )}

                    <span style={{ fontSize: '13px', fontWeight: 700, color: isWin ? '#22c55e' : '#ef4444' }}>
                      {isWin ? 'Победа' : 'Поражение'}
                    </span>

                    {!isWin && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '3px',
                          backgroundColor: '#261215',
                          color: '#f87171',
                          border: '1px solid #3f191e',
                        }}
                      >
                        [Деф]
                      </span>
                    )}

                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>
                      {new Date(item.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: isWin ? '#22c55e' : '#ef4444' }}>
                      {isWin ? '▲' : '▼'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>
                      #{item.from} → #{item.to}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onNavigateToHistory}
          style={{
            width: '100%',
            backgroundColor: '#111726',
            color: '#94a3b8',
            fontSize: '13px',
            fontWeight: 700,
            padding: '10px 16px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#182035';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#111726';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          Смотреть историю
        </button>
      </section>
    </div>
  );
};
