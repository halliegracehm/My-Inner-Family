import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const DAILY_PROMPTS = [
  "What's one thing you love about someone in your family? Share it out loud today.",
  "What made you smile this week? Tell your family.",
  "If you could go anywhere together as a family, where would you go and why?",
  "What's your favorite family memory from this year?",
  "What's something you're proud of that happened this week?",
  "What do you wish your family knew about how you're feeling today?",
  "What's one kind thing you could do for someone in your family today?",
]

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🥳', label: 'Excited' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🥰', label: 'Loved' },
]

export default function Home() {
  const { family, member } = useAuth()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [recentEntries, setRecentEntries] = useState([])
  const [myMood, setMyMood] = useState(null)
  const [memberMoods, setMemberMoods] = useState({})
  const [loading, setLoading] = useState(true)

  const todayPrompt = DAILY_PROMPTS[new Date().getDay() % DAILY_PROMPTS.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  useEffect(() => {
    if (family) loadData()
  }, [family])

  async function loadData() {
    setLoading(false)
    try {
      // Load family members
      const { data: membersData } = await supabase
        .from('family_members')
        .select('*')
        .eq('family_id', family.id)
      setMembers(membersData || [])

      // Load recent journal entries
      const { data: entriesData } = await supabase
        .from('journal_entries')
        .select('*, family_members(name, emoji)')
        .eq('family_id', family.id)
        .eq('is_shared', true)
        .order('created_at', { ascending: false })
        .limit(3)
      setRecentEntries(entriesData || [])

      // Load today's moods
      const today = new Date().toISOString().split('T')[0]
      const { data: moodsData } = await supabase
        .from('mood_checkins')
        .select('*, family_members(name, emoji)')
        .eq('family_id', family.id)
        .gte('created_at', today)
      
      const moodMap = {}
      moodsData?.forEach(m => {
        moodMap[m.member_id] = m
        if (m.member_id === member?.id) setMyMood(m.mood_emoji)
      })
      setMemberMoods(moodMap)
    } catch (err) {
      console.error(err)
    }
  }

  async function logMood(mood) {
    setMyMood(mood.emoji)
    try {
      await supabase.from('mood_checkins').upsert({
        family_id: family.id,
        member_id: member.id,
        mood_emoji: mood.emoji,
        mood_label: mood.label,
        date: new Date().toISOString().split('T')[0],
      }, { onConflict: 'member_id,date' })
    } catch (err) { console.error(err) }
  }

  return (
    <div className="page-content">

      {/* Header */}
      <header style={{ padding: '28px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} className="anim-fade-up">
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, color: 'var(--moss)', textTransform: 'uppercase', marginBottom: 4 }}>Hallie Who</div>
          <div className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: 'var(--forest)', lineHeight: 1 }}>
            My Inner <em style={{ color: 'var(--honey)', fontStyle: 'italic' }}>Family</em>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {members.slice(0, 4).map((m, i) => (
            <div key={m.id} style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--warm)', border: '2px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, marginLeft: i === 0 ? 0 : -10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>{m.emoji}</div>
          ))}
        </div>
      </header>

      {/* Greeting */}
      <div className="anim-fade-up anim-delay-1" style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{today}</div>
        <div className="font-serif" style={{ fontSize: 21, fontWeight: 400, color: 'var(--text)' }}>
          {greeting}, <strong style={{ color: 'var(--forest)', fontWeight: 700 }}>{family?.name} 🌿</strong>
        </div>
      </div>

      {/* Today's prompt */}
      <div className="anim-fade-up anim-delay-2" style={{ margin: '16px 20px 0', background: 'linear-gradient(135deg, var(--forest) 0%, var(--moss) 100%)', borderRadius: 'var(--radius)', padding: '22px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-green)' }}>
        <div style={{ position: 'absolute', right: -8, bottom: -12, fontSize: 80, opacity: 0.12 }}>🌿</div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>✨ Today's Family Moment</div>
        <p className="font-serif" style={{ fontSize: 17, fontWeight: 400, color: 'white', lineHeight: 1.5, marginBottom: 16 }}>{todayPrompt}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/journal/new')} style={{ background: 'white', color: 'var(--forest)', border: 'none', borderRadius: 100, padding: '9px 18px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
            📝 Journal It
          </button>
          <button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 100, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            🎯 Do It Together
          </button>
        </div>
      </div>

      {/* Mood check-in */}
      <div className="section-header anim-fade-up anim-delay-2">
        <h2>How are you feeling? {!myMood && <span className="pulse-dot" />}</h2>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '0 20px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }} className="anim-fade-up anim-delay-3">
        {MOODS.map(mood => (
          <button key={mood.label} onClick={() => logMood(mood)}
            style={{
              flexShrink: 0, background: myMood === mood.emoji ? 'rgba(141,184,122,0.25)' : 'var(--card)',
              backdropFilter: 'blur(12px)',
              border: `1.5px solid ${myMood === mood.emoji ? 'var(--sage)' : 'var(--card-border)'}`,
              borderRadius: 18, padding: '12px 14px', textAlign: 'center', minWidth: 72,
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: 'var(--shadow-sm)',
              transform: myMood === mood.emoji ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
            }}>
            <div style={{ fontSize: 24, marginBottom: 3 }}>{mood.emoji}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-soft)' }}>{mood.label}</div>
          </button>
        ))}
      </div>

      {/* Family moods (others) */}
      {Object.keys(memberMoods).length > 0 && (
        <div style={{ padding: '12px 20px 0' }} className="anim-fade-up anim-delay-3">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.values(memberMoods).map(m => (
              <div key={m.id} className="card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, borderRadius: 100 }}>
                <span style={{ fontSize: 14 }}>{m.family_members?.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-soft)' }}>{m.family_members?.name}</span>
                <span style={{ fontSize: 16 }}>{m.mood_emoji}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick access */}
      <div className="section-header anim-fade-up anim-delay-3">
        <h2>Our Family Space</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px' }} className="anim-fade-up anim-delay-3">
        {[
          { icon: '📖', title: 'Family Journal', sub: 'Shared stories & memories', color: 'rgba(240,165,160,0.2)', border: 'rgba(240,165,160,0.35)', path: '/journal' },
          { icon: '🌻', title: 'Gratitude Wall', sub: 'Notes of love & thanks', color: 'rgba(232,168,76,0.15)', border: 'rgba(232,168,76,0.3)', path: '/gratitude' },
          { icon: '🏅', title: 'Family Badges', sub: 'Earn milestones together', color: 'rgba(196,174,224,0.2)', border: 'rgba(196,174,224,0.35)', path: '/badges' },
          { icon: '🎯', title: 'Bonding Activities', sub: 'Prompts for every age', color: 'rgba(168,212,232,0.2)', border: 'rgba(168,212,232,0.35)', path: '/' },
        ].map(item => (
          <button key={item.title} onClick={() => navigate(item.path)}
            style={{ background: item.color, border: `1.5px solid ${item.border}`, borderRadius: 'var(--radius-sm)', padding: '18px 16px', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.15s', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
            <div className="font-serif" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{item.title}</div>
            <div style={{ fontSize: 11, color: 'var(--text-soft)', fontWeight: 600 }}>{item.sub}</div>
          </button>
        ))}
      </div>

      {/* Recent journal entries */}
      {recentEntries.length > 0 && (
        <>
          <div className="section-header anim-fade-up anim-delay-4">
            <h2>Family Feed</h2>
            <button onClick={() => navigate('/journal')}>See all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' }} className="anim-fade-up anim-delay-4">
            {recentEntries.map(entry => (
              <div key={entry.id} className="card" style={{ padding: '14px 16px', display: 'flex', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {entry.family_members?.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                    {entry.family_members?.name} <span style={{ color: 'var(--moss)', fontWeight: 600 }}>wrote in Family Journal</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.4 }}>
                    "{entry.content?.slice(0, 100)}{entry.content?.length > 100 ? '...' : ''}"
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>
                    {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Letters to the future */}
      <div style={{ margin: '20px 20px 0' }} className="anim-fade-up anim-delay-4">
        <div style={{ background: 'linear-gradient(135deg, var(--honey) 0%, #f5c976 100%)', borderRadius: 'var(--radius)', padding: '20px', display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 6px 24px rgba(232,168,76,0.3)', cursor: 'pointer' }}>
          <div style={{ fontSize: 44 }}>💌</div>
          <div>
            <div className="font-serif" style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 4 }}>Letters to the Future</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Write a letter. Seal it. Open it in a year.</div>
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  )
}
