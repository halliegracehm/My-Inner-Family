import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '0 24px' }}>

      {/* Brand */}
      <div style={{ paddingTop: 60, textAlign: 'center' }} className="anim-fade-up">
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌿</div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: 'var(--moss)', textTransform: 'uppercase', marginBottom: 8 }}>
          A Hallie Who App
        </div>
        <h1 className="font-serif" style={{ fontSize: 44, fontWeight: 700, color: 'var(--forest)', lineHeight: 1.1, marginBottom: 12 }}>
          My Inner<br /><em style={{ color: 'var(--honey)', fontStyle: 'italic' }}>Family</em>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-soft)', lineHeight: 1.5, fontWeight: 500, maxWidth: 300, margin: '0 auto' }}>
          Life360 for the soul. Know your people — not by where they are, but by how they're growing.
        </p>
      </div>

      {/* Feature pills */}
      <div className="anim-fade-up anim-delay-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 36 }}>
        {['📖 Family Journal', '😊 Mood Check-ins', '🌻 Gratitude Wall', '🏅 Family Badges', '💌 Letters to the Future', '🎯 Bonding Activities'].map(f => (
          <span key={f} style={{
            background: 'rgba(141,184,122,0.15)',
            border: '1px solid rgba(141,184,122,0.3)',
            borderRadius: 100,
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--moss)'
          }}>{f}</span>
        ))}
      </div>

      {/* Tagline card */}
      <div className="card anim-fade-up anim-delay-3" style={{ margin: '32px 0', padding: '22px 24px', textAlign: 'center' }}>
        <p className="font-serif" style={{ fontSize: 20, fontWeight: 400, color: 'var(--text)', lineHeight: 1.5, fontStyle: 'italic' }}>
          "Every family deserves a safe space to feel, grow, and connect — starting at home."
        </p>
        <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>— Hallie Who</p>
      </div>

      {/* CTAs */}
      <div className="anim-fade-up anim-delay-4" style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 48 }}>
        <button className="btn-primary" onClick={() => navigate('/auth?mode=signup')}>
          Start Your Family 🌿
        </button>
        <button className="btn-ghost" onClick={() => navigate('/auth?mode=login')}>
          I already have an account
        </button>
      </div>

    </div>
  )
}
