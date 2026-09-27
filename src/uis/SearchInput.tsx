import { useState, useEffect } from 'react';

const PLACEHOLDERS = [
  'Поиск по арене…',
  'Поиск по рейтингу…',
  'Поиск по истории…',
];

export const SearchInput = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((curr) => {
        setPrevIndex(curr);
        return (curr + 1) % PLACEHOLDERS.length;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prevIndex !== null) {
      const clearTimer = setTimeout(() => {
        setPrevIndex(null);
      }, 350);
      return () => clearTimeout(clearTimer);
    }
  }, [prevIndex]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#080c14',
        borderRadius: '6px',
        padding: '0 10px',
        height: '36px',
        width: '175px',
        flexShrink: 0,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: '6px', flexShrink: 0 }}
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
            fontSize: '12px',
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
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {prevIndex !== null && (
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#475569',
                  whiteSpace: 'nowrap',
                  animation: 'placeholderExitDown 0.3s ease-in forwards',
                }}
              >
                {PLACEHOLDERS[prevIndex]}
              </span>
            )}
            <span
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                color: '#475569',
                whiteSpace: 'nowrap',
                animation: prevIndex !== null ? 'placeholderEnterFromTop 0.3s ease-out forwards' : undefined,
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
