import { useState, useEffect } from 'react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
        transition: 'background-color 0.25s ease, backdrop-filter 0.25s ease',
        backgroundColor: isScrolled ? '#111726' : 'rgba(8, 12, 20, 0.4)',
        backdropFilter: isScrolled ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: isScrolled ? 'none' : 'blur(12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src="/pngs/arena.png"
          alt="Arena Logo"
          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
        />
        <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
          swgoh<span style={{ color: '#2563EB' }}>.arena</span>
        </span>
      </div>
      <div></div>
    </header>
  );
};
