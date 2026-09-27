import { useState } from 'react';

export const Footer = () => {
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);

  return (
    <footer
      style={{
        backgroundColor: '#04060a',
        padding: '48px 24px 32px',
        borderTop: '1px solid #111827',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '36px 48px',
        }}
      >
        <div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>
            Проекты
          </span>
          <ul style={{ listStyle: 'none', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <li>
              <a href="#" style={{ color: '#64748b' }}>Guilds</a>
            </li>
            <li>
              <span style={{ color: '#f1f5f9' }}>Arena (этот)</span>
            </li>
          </ul>
        </div>

        <div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>
            Сообщество
          </span>
          <ul style={{ listStyle: 'none', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <li>
              <a href="https://t.me/example" target="_blank" rel="noreferrer" style={{ color: '#64748b' }}>
                Наш канал
              </a>
            </li>
            <li>
              <a href="#" style={{ color: '#64748b' }}>Гильдия в SWGOH</a>
            </li>
          </ul>
        </div>

        <div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>
            Правила
          </span>
          <ul style={{ listStyle: 'none', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <li>
              <a href="#" style={{ color: '#64748b' }}>Условия использования</a>
            </li>
            <li>
              <a href="#" style={{ color: '#64748b' }}>Политика конфиденциальности</a>
            </li>
          </ul>
        </div>

        <div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>
            Создатели
          </span>
          <div style={{ marginTop: '12px' }}>
            <button
              onClick={() => setIsAuthorsOpen((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                color: '#64748b',
              }}
            >
              <span>Авторы</span>
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                {isAuthorsOpen ? (
                  <path d="M3.5 0L7 5H0L3.5 0Z" fill="currentColor" />
                ) : (
                  <path d="M3.5 5L0 0H7L3.5 5Z" fill="currentColor" />
                )}
              </svg>
            </button>
            {isAuthorsOpen && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '8px', borderLeft: '1px solid #1e293b' }}>
                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>glavnyvny</span>
                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>ribapibaa</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '800px',
          margin: '40px auto 0',
          paddingTop: '20px',
          borderTop: '1px solid #0d131f',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '12px',
          color: '#475569',
        }}
      >
        <p>swgoh.arena не связан с EA, EA Capital Games, Disney или Lucasfilm LTD.</p>
        <p>© {new Date().getFullYear()} swgoh.arena. Все права защищены.</p>
      </div>
    </footer>
  );
};
