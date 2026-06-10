import type { Tab } from '../types'

interface Props { tab: Tab; setTab: (t: Tab) => void }

export default function BottomNav({ tab, setTab }: Props) {
  return (
    <nav className="bnav">
      <button className={`nbtn${tab === 'home' ? ' on' : ''}`} onClick={() => setTab('home')}>
        <svg viewBox="0 0 24 24">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        خانه
      </button>
      <button className={`nbtn${tab === 'movies' ? ' on' : ''}`} onClick={() => setTab('movies')}>
        <svg viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="2" />
          <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" /><line x1="17" y1="7" x2="22" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
        </svg>
        فیلم
      </button>
      <button className={`nbtn${tab === 'series' ? ' on' : ''}`} onClick={() => setTab('series')}>
        <svg viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="15" rx="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
        سریال
      </button>
    </nav>
  )
}
