import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Family() {
  const { family, member, signOut } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (family) loadMembers() }, [family])

  async function loadMembers() {
    const { data } = await supabase
      .from('family_members')
      .select('*')
      .eq('family_id', family.id)
      .order('created_at')
    setMembers(data || [])
    setLoading(false)
  }

  const familyCode = family?.name?.slice(0, 3).toUpperCase() + '-2026'

  return (
    <div className="page-content">
      <div style={{ padding: '28px 20px 0' }} className="anim-fade-up">
        <div className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 4 }}>
          {family?.name}
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Manage your family and invite new members.</p>
      </div>

      {/* Family code */}
      <div className="card anim-fade-up anim-delay-1" style={{ margin: '16px 20px 0', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--moss)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Your Family Code</div>
        <div className="font-serif" style={{ fontSize: 36, fontWeight: 700, color: 'var(--forest)', letterSpacing: 4, marginBottom: 12 }}>{familyCode}</div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Share this code so family members can join</p>
        <button onClick={() => navigator.clipboard?.writeText(familyCode)}
          style={{ fontSize: 13, fontWeight: 700, color: 'var(--moss)', background: 'rgba(141,184,122,0.15)', border: '1px solid rgba(141,184,122,0.3)', borderRadius: 100, padding: '8px 20px', cursor: 'pointer' }}>
          📋 Copy Code
        </button>
      </div>

      {/* Members */}
      <div className="section-header anim-fade-up anim-delay-2">
        <h2>Family Members ({members.length})</h2>
      </div>

      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' }} className="anim-fade-up anim-delay-2">
          {members.map(m => (
            <div key={m.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {m.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>
                  {m.name} {m.id === member?.id && <span style={{ fontSize: 11, color: 'var(--moss)', fontWeight: 700 }}>(You)</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{m.role}</div>
              </div>
              {m.is_admin && (
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--honey)', background: 'rgba(232,168,76,0.15)', border: '1px solid rgba(232,168,76,0.3)', borderRadius: 100, padding: '3px 10px' }}>
                  ADMIN
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sign out */}
      <div style={{ padding: '28px 20px' }} className="anim-fade-up anim-delay-3">
        <button className="btn-ghost" onClick={signOut} style={{ width: '100%', color: '#c0504d', borderColor: 'rgba(192,80,77,0.3)' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
