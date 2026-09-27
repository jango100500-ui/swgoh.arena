import { useState } from 'react';

interface BreadcrumbsProps {
  current: string;
  onNavigateHome: () => void;
  showBackButton?: boolean;
}

export const Breadcrumbs = ({ current, onNavigateHome, showBackButton }: BreadcrumbsProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 0 16px',
        fontSize: '13px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onNavigateHome}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            color: '#64748b',
            textDecoration: isHovered ? 'underline' : 'none',
            fontWeight: 600,
          }}
        >
          Главная
        </button>
        <span style={{ color: '#334155' }}>›</span>
        <span style={{ color: '#94a3b8', fontWeight: 600 }}>{current}</span>
      </div>

      {showBackButton && (
        <button
          onClick={onNavigateHome}
          style={{
            fontSize: '13px',
            color: '#64748b',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '4px',
            backgroundColor: '#0e1422',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#cbd5e1')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          Назад
        </button>
      )}
    </div>
  );
};
