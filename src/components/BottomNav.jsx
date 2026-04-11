import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/', icon: '🏡', label: 'Home' },
  { path: '/journal', icon: '📖', label: 'Journal' },
  { path: '/family', icon: '🌿', label: 'Group' },
  { path: '/gratitude', icon: '✨', label: 'Gratitude' },
  { path: '/settings', icon: '👤', label: 'Me' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(141,184,122,0.2)', display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(tab => {
        const active = pathname === tab.path
        return (
          <Link key={tab.path} to={tab.path} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px 8px', textDecoration: 'none', transition: 'all 0.15s' }}>
            <div style={{ fontSize: 22, marginBottom: 2, filter: active ? 'none' : 'grayscale(40%) opacity(0.6)', transition: 'all 0.15s' }}>{tab.icon}</div>
            <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, color: active ? 'var(--forest)' : 'var(--text-soft)', transition: 'all 0.15s' }}>{tab.label}</span>
            {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--forest)', marginTop: 3 }} />}
          </Link>
        )
      })}
    </nav>
  )
}
