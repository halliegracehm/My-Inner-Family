import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const ALL_BADGES = [
  { id: 'first_entry', icon: '📖', title: 'First Words', desc: 'Write your first journal entry', points: 10 },
  { id: 'week_streak', icon: '🔥', title: 'Weekly Warrior', desc: 'Journal 7 days in a row', points: 50 },
  { id: 'first_gratitude', icon: '🌻', title: 'Grateful Heart', desc: 'Leave your first gratitude note', points: 10 },
  { id: 'mood_week', icon: '😊', title: 'Mood Tracker', desc: 'Log your mood 7 days in a row', points: 30 },
  { id: 'family_feed', icon: '👨‍👩‍👧‍👦', title: 'Family First', desc: 'Share 5 entries with your family', points: 25 },
  { id: 'kindness', icon: '💛', title: 'Kindness Keeper', desc: 'Leave 3 gratitude notes in one week', points: 40 },
  { id: 'letter', icon: '💌', title: 'Time Capsule', desc: 'Write your first letter to the future', points: 20 },
  { id: 'all_moods', icon: '🌈', title: 'Full Spectrum', desc: 'Log 5 different moods', points: 35 },
]

export default function Badges() {
  const { family } = useAuth()
  const [earned] = useState(['first_entry', 'first_gratitude']) // placeholder

  return (
    <div className="page-content">
      <div style={{ padding: '28px 20px 0' }} className="anim-fade-up">
        <div className="font-serif" style={{ fontSize: 30, fontWeight: 700, color: 'var(--forest)', marginBottom: 4 }}>Family Badges 🏅</div>
        <p style={{ fontSize: 14, color: 'var(--text-soft)' }}>Earn milestones together as a family.</p>
      </div>

      {/* Points total */}
      <div style={{ margin: '16px 20px 0', background: 'linear-gradient(135deg, var(--forest), var(--moss))', borderRadius: 'var(--radius)', padding: '20px', color: 'white', boxShadow: 'var(--shadow-green)' }} className="anim-fade-up anim-delay-1">
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, opacity: 0.8, marginBottom: 4 }}>FAMILY POINTS</div>
        <div className="font-serif" style={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }}>
          {earned.reduce((sum, id) => sum + (ALL_BADGES.find(b => b.id === id)?.points || 0), 0)}
          <span style={{ fontSize: 18, opacity: 0.7, marginLeft: 8 }}>pts</span>
        </div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{earned.length} of {ALL_BADGES.length} badges earned</div>
      </div>

      <div className="section-header anim-fade-up anim-delay-2"><h2>Your Badges</h2></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px' }} className="anim-fade-up anim-delay-2">
        {ALL_BADGES.map(badge => {
          const isEarned = earned.includes(badge.id)
          return (
            <div key={badge.id} className="card" style={{ padding: '18px 16px', textAlign: 'center', opacity: isEarned ? 1 : 0.45, transition: 'opacity 0.2s', position: 'relative' }}>
              {isEarned && <div style={{ position: 'absolute', top: 8, right: 10, fontSize: 10, fontWeight: 800, color: 'var(--moss)', letterSpacing: 0.5 }}>✓ EARNED</div>}
              <div style={{ fontSize: 36, marginBottom: 8, filter: isEarned ? 'none' : 'grayscale(1)' }}>{badge.icon}</div>
              <div className="font-serif" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{badge.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-soft)', lineHeight: 1.4, marginBottom: 8 }}>{badge.desc}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--honey)' }}>+{badge.points} pts</div>
            </div>
          )
        })}
      </div>

      <div style={{ height: 20 }} />
    </div>
  )
}
