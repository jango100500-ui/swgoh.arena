import { useState, useEffect } from 'react';
import { UserProfile } from '../app/useAuth';

interface SquadArenaProps {
  user: UserProfile;
}

interface Unit {
  id: string;
  name: string;
  alignment: 'light' | 'dark' | 'neutral' | 'galactic_legend';
  image: string;
}

interface ArenaData {
  rank: number | string;
  squad: Unit[];
}

const ALIGNMENT_COLORS: Record<Unit['alignment'], string> = {
  light: '#38bdf8',
  dark: '#ef4444',
  neutral: '#ffffff',
  galactic_legend: '#eab308',
};

export const SquadArena = ({ user }: SquadArenaProps) => {
  const [arena, setArena] = useState<ArenaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date>(new Date());
  const [, setSecondsTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadArenaData = async () => {
    try {
      const res = await fetch(
        `https://arena-tracker-proxy.onrender.com/arena?allyCode=${encodeURIComponent(user.allyCode)}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();

      const profiles = Array.isArray(data.pvpProfile) ? data.pvpProfile : [];
      const squadProfile = profiles.find((p: { tab?: number | string }) => String(p.tab) === '1') || profiles[0];

      if (squadProfile) {
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
          rank: squadProfile.rank || '—',
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
    loadArenaData();
  }, [user.allyCode]);

  const formattedTime = lastUpdatedTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '24px auto 0',
        padding: '28px 24px',
        backgroundColor: '#0e1422',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
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
          gap: '12px',
          alignItems: 'start',
        }}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#1b2438',
                    animation: 'pulseSkeleton 1.2s infinite ease-in-out',
                  }}
                />
                <div
                  style={{
                    width: '56px',
                    height: '12px',
                    borderRadius: '4px',
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
                      width: '68px',
                      height: '68px',
                      borderRadius: '50%',
                      padding: '3px',
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
                      lineHeight: 1.2,
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
  );
};
