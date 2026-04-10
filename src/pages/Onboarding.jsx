import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const GROUP_TYPES = [
  {
    id: 'family', label: 'Family', emoji: '🏡',
    description: 'Parents, kids, grandparents — your home crew',
    roles: ['Mom', 'Dad', 'Parent', 'Grandparent', 'Guardian', 'Kid', 'Teen', 'Sibling', 'Partner'],
    namePlaceholder: 'e.g. The Morrison Family',
    nameHint: '"The Morrison Family" or "The Morrisons 🌿"',
  },
  {
    id: 'small_group', label: 'Small Group', emoji: '🌿',
    description: 'Any close-knit group growing together',
    roles: ['Member', 'Leader', 'Mentor', 'Mentee', 'Friend', 'Partner', 'Youth', 'Elder'],
    namePlaceholder: 'e.g. The Sunday Circle',
    nameHint: '"The Sunday Circle" or "Rise Up Group 🌿"',
  },
]

const EMOJIS = ['👩', '👨', '👧', '👦', '👵', '👴', '🧑', '👶', '🌸', '🌟', '🦋', '🌿', '☀️', '🌙', '❤️', '🐻']

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [groupTypeId, setGroupTypeId] = useState('family')
  const [familyName, setFamilyName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [role, setRole] = useState('Parent')
  const [emoji, setEmoji] = useState('👩')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createFamily } = useAuth()

  const selectedType = GROUP_TYPES.find(g => g.id === groupTypeId) || GROUP_TYPES[0]

  function selectGroupType(g) { setGroupTypeId(g.id); setRole(g.roles[0]) }

  async function finish() {
    setLoading(true); setError('')
    try { await createFamily(familyName, memberName, emoji, role, groupTypeId) }
    catch (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div className="page-content" style={{ padding: '48px 24px 0', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 100, background: i <= step ? 'var(--forest)' : 'rgba(45,90,39,0.15)', transition: 'all 0.3s' }} />
        ))}
      </div>

      {step === 0 && (
        <div className="anim-fade-up" style={{ flex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌿</div>
          <h1 className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 12 }}>What kind of group is this?</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 15, marginBottom: 28, lineHeight: 1.5 }}>My Inner Family works for families, friend groups, church circles, mentorship groups, and more.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {GROUP_TYPES.map(g => (
              <button key={g.id} onClick={() => selectGroupType(g)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px', borderRadius: 'var(--radius-sm)', background: groupTypeId === g.id ? 'rgba(45,90,39,0.08)' : 'var(--card)', border: `2px solid ${groupTypeId === g.id ? 'var(--forest)' : 'var(--card-border)'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: 32, width: 44, textAlign: 'center' }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>{g.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{g.description}</div>
                </div>
                {groupTypeId === g.id && <div style={{ color: 'var(--forest)', fontSize: 18, fontWeight: 800 }}>✓</div>}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setStep(1)}>That's us! →</button>
        </div>
      )}

      {step === 1 && (
        <div className="anim-fade-up" style={{ flex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>{selectedType.emoji}</div>
          <h1 className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 12 }}>What's your group called?</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>This is the name everyone will see — like {selectedType.nameHint}</p>
          <input className="input-field" placeholder={selectedType.namePlaceholder} value={familyName} onChange={e => setFamilyName(e.target.value)} style={{ fontSize: 17, marginBottom: 24 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
            <button className="btn-primary" onClick={() => setStep(2)} disabled={!familyName.trim()} style={{ flex: 1 }}>That's us! →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="anim-fade-up" style={{ flex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌿</div>
          <h1 className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 12 }}>Now, who are you in the group?</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 15, marginBottom: 28, lineHeight: 1.5 }}>Create your member profile. Others will see this.</p>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Your emoji</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {EMOJIS.map(e => (<button key={e} onClick={() => setEmoji(e)} style={{ fontSize: 28, width: 48, height: 48, borderRadius: 12, background: emoji === e ? 'rgba(141,184,122,0.25)' : 'rgba(255,255,255,0.6)', border: emoji === e ? '2px solid var(--sage)' : '2px solid transparent', transition: 'all 0.15s', cursor: 'pointer' }}>{e}</button>))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ d
cat > ~/Desktop/my-inner-family/src/pages/Onboarding.jsx << 'EOF'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const GROUP_TYPES = [
  {
    id: 'family', label: 'Family', emoji: '🏡',
    description: 'Parents, kids, grandparents — your home crew',
    roles: ['Mom', 'Dad', 'Parent', 'Grandparent', 'Guardian', 'Kid', 'Teen', 'Sibling', 'Partner'],
    namePlaceholder: 'e.g. The Morrison Family',
    nameHint: '"The Morrison Family" or "The Morrisons 🌿"',
  },
  {
    id: 'small_group', label: 'Small Group', emoji: '🌿',
    description: 'Any close-knit group growing together',
    roles: ['Member', 'Leader', 'Mentor', 'Mentee', 'Friend', 'Partner', 'Youth', 'Elder'],
    namePlaceholder: 'e.g. The Sunday Circle',
    nameHint: '"The Sunday Circle" or "Rise Up Group 🌿"',
  },
]

const EMOJIS = ['👩', '👨', '👧', '👦', '👵', '👴', '🧑', '👶', '🌸', '🌟', '🦋', '🌿', '☀️', '🌙', '❤️', '🐻']

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [groupTypeId, setGroupTypeId] = useState('family')
  const [familyName, setFamilyName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [role, setRole] = useState('Parent')
  const [emoji, setEmoji] = useState('👩')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createFamily } = useAuth()

  const selectedType = GROUP_TYPES.find(g => g.id === groupTypeId) || GROUP_TYPES[0]

  function selectGroupType(g) { setGroupTypeId(g.id); setRole(g.roles[0]) }

  async function finish() {
    setLoading(true); setError('')
    try { await createFamily(familyName, memberName, emoji, role, groupTypeId) }
    catch (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div className="page-content" style={{ padding: '48px 24px 0', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 100, background: i <= step ? 'var(--forest)' : 'rgba(45,90,39,0.15)', transition: 'all 0.3s' }} />
        ))}
      </div>

      {step === 0 && (
        <div className="anim-fade-up" style={{ flex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌿</div>
          <h1 className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 12 }}>What kind of group is this?</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 15, marginBottom: 28, lineHeight: 1.5 }}>My Inner Family works for families, friend groups, church circles, mentorship groups, and more.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {GROUP_TYPES.map(g => (
              <button key={g.id} onClick={() => selectGroupType(g)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px', borderRadius: 'var(--radius-sm)', background: groupTypeId === g.id ? 'rgba(45,90,39,0.08)' : 'var(--card)', border: `2px solid ${groupTypeId === g.id ? 'var(--forest)' : 'var(--card-border)'}`, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: 32, width: 44, textAlign: 'center' }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>{g.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{g.description}</div>
                </div>
                {groupTypeId === g.id && <div style={{ color: 'var(--forest)', fontSize: 18, fontWeight: 800 }}>✓</div>}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setStep(1)}>That's us! →</button>
        </div>
      )}

      {step === 1 && (
        <div className="anim-fade-up" style={{ flex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>{selectedType.emoji}</div>
          <h1 className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 12 }}>What's your group called?</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>This is the name everyone will see — like {selectedType.nameHint}</p>
          <input className="input-field" placeholder={selectedType.namePlaceholder} value={familyName} onChange={e => setFamilyName(e.target.value)} style={{ fontSize: 17, marginBottom: 24 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={() => setStep(0)}>← Back</button>
            <button className="btn-primary" onClick={() => setStep(2)} disabled={!familyName.trim()} style={{ flex: 1 }}>That's us! →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="anim-fade-up" style={{ flex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌿</div>
          <h1 className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 12 }}>Now, who are you in the group?</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 15, marginBottom: 28, lineHeight: 1.5 }}>Create your member profile. Others will see this.</p>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Your emoji</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {EMOJIS.map(e => (<button key={e} onClick={() => setEmoji(e)} style={{ fontSize: 28, width: 48, height: 48, borderRadius: 12, background: emoji === e ? 'rgba(141,184,122,0.25)' : 'rgba(255,255,255,0.6)', border: emoji === e ? '2px solid var(--sage)' : '2px solid transparent', transition: 'all 0.15s', cursor: 'pointer' }}>{e}</button>))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Your name</label>
            <input className="input-field" placeholder="e.g. Hallie" value={memberName} onChange={e => setMemberName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Your role</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedType.roles.map(r => (<button key={r} onClick={() => setRole(r)} style={{ padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700, background: role === r ? 'var(--forest)' : 'rgba(255,255,255,0.6)', color: role === r ? 'white' : 'var(--text-soft)', border: '1.5px solid', borderColor: role === r ? 'var(--forest)' : 'rgba(107,91,69,0.2)', transition: 'all 0.15s', cursor: 'pointer' }}>{r}</button>))}
            </div>
          </div>
          {memberName && (
            <div className="card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 40, width: 56, height: 56, background: 'var(--warm)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{emoji}</div>
              <div><div style={{ fontWeight: 800, fontSize: 16 }}>{memberName}</div><div style={{ fontSize: 13, color: 'var(--text-soft)' }}>{role} · {familyName}</div></div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-primary" onClick={() => setStep(3)} disabled={!memberName.trim()} style={{ flex: 1 }}>That's me! →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="anim-fade-up" style={{ flex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>💌</div>
          <h1 className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 12 }}>Invite your people</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 15, marginBottom: 28, lineHeight: 1.5 }}>Share your code so others can join. You can always do this later.</p>
          <div className="card" style={{ padding: '24px', textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--moss)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Your Group Code</div>
            <div className="font-serif" style={{ fontSize: 36, fontWeight: 700, color: 'var(--forest)', letterSpacing: 4, marginBottom: 12 }}>{familyName.slice(0,3).toUpperCase()}-2026</div>
            <button style={{ fontSize: 13, fontWeight: 700, color: 'var(--moss)', background: 'rgba(141,184,122,0.15)', border: '1px solid rgba(141,184,122,0.3)', borderRadius: 100, padding: '8px 20px', cursor: 'pointer' }} onClick={() => navigator.clipboard?.writeText(`${familyName.slice(0,3).toUpperCase()}-2026`)}>📋 Copy Code</button>
          </div>
          <div className="card" style={{ padding: '16px 20px', marginBottom: 28, background: 'rgba(232,168,76,0.1)', borderColor: 'rgba(232,168,76,0.3)' }}>
            <p style={{ fontSize: 14, color: 'var(--text-soft)', lineHeight: 1.5 }}>💡 Members download My Inner Family, create an account, and enter your code to join.</p>
          </div>
          {error && <div style={{ background: 'rgba(240,165,160,0.2)', border: '1px solid rgba(240,165,160,0.5)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#c0504d', marginBottom: 16 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn-primary" onClick={finish} disabled={loading} style={{ flex: 1 }}>{loading ? 'Setting up...' : 'Enter My Group Home 🏡'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
