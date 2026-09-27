import { useState, useEffect } from 'react';
import { UserProfile } from '../app/useAuth';

interface BattleHistoryProps {
  user: UserProfile;
}

interface UnitSnapshot {
  id: string;
  name: string;
  image: string;
}

interface BattleEvent {
  id: string;
  time: number;
  from: number;
  to: number;
  delta: number;
  result: 'win' | 'loss';
  squad?: UnitSnapshot[];
}

type PeriodFilter = 'Сегодня' | 'За Неделю' | 'За Месяц';

export const BattleHistory = ({ user }: BattleHistoryProps) => {
  const [history, setHistory] = useState<BattleEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState<PeriodFilter>('Сегодня');

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

  const now = Date.now();
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

  const filteredHistory = history.filter((event) => {
    if (activeFilter === 'Сегодня') return event.time >= startOfToday;
    if (activeFilter === 'За Неделю') return event.time >= oneWeekAgo;
    if (activeFilter === 'За Месяц') return event.time >= oneMonthAgo;
    return true;
  });

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          position: 'sticky',
          top: '64px',
          zIndex: 50,
          backgroundColor: '#080c14',
          padding: '16px 0',
          borderBottom: '1px solid #131b2c',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {(['Сегодня', 'За Неделю', 'За Месяц'] as PeriodFilter[]).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                fontSize: '13px',
                fontWeight: 700,
                padding: '7px 16px',
                borderRadius: '6px',
                backgroundColor: isActive ? '#2563EB' : '#0e1422',
                color: isActive ? '#ffffff' : '#64748b',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#64748b';
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div
        className="custom-scroll"
        style={{
          marginTop: '16px',
          maxHeight: '680px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '4px',
        }}
      >
        {filteredHistory.length === 0 ? (
          <div
            style={{
              padding: '64px 20px',
              backgroundColor: '#090e18',
              borderRadius: '6px',
              border: '1px solid #141c2c',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#64748b' }}>
              История пока что пуста
            </span>
            <span style={{ fontSize: '13px', color: '#475569' }}>
              Сыграй разок на арене
            </span>
          </div>
        ) : (
          filteredHistory.map((b) => {
            const isWin = b.result === 'win';
            return (
              <article
                key={b.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '6px',
                  backgroundColor: '#0c1322',
                  border: '1px solid #162035',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isWin ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="#22c55e" stroke="#22c55e" strokeWidth="1">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" stroke="#22c55e" strokeWidth="2.5" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" stroke="#ef4444" strokeWidth="2.5" />
                      </svg>
                    )}

                    <span style={{ fontSize: '14px', fontWeight: 800, color: isWin ? '#4ade80' : '#f87171' }}>
                      {isWin ? 'Победа' : 'Поражение'}
                    </span>

                    {!isWin && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#271417',
                          color: '#f87171',
                          border: '1px solid #451b1f',
                          padding: '1px 6px',
                          borderRadius: '3px',
                        }}
                      >
                        Деф
                      </span>
                    )}

                    <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>
                      {new Date(b.time).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                      })}{' '}
                      в{' '}
                      {new Date(b.time).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800 }}>
                    <span style={{ color: '#94a3b8' }}>#{b.from}</span>
                    <span style={{ color: '#475569' }}>→</span>
                    <span style={{ color: '#ffffff' }}>#{b.to}</span>
                    <span style={{ color: isWin ? '#22c55e' : '#ef4444', fontSize: '12px', fontWeight: 700 }}>
                      {isWin ? `▲${b.delta}` : `▼${b.delta}`}
                    </span>
                  </div>
                </div>

                {b.squad && b.squad.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingTop: '4px' }}>
                    {b.squad.map((u, idx) => (
                      <img
                        key={idx}
                        src={u.image}
                        alt={u.name}
                        title={u.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          backgroundColor: '#080c14',
                          border: '1px solid #1e293b',
                        }}
                      />
                    ))}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
