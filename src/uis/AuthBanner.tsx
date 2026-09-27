export const AuthBanner = () => {
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
          }}
        >
          Для входа или регистрации понадобится только пара свободного времени, код союзника и Telegram. Никаких данных мы не собираем 🤗
        </p>

        <button
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
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
        >
          Войти
        </button>
      </div>
    </section>
  );
};
