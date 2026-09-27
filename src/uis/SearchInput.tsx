import { useState, useEffect } from 'react';

const PLACEHOLDERS = [
  'Поиск по арене…',
  'Поиск по рейтингу…',
  'Поиск по истории…',
];

export const SearchInput = () => {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setAnimating(false);
      }, 250);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#080c14',
        borderRadius: '6px',
        padding: '0 12px',
        height: '38px',
        width: '240px',
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '8px', flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f8fafc',
            fontSize: '13px',
            fontWeight: 500,
            zIndex: 2,
            position: 'relative',
          }}
        />

        {!value && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: '#475569',
                whiteSpace: 'nowrap',
                transform: animating ? 'translateY(100%)' : 'translateY(0)',
                opacity: animating ? 0 : 1,
                transition: 'transform 0.25s ease-in, opacity 0.25s ease-in',
              }}
            >
              {PLACEHOLDERS[index]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
