import { useState } from 'react';

const TABS = ['Пешая арена', 'Флот', 'Рейтинг', 'История'] as const;
type TabType = (typeof TABS)[number];

const TITLES: Record<TabType, string> = {
  'Пешая арена': 'sWGoH Рейтинг & Меты Пешей Арены',
  'Флот': 'sWGoH Рейтинг & Меты Арены Флота',
  'Рейтинг': 'sWGoH Рейтинг & Меты Арены',
  'История': 'sWGoH История Боев На Арене',
};

const BACKGROUNDS: Record<TabType, string> = {
  'Пешая арена': '/pngs/packs.png',
  'Флот': '/pngs/fleet.png',
  'Рейтинг': '/pngs/space.png',
  'История': '/pngs/space.png',
};

interface HeroBannerProps {
  onTabChange?: (tab: TabType) => void;
}

export const HeroBanner = ({ onTabChange }: HeroBannerProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('Пешая арена');

  const isSpace = activeTab === 'Рейтинг' || activeTab === 'История';
  const bgOpacity = isSpace ? 0.22 : 0.12;

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#04070e',
        borderBottom: '1px solid #0e1626',
        padding: '36px 24px 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${BACKGROUNDS[activeTab]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: bgOpacity,
          pointerEvents: 'none',
          transition: 'background-image 0.2s ease, opacity 0.2s ease',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            maxWidth: '750px',
          }}
        >
          {TITLES[activeTab]}
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
                onClick={() => handleTabClick(tab)}
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
                      borderRadius: 0,
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
