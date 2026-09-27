import { useState } from 'react';

export const Footer = () => {
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);

  return (
    <footer
      style={{
        backgroundColor: '#04060a',
        padding: '56px 24px 32px',
        borderTop: '1px solid #111827',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ПРОЕКТЫ
          </span>
          <ul style={{ listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li>
              <a href="#" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Guilds</a>
            </li>
            <li>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Arena (текущий)</span>
            </li>
          </ul>
        </div>

        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            СООБЩЕСТВО
          </span>
          <ul style={{ listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li>
              <a href="https://t.me/example" target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}>
                Telegram-канал
              </a>
            </li>
            <li>
              <a href="#" style={{ color: '#94a3b8' }}>Гильдия в SWGOH</a>
            </li>
          </ul>
        </div>

        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ДОКУМЕНТЫ
          </span>
          <ul style={{ listStyle: 'none', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li>
              <a href="#" style={{ color: '#94a3b8' }}>Правила использования</a>
            </li>
            <li>
              <a href="#" style={{ color: '#94a3b8' }}>Политика конфиденциальности</a>
            </li>
          </ul>
        </div>

        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            СОЗДАТЕЛИ
          </span>
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => setIsAuthorsOpen((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#94a3b8',
              }}
            >
              <span>Авторы</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: isAuthorsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isAuthorsOpen && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px', borderLeft: '2px solid #1e293b' }}>
                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>glavnyvny</span>
                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>ribapibaa</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '48px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid #0d131f',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '12px',
          color: '#475569',
        }}
      >
        <p>swgoh.arena is not affiliated with EA, EA Capital Games, Disney or Lucasfilm LTD.</p>
        <p>© {new Date().getFullYear()} swgoh.arena. Все права защищены.</p>
      </div>
    </footer>
  );
};
