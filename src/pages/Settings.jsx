import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const THEMES = [
  { id: 'forest', label: 'Forest', emoji: '🌿', primary: '#2d5a27' },
  { id: 'lavender', label: 'Lavender', emoji: '💜', primary: '#6b4fa0' },
  { id: 'rose', label: 'Rose', emoji: '🌸', primary: '#b5446e' },
  { id: 'ocean', label: 'Ocean', emoji: '🌊', primary: '#1a6b8a' },
  { id: 'sunset', label: 'Sunset', emoji: '🌅', primary: '#c4622d' },
  { id: 'midnight', label: 'Midnight', emoji: '🌙', primary: '#3949ab' },
]

const FOCUS_AREAS = [
  { id: 'mental_health', label: 'Mental Health', emoji: '🧠' },
  { id: 'relationships', label: 'Relationships', emoji: '💞' },
  { id: 'faith', label: 'Faith & Spirituality', emoji: '✨' },
  { id: 'parenting', label: 'Parenting', emoji: '👶' },
  { id: 'grief', label: 'Grief & Loss', emoji: '🕊️' },
  { id: 'growth', label: 'Personal Growth', emoji: '🌱' },
  { id: 'marriage', label: 'Marriage & Partnership', emoji: '💍' },
  { id: 'anxiety', label: 'Anxiety & Stress', emoji: '🌬️' },
  { id: 'boundaries', label: 'Boundaries', emoji: '🛡️' },
  { id: 'inner_child', label: 'Inner Child', emoji: '🧸' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { id: 'purpose', label: 'Purpose & Identity', emoji: '🔥' },
]

export default function Settings() {
  const { member, family, signOut, refreshFamily } = useAuth()
  const [selectedTheme, setSelectedTheme] = useState(member?.theme || 'forest')
  const [selectedFocus, setSelectedFocus] = useState(member?.focus_areas || [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleFocus(id) {
    setSelectedFocus(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  async function saveSettings() {
    setSaving(true)
    try {
      await supabase.from('family_members').update({ theme: selectedTheme, focus_areas: selectedFocus }).eq('id', member.id)
      await refreshFamily()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  return (
    <div className="page-content" style={{ padding: '48px 24px 120px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{member?.emoji || '🌿'}</div>
        <h1 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--forest)', marginBottom: 4 }}>{member?.name}</h1>
        <p style={{ fontSize: 13, color: 'var(

cat > ~/Desktop/my-inner-family/src/pages/Settings.jsx << 'EOF'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const THEMES = [
  { id: 'forest', label: 'Forest', emoji: '🌿', primary: '#2d5a27' },
  { id: 'lavender', label: 'Lavender', emoji: '💜', primary: '#6b4fa0' },
  { id: 'rose', label: 'Rose', emoji: '🌸', primary: '#b5446e' },
  { id: 'ocean', label: 'Ocean', emoji: '🌊', primary: '#1a6b8a' },
  { id: 'sunset', label: 'Sunset', emoji: '🌅', primary: '#c4622d' },
  { id: 'midnight', label: 'Midnight', emoji: '🌙', primary: '#3949ab' },
]

const FOCUS_AREAS = [
  { id: 'mental_health', label: 'Mental Health', emoji: '🧠' },
  { id: 'relationships', label: 'Relationships', emoji: '💞' },
  { id: 'faith', label: 'Faith & Spirituality', emoji: '✨' },
  { id: 'parenting', label: 'Parenting', emoji: '👶' },
  { id: 'grief', label: 'Grief & Loss', emoji: '🕊️' },
  { id: 'growth', label: 'Personal Growth', emoji: '🌱' },
  { id: 'marriage', label: 'Marriage & Partnership', emoji: '💍' },
  { id: 'anxiety', label: 'Anxiety & Stress', emoji: '🌬️' },
  { id: 'boundaries', label: 'Boundaries', emoji: '🛡️' },
  { id: 'inner_child', label: 'Inner Child', emoji: '🧸' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { id: 'purpose', label: 'Purpose & Identity', emoji: '🔥' },
]

export default function Settings() {
  const { member, family, signOut, refreshFamily } = useAuth()
  const [selectedTheme, setSelectedTheme] = useState(member?.theme || 'forest')
  const [selectedFocus, setSelectedFocus] = useState(member?.focus_areas || [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggleFocus(id) {
    setSelectedFocus(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  async function saveSettings() {
    setSaving(true)
    try {
      await supabase.from('family_members').update({ theme: selectedTheme, focus_areas: selectedFocus }).eq('id', member.id)
      await refreshFamily()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  return (
    <div className="page-content" style={{ padding: '48px 24px 120px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{member?.emoji || '🌿'}</div>
        <h1 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--forest)', marginBottom: 4 }}>{member?.name}</h1>
        <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>{member?.role} · {family?.name}</p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 13, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Your Theme</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setSelectedTheme(t.id)} style={{ padding: '14px 10px', borderRadius: 12, textAlign: 'center', background: selectedTheme === t.id ? `${t.primary}18` : 'var(--card)', border: `2px solid ${selectedTheme === t.id ? t.primary : 'var(--card-border)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{t.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: selectedTheme === t.id ? t.primary : 'var(--text-soft)' }}>{t.label}</div>
              {selectedTheme === t.id && <div style={{ width: 24, height: 4, borderRadius: 2, background: t.primary, margin: '6px auto 0' }} />}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 13, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Your Focus Areas</h2>
        <p style={{ fontSize: 13, color: 'var(--text-soft)', marginBottom: 14, lineHeight: 1.5 }}>Choose what you're working on — your journal prompts will reflect this.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {FOCUS_AREAS.map(f => {
            const active = selectedFocus.includes(f.id)
            return (
              <button key={f.id} onClick={() => toggleFocus(f.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700, background: active ? 'var(--forest)' : 'rgba(255,255,255,0.7)', color: active ? 'white' : 'var(--text-soft)', border: `1.5px solid ${active ? 'var(--forest)' : 'rgba(107,91,69,0.2)'}`, transition: 'all 0.15s', cursor: 'pointer' }}>
                <span>{f.emoji}</span> {f.label}
              </button>
            )
          })}
        </div>
      </div>

      <button className="btn-primary" onClick={saveSettings} disabled={saving} style={{ width: '100%', marginBottom: 16 }}>
        {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save My Settings'}
      </button>

      <button onClick={signOut} style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: 'var(--text-soft)', background: 'transparent', border: '1.5px solid rgba(107,91,69,0.2)', cursor: 'pointer' }}>
        Sign Out
      </button>
    </div>
  )
}
