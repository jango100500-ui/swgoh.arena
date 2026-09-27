interface ToastProps {
  type: 'success' | 'error';
  text: string;
  isLeaving: boolean;
}

export const Toast = ({ type, text, isLeaving }: ToastProps) => {
  const isSuccess = type === 'success';
  const accentColor = isSuccess ? '#2563EB' : '#ef4444';
  const gradientColor = isSuccess ? 'rgba(37, 99, 235, 0.28)' : 'rgba(239, 68, 68, 0.28)';

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 1000,
        backgroundColor: '#0e1422',
        backgroundImage: `linear-gradient(to right, ${gradientColor}, transparent 55%)`,
        borderRadius: '6px',
        padding: '14px 20px 18px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '260px',
        maxWidth: '380px',
        overflow: 'hidden',
        animation: isLeaving ? 'toastSlideOut 0.3s ease forwards' : 'toastSlideIn 0.25s ease forwards',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isSuccess ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0e1422" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0e1422" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>

      <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
        {text}
      </span>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          backgroundColor: accentColor,
          animation: 'toastProgressBar 3s linear forwards',
        }}
      />
    </div>
  );
};
