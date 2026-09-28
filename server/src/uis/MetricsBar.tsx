import { useState, useEffect } from 'react';

interface MetricsBarProps {
  currentRank: number | string;
  battlesCount: number;
}

export const MetricsBar = ({ currentRank, battlesCount }: MetricsBarProps) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const payout = new Date();
      payout.setHours(18, 0, 0, 0);

      if (now.getTime() > payout.getTime()) {
        payout.setDate(payout.getDate() + 1);
      }

      const diff = payout.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, '0');
      setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        width: '100%',
        maxWidth: '1100px',
        margin: '16px auto 0',
      }}
    >
      <div
        style={{
          backgroundColor: '#0c1220',
          border: '1px solid #141c2c',
          borderRadius: '6px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
          До выплаты
        </span>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.02em' }}>
          {timeLeft || '--:--:--'}
        </span>
      </div>

      <div
        style={{
          backgroundColor: '#0c1220',
          border: '1px solid #141c2c',
          borderRadius: '6px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
          Ранг сейчас
        </span>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
          #{currentRank}
        </span>
      </div>

      <div
        style={{
          backgroundColor: '#0c1220',
          border: '1px solid #141c2c',
          borderRadius: '6px',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>
          Событий за 24ч
        </span>
        <span style={{ fontSize: '14px', fontWeight: 800, color: battlesCount > 0 ? '#4ade80' : '#94a3b8' }}>
          {battlesCount}
        </span>
      </div>
    </div>
  );
};
