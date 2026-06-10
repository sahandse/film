import type { Item } from '../types'

interface Props {
  item: Item | null
  onPlay: (item: Item) => void
  onInfo: (item: Item) => void
}

const CAT_LABEL: Record<string, string> = {
  'latest-movie':  '🎬 فیلم',
  'latest-series': '📺 سریال',
  'animation':     '🎭 انیمیشن',
  'anime':         '⛩️ انیمه',
  'korean':        '🇰🇷 کره‌ای',
  'turkish':       '🇹🇷 ترکی',
}

export default function Hero({ item, onPlay, onInfo }: Props) {
  if (!item) return <div className="hero hero-placeholder" />

  const backdrop = item.cover.replace('/w500/', '/w1280/')

  return (
    <section className="hero">
      {item.cover && (
        <img className="hero-img" src={backdrop} alt=""
          onError={e => { (e.currentTarget as HTMLImageElement).src = item.cover }} />
      )}
      <div className="hero-vignette" />
      <div className="hero-content">
        <div className="hero-badge">{CAT_LABEL[item.catId] ?? ''}</div>
        <h1 className="hero-title">{item.title}</h1>
        <div className="hero-meta">
          {item.rating != null && (
            <><span className="hero-match">{(item.rating * 10).toFixed(0)}٪</span><span className="hero-dot" /></>
          )}
          {item.year && <><span style={{ color: 'var(--sub)' }}>{item.year}</span><span className="hero-dot" /></>}
          <span className="hero-hd">HD</span>
        </div>
        {item.desc && <p className="hero-desc">{item.desc}</p>}
        <div className="hero-btns">
          <button className="hbtn hbtn-play" onClick={() => onPlay(item)}>
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            پخش
          </button>
          <button className="hbtn hbtn-info" onClick={() => onInfo(item)}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
            اطلاعات بیشتر
          </button>
        </div>
      </div>
    </section>
  )
}
