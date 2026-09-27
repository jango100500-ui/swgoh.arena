import { useState } from 'react';

const TABS = ['Пешая арена', 'Флот', 'Рейтинг', 'История'];

export const HeroBanner = () => {
  const [activeTab, setActiveTab] = useState('Пешая арена');

  return (
    <section
      style={{
        width: '100%',
        backgroundColor: '#04070e',
        borderBottom: '1px solid #0e1626',
        padding: '36px 24px 0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            maxWidth: '700px',
          }}
        >
          sWGoH Рейтинг & Меты Пешей Арены
        </h1>

        <div
          style={{
            display: 'flex',
            gap: '28px',
            marginTop: '32px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  position: 'relative',
                  paddingBottom: '14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  color: isActive ? '#ffffff' : '#64748b',
                  transition: 'color 0.15s ease',
                }}
              >
                {tab}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#2563EB',
                      borderRadius: '3px 3px 0 0',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
