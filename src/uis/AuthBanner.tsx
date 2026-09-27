import { useState } from 'react';

export const AuthBanner = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    const randomPart = Math.random().toString(36).substring(2, 10);
    const timePart = Date.now().toString(36);
    const sessionToken = `auth_${randomPart}${timePart}`;

    localStorage.setItem('pending_session', sessionToken);
    window.location.href = `https://t.me/SwgohArena_Bot?start=${sessionToken}`;
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
          {loading ? 'Открываем Telegram...' : 'Войти'}
        </button>
      </div>
    </section>
  );
};
