import { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../app/useAuth';
import { MetricsBar } from './MetricsBar';

interface SquadArenaProps {
  user: UserProfile;
  onViewHistory: () => void;
}

interface Unit {
  id: string;
  name: string;
  alignment: 'light' | 'dark' | 'neutral' | 'galactic_legend';
  image: string;
}

interface BattleEvent {
  id: string;
  time: number;
  from: number;
  to: number;
  delta: number;
  result: 'win' | 'loss';
}

const ALIGNMENT_COLORS: Record<Unit['alignment'], string> = {
  light: '#38bdf8',
  dark: '#ef4444',
  neutral: '#ffffff',
  galactic_legend: '#eab308',
};

export const SquadArena = ({ user, onViewHistory }: SquadArenaProps) => {
  const [rank, setRank] = useState<number | string>('—');
  const [squad, setSquad] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date>(new Date());
  const [history, setHistory] = useState<BattleEvent[]>([]);
  const [copied, setCopied] = useState(false);
  const lastRankRef = useRef<number | null>(null);

  const storageKey = `arena_tracker_history_${user.allyCode}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      setHistory([]);
    }
  }, [storageKey]);

  const pollArena = async () => {
    try {
      const res = await fetch(
        `https://arena-tracker-proxy.onrender.com/arena?allyCode=${encodeURIComponent(user.allyCode)}`
      );
      if (!res.ok) return;
      const data = await res.json();

      const profiles = Array.isArray(data.pvpProfile) ? data.pvpProfile : [];
      const squadProfile = profiles.find((p: { tab?: number | string }) => String(p.tab) === '1') || profiles[0];

      if (squadProfile) {
        const currentRankNum = Number(squadProfile.rank) || 0;
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

        setSquad(units);
        setRank(squadProfile.rank || '—');
        setLastUpdatedTime(new Date());

        if (lastRankRef.current !== null && currentRankNum > 0 && lastRankRef.current !== currentRankNum) {
          const delta = lastRankRef.current - currentRankNum;
          const isWin = delta > 0;

          const newEvent: BattleEvent = {
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            time: Date.now(),
            from: lastRankRef.current,
            to: currentRankNum,
            delta: Math.abs(delta),
            result: isWin ? 'win' : 'loss',
          };

          setHistory((prev) => {
            const updated = [newEvent, ...prev].slice(0, 100);
            localStorage.setItem(storageKey, JSON.stringify(updated));
            return updated;
          });
        }

        if (currentRankNum > 0) {
          lastRankRef.current = currentRankNum;
        }
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pollArena();
    const interval = setInterval(pollArena, 2500);
    return () => clearInterval(interval);
  }, [user.allyCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.allyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formattedAllyCode =
    user.allyCode.length === 9
      ? `${user.allyCode.slice(0, 3)}-${user.allyCode.slice(3, 6)}-${user.allyCode.slice(6)}`
      : user.allyCode;

  const recentBattles = history.slice(0, 3);
  const formattedTime = lastUpdatedTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <MetricsBar currentRank={rank} battlesCount={history.length} />

      <section
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1100px',
          margin: '16px auto 0',
          padding: '24px 22px',
          backgroundColor: '#0e1422',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
              Ранг {loading ? '...' : `#${rank}`}
            </h2>
            <button
              onClick={handleCopyCode}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: copied ? '#4ade80' : '#64748b',
                backgroundColor: '#070b13',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{copied ? 'Скопировано!' : formattedAllyCode}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            gap: '8px',
            alignItems: 'start',
          }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: '#1b2438',
                      animation: 'pulseSkeleton 1.2s infinite ease-in-out',
                    }}
                  />
                  <div
                    style={{
                      width: '44px',
                      height: '10px',
                      borderRadius: '3px',
                      backgroundColor: '#1b2438',
                      animation: 'pulseSkeleton 1.2s infinite ease-in-out',
                    }}
                  />
                </div>
              ))
            : squad.map((unit) => {
                const borderColor = ALIGNMENT_COLORS[unit.alignment] || '#ffffff';
                return (
                  <div key={unit.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0 }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
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
                        marginTop: '8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#cbd5e1',
                        lineHeight: 1.25,
                        maxHeight: '28px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                        width: '100%',
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
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1060px',
          margin: '-10px auto 0',
          padding: '28px 20px 18px',
          backgroundColor: '#090e18',
          border: '1px solid #141c2c',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8' }}>
          История боев
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentBattles.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                История пока что пуста
              </span>
              <span style={{ fontSize: '12px', color: '#475569' }}>
                Сыграй разок на арене
              </span>
            </div>
          ) : (
            recentBattles.map((b) => {
              const isWin = b.result === 'win';
              return (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '5px',
                    backgroundColor: '#0c1322',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isWin ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#22c55e" stroke="#22c55e" strokeWidth="1">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" stroke="#22c55e" strokeWidth="2.5" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" stroke="#ef4444" strokeWidth="2.5" />
                      </svg>
                    )}

                    <span style={{ fontSize: '13px', fontWeight: 700, color: isWin ? '#4ade80' : '#f87171' }}>
                      {isWin ? 'Победа' : 'Поражение'}
                    </span>

                    {!isWin && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          backgroundColor: '#271417',
                          color: '#f87171',
                          border: '1px solid #451b1f',
                          padding: '1px 5px',
                          borderRadius: '3px',
                        }}
                      >
                        Деф
                      </span>
                    )}

                    <span style={{ fontSize: '11px', color: '#475569', marginLeft: '4px' }}>
                      {new Date(b.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                    <span style={{ color: '#94a3b8' }}>#{b.from}</span>
                    <span style={{ color: '#475569' }}>→</span>
                    <span style={{ color: '#ffffff' }}>#{b.to}</span>
                    <span style={{ color: isWin ? '#22c55e' : '#ef4444', fontSize: '11px' }}>
                      {isWin ? `▲${b.delta}` : `▼${b.delta}`}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onViewHistory}
          style={{
            width: '100%',
            backgroundColor: '#121927',
            color: '#94a3b8',
            fontSize: '13px',
            fontWeight: 600,
            padding: '11px 16px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#182236';
            e.currentTarget.style.color = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#121927';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          Смотреть историю
        </button>
      </section>
    </div>
  );
};
