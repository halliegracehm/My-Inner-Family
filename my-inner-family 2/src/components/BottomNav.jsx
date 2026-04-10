import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/',          icon: '🏡', label: 'Home'     },
  { path: '/journal',   icon: '📖', label: 'Journal'  },
  { path: '/gratitude', icon: '🌻', label: 'Gratitude'},
  { path: '/badges',    icon: '🏅', label: 'Badges'   },
  { path: '/family',    icon: '👨‍👩‍👧‍👦', label: 'Family'  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={`nav-item ${pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
