import type { Tab } from '../types'

interface Props {
  tab: Tab
  setTab: (t: Tab) => void
  onSearch: () => void
  onApiKey: () => void
  hasTmdbKey: boolean
}

export default function Header({ tab, setTab, onSearch, onApiKey, hasTmdbKey }: Props) {
  return (
    <header className="header" id="main-header">
      <span className="logo" onClick={() => setTab('home')}>HIGHFILM</span>
      <nav className="top-nav">
        <a className={tab === 'home' ? 'on' : ''} onClick={() => setTab('home')}>خانه</a>
        <a className={tab === 'movies' ? 'on' : ''} onClick={() => setTab('movies')}>فیلم</a>
        <a className={tab === 'series' ? 'on' : ''} onClick={() => setTab('series')}>سریال</a>
      </nav>
      <div className="header-end">
        {!hasTmdbKey && (
          <button className="icon-btn key-warn" onClick={onApiKey} title="کلید TMDB را وارد کنید">
            <svg viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
          </button>
        )}
        <button className="icon-btn" onClick={onSearch} aria-label="جستجو">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <button className="icon-btn" onClick={onApiKey} aria-label="تنظیمات">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93a10 10 0 0 0 14.14 14.14"/></svg>
        </button>
      </div>
    </header>
  )
}
