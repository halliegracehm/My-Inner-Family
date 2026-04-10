import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Auth() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState(params.get('mode') || 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signUp, signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('Check your email to confirm your account, then come back to sign in!')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content" style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>

      {/* Back */}
      <button onClick={() => navigate('/')} style={{ alignSelf: 'flex-start', color: 'var(--moss)', fontWeight: 700, fontSize: 14, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Back
      </button>

      {/* Header */}
      <div className="anim-fade-up" style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🌿</div>
        <h1 className="font-serif" style={{ fontSize: 32, fontWeight: 700, color: 'var(--forest)', marginBottom: 8 }}>
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p style={{ color: 'var(--text-soft)', fontSize: 15 }}>
          {mode === 'signup' ? 'Your family journey starts here.' : 'Your family is waiting for you.'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="anim-fade-up anim-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
          <input
            className="input-field"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        {error && (
          <div style={{ background: 'rgba(240,165,160,0.2)', border: '1px solid rgba(240,165,160,0.5)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#c0504d' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(141,184,122,0.2)', border: '1px solid rgba(141,184,122,0.5)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: 'var(--forest)' }}>
            {success}
          </div>
        )}

        <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account 🌿' : 'Sign In 🌿'}
        </button>
      </form>

      {/* Toggle */}
      <div className="anim-fade-up anim-delay-2" style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-soft)', fontSize: 14 }}>
        {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
        <button
          onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); setSuccess(''); }}
          style={{ color: 'var(--moss)', fontWeight: 800 }}
        >
          {mode === 'signup' ? 'Sign in' : 'Sign up'}
        </button>
      </div>

    </div>
  )
}
