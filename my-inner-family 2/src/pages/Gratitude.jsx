import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const NOTE_COLORS = [
  { bg: '#fff3b0', text: '#7a6a00' },
  { bg: '#ffd6d6', text: '#8a3030' },
  { bg: '#d4f0d4', text: '#1a5c1a' },
  { bg: '#d0e8f8', text: '#1a4a6e' },
  { bg: '#e8dff8', text: '#4a2a8a' },
  { bg: '#fde8d0', text: '#7a3a0a' },
]

export default function Gratitude() {
  const { family, member, members: allMembers } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [toMember, setToMember] = useState('family')
  const [saving, setSaving] = useState(false)
  const [members, setMembers] = useState([])

  useEffect(() => { if (family) loadData() }, [family])

  async function loadData() {
    try {
      const [{ data: notesData }, { data: membersData }] = await Promise.all([
        supabase.from('gratitude_notes').select('*, family_members(name, emoji)').eq('family_id', family.id).order('created_at', { ascending: false }),
        supabase.from('family_members').select('*').eq('family_id', family.id)
      ])
      setNotes(notesData || [])
      setMembers(membersData || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  async function saveNote() {
    if (!newNote.trim()) return
    setSaving(true)
    try {
      await supabase.from('gratitude_notes').insert({
        family_id: family.id,
        from_member_id: member.id,
        to_member_id: toMember === 'family' ? null : toMember,
        content: newNote.trim(),
      })
      setNewNote('')
      setShowForm(false)
      loadData()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  return (
    <div className="page-content">

      <div style={{ padding: '28px 20px 0' }} className="anim-fade-up">
        <div className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 4 }}>
          Gratitude Wall 🌻
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Leave a note of love, thanks, or kindness.</p>
      </div>

      {/* Add note button */}
      <div style={{ padding: '16px 20px' }} className="anim-fade-up anim-delay-1">
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '💛 Leave a Note'}
        </button>
      </div>

      {/* Add note form */}
      {showForm && (
        <div className="card anim-fade-up" style={{ margin: '0 20px 20px', padding: '20px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>For</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <button onClick={() => setToMember('family')}
              style={{ padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: '1.5px solid', borderColor: toMember === 'family' ? 'var(--forest)' : 'rgba(107,91,69,0.2)', background: toMember === 'family' ? 'var(--forest)' : 'transparent', color: toMember === 'family' ? 'white' : 'var(--text-soft)', transition: 'all 0.15s' }}>
              👨‍👩‍👧‍👦 The whole family
            </button>
            {members.filter(m => m.id !== member?.id).map(m => (
              <button key={m.id} onClick={() => setToMember(m.id)}
                style={{ padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: '1.5px solid', borderColor: toMember === m.id ? 'var(--forest)' : 'rgba(107,91,69,0.2)', background: toMember === m.id ? 'var(--forest)' : 'transparent', color: toMember === m.id ? 'white' : 'var(--text-soft)', transition: 'all 0.15s' }}>
                {m.emoji} {m.name}
              </button>
            ))}
          </div>
          <textarea className="input-field" placeholder="Write something kind..." value={newNote} onChange={e => setNewNote(e.target.value)} rows={4} style={{ marginBottom: 12 }} />
          <button className="btn-primary" onClick={saveNote} disabled={!newNote.trim() || saving}>
            {saving ? 'Posting...' : 'Post Note 💛'}
          </button>
        </div>
      )}

      {/* Notes wall */}
      {loading ? <div className="spinner" /> : notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🌻</div>
          <div className="font-serif" style={{ fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>The wall is empty</div>
          <p style={{ color: 'var(--text-soft)', fontSize: 14 }}>Be the first to leave a note of love.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px' }} className="anim-fade-up anim-delay-2">
          {notes.map((note, i) => {
            const color = NOTE_COLORS[i % NOTE_COLORS.length]
            const rot = i % 2 === 0 ? '-1.5deg' : '1.2deg'
            return (
              <div key={note.id} style={{
                background: color.bg, borderRadius: 16, padding: '16px 14px',
                transform: `rotate(${rot})`, transition: 'transform 0.2s',
                boxShadow: '0 3px 14px rgba(0,0,0,0.1)', cursor: 'default',
                gridColumn: note.content?.length > 80 ? 'span 2' : 'span 1'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04) rotate(0deg)'}
                onMouseLeave={e => e.currentTarget.style.transform = `rotate(${rot})`}>
                <div style={{ fontSize: 10, fontWeight: 800, color: color.text, opacity: 0.7, marginBottom: 6, letterSpacing: 0.5 }}>
                  FROM {note.family_members?.name?.toUpperCase()}
                </div>
                <p className="font-serif" style={{ fontSize: 14, color: color.text, lineHeight: 1.5 }}>{note.content}</p>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  )
}
