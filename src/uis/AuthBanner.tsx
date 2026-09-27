import { useState } from 'react';

export const AuthBanner = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://arena-tracker-2uod.onrender.com/api/auth/start-session', {
        method: 'POST',
      });
      const data = await res.json();

      if (!data.botUrl || !data.sessionToken) {
        throw new Error('Failed to get bot session');
      }

      window.open(data.botUrl, '_blank');

      const interval = setInterval(async () => {
        try {
          const checkRes = await fetch(
            `https://arena-tracker-2uod.onrender.com/api/auth/check-session?token=${encodeURIComponent(data.sessionToken)}`
          );
          const checkData = await checkRes.json();

          if (checkData.status === 'approved' && checkData.authToken) {
            clearInterval(interval);
            localStorage.setItem('arena_token', checkData.authToken);
            window.location.reload();
          }
        } catch {
          // Continue polling
        }
      }, 2000);
    } catch {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '24px auto 0',
        padding: '32px 28px',
        backgroundColor: '#0e1422',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.01em',
        }}
      >
        Войди в аккаунт, чтобы пользоваться ареной
      </h2>

      <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p
          style={{
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: 1.5,
            display: 'inline',
          }}
        >
          Для входа или регистрации понадобится только пара минут свободного времени, код союзника и Telegram. Никаких данных мы не собираем{' '}
          <img
            src="/pngs/huggingface.png"
            alt="🤗"
            style={{
              width: '18px',
              height: '18px',
              verticalAlign: 'text-bottom',
              display: 'inline-block',
              marginLeft: '2px',
            }}
          />
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#2563EB',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'default' : 'pointer',
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563EB')}
        >
          {loading ? 'Ожидание авторизации в Telegram...' : 'Войти'}
        </button>
      </div>
    </section>
  );
};
