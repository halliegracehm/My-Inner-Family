import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const MOODS = ['😊','😌','😴','🥳','😤','😢','😰','🥰','🤔','😤']
const PROMPTS = [
  "What made you smile today?",
  "What's something you're grateful for in your family?",
  "What's a challenge you faced today and how did you handle it?",
  "What's something you wish your family knew about you?",
  "Describe a favorite family memory.",
  "What are you looking forward to?",
  "What's one thing you love about each person in your family?",
]

export default function JournalEntry() {
  const { family, member } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [isShared, setIsShared] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function usePrompt(p) {
    setPrompt(p)
    setContent(prev => prev ? prev : '')
  }

  async function save() {
    if (!content.trim()) return
    setLoading(true)
    setError('')
    try {
      await supabase.from('journal_entries').insert({
        family_id: family.id,
        member_id: member.id,
        title: title.trim() || null,
        content: content.trim(),
        mood_emoji: mood || null,
        is_shared: isShared,
        prompt: prompt || null,
      })
      navigate('/journal')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="page-content" style={{ padding: '0 20px' }}>

      {/* Header */}
      <div style={{ paddingTop: 28, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }} className="anim-fade-up">
        <button onClick={() => navigate('/journal')} style={{ fontSize: 20, color: 'var(--moss)', fontWeight: 700 }}>←</button>
        <div className="font-serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--forest)' }}>New Entry</div>
        <button onClick={save} disabled={!content.trim() || loading}
          style={{ marginLeft: 'auto', background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 100, padding: '8px 20px', fontSize: 14, fontWeight: 800, opacity: content.trim() ? 1 : 0.4, cursor: content.trim() ? 'pointer' : 'not-allowed' }}>
          {loading ? 'Saving...' : 'Save 🌿'}
        </button>
      </div>

      {/* Prompt picker */}
      <div className="anim-fade-up anim-delay-1" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>✨ Need a prompt?</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
          {PROMPTS.map(p => (
            <button key={p} onClick={() => usePrompt(p)}
              style={{
                flexShrink: 0, maxWidth: 200,
                background: prompt === p ? 'rgba(141,184,122,0.25)' : 'var(--card)',
                border: `1.5px solid ${prompt === p ? 'var(--sage)' : 'var(--card-border)'}`,
                borderRadius: 'var(--radius-xs)', padding: '10px 14px',
                fontSize: 12, fontWeight: 600, color: 'var(--text-soft)',
                textAlign: 'left', lineHeight: 1.4, cursor: 'pointer', transition: 'all 0.15s'
              }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Mood picker */}
      <div className="anim-fade-up anim-delay-1" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--moss)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>How are you feeling?</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {MOODS.map(m => (
            <button key={m} onClick={() => setMood(mood === m ? '' : m)}
              style={{ fontSize: 26, width: 44, height: 44, borderRadius: 12, border: `2px solid ${mood === m ? 'var(--sage)' : 'transparent'}`, background: mood === m ? 'rgba(141,184,122,0.2)' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt display */}
      {prompt && (
        <div className="anim-fade-up" style={{ background: 'rgba(141,184,122,0.12)', border: '1px solid rgba(141,184,122,0.3)', borderRadius: 'var(--radius-xs)', padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <p className="font-serif" style={{ fontSize: 15, color: 'var(--forest)', fontStyle: 'italic' }}>{prompt}</p>
          <button onClick={() => setPrompt('')} style={{ fontSize: 16, color: 'var(--text-muted)', flexShrink: 0, cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Title */}
      <input
        className="input-field anim-fade-up anim-delay-2"
        placeholder="Title (optional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ marginBottom: 12, fontSize: 17, fontWeight: 600 }}
      />

      {/* Content */}
      <textarea
        className="input-field anim-fade-up anim-delay-2"
        placeholder="What's on your heart today..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={10}
        style={{ marginBottom: 16 }}
      />

      {/* Share toggle */}
      <div className="card anim-fade-up anim-delay-3" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
            {isShared ? '👨‍👩‍👧‍👦 Share with family' : '🔒 Keep private'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {isShared ? 'Your family can read this entry' : 'Only you can see this'}
          </div>
        </div>
        <button onClick={() => setIsShared(!isShared)}
          style={{
            width: 48, height: 28, borderRadius: 100,
            background: isShared ? 'var(--sage)' : 'rgba(107,91,69,0.2)',
            border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
          }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: 'white',
            position: 'absolute', top: 3, transition: 'left 0.2s',
            left: isShared ? 23 : 3, boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
          }} />
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(240,165,160,0.2)', border: '1px solid rgba(240,165,160,0.5)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#c0504d', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <button className="btn-primary" onClick={save} disabled={!content.trim() || loading} style={{ opacity: content.trim() ? 1 : 0.5 }}>
        {loading ? 'Saving...' : 'Save Entry 🌿'}
      </button>

      <div style={{ height: 20 }} />
    </div>
  )
}
