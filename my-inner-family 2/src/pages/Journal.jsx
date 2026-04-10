import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Journal() {
  const { family, member } = useAuth()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [filter, setFilter] = useState('shared') // 'shared' | 'mine'
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (family) loadEntries() }, [family, filter])

  async function loadEntries() {
    setLoading(true)
    try {
      let q = supabase
        .from('journal_entries')
        .select('*, family_members(name, emoji)')
        .eq('family_id', family.id)
        .order('created_at', { ascending: false })

      if (filter === 'shared') q = q.eq('is_shared', true)
      else q = q.eq('member_id', member.id)

      const { data } = await q
      setEntries(data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <div className="page-content">

      {/* Header */}
      <div style={{ padding: '28px 20px 0' }} className="anim-fade-up">
        <div className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 4 }}>Family Journal</div>
        <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Stories, thoughts, and memories from your family.</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '16px 20px' }} className="anim-fade-up anim-delay-1">
        {[['shared', '👨‍👩‍👧‍👦 Family Feed'], ['mine', '✍️ My Entries']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{
              padding: '8px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700,
              background: filter === val ? 'var(--forest)' : 'rgba(255,255,255,0.7)',
              color: filter === val ? 'white' : 'var(--text-soft)',
              border: '1.5px solid',
              borderColor: filter === val ? 'var(--forest)' : 'rgba(107,91,69,0.2)',
              transition: 'all 0.15s', cursor: 'pointer'
            }}>{label}</button>
        ))}
      </div>

      {/* New entry button */}
      <div style={{ padding: '0 20px 16px' }} className="anim-fade-up anim-delay-1">
        <button className="btn-primary" onClick={() => navigate('/journal/new')}>
          ✍️ Write a new entry
        </button>
      </div>

      {/* Entries */}
      {loading ? (
        <div className="spinner" />
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 40px' }} className="anim-fade-up">
          <div style={{ fontSize: 52, marginBottom: 16 }}>📖</div>
          <div className="font-serif" style={{ fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>No entries yet</div>
          <p style={{ color: 'var(--text-soft)', fontSize: 14, lineHeight: 1.5 }}>
            {filter === 'shared' ? 'No family entries have been shared yet. Be the first!' : "You haven't written anything yet."}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 20px' }} className="anim-fade-up anim-delay-2">
          {entries.map((entry, i) => (
            <div key={entry.id} className="card" style={{ padding: '18px 20px', animationDelay: `${i * 0.05}s` }}>
              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  {entry.family_members?.emoji}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>{entry.family_members?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                    {new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                {entry.mood_emoji && <span style={{ marginLeft: 'auto', fontSize: 22 }}>{entry.mood_emoji}</span>}
              </div>

              {/* Title */}
              {entry.title && (
                <div className="font-serif" style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{entry.title}</div>
              )}

              {/* Content preview */}
              <p style={{ fontSize: 14, color: 'var(--text-soft)', lineHeight: 1.6 }}>
                {entry.content?.slice(0, 180)}{entry.content?.length > 180 ? '...' : ''}
              </p>

              {/* Tags */}
              {entry.prompt && (
                <div style={{ marginTop: 12, padding: '6px 12px', background: 'rgba(141,184,122,0.12)', borderRadius: 100, display: 'inline-block' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--moss)' }}>✨ Prompted</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  )
}
