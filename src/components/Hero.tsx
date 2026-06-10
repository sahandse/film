import type { Item } from '../types'

interface Props {
  item: Item | null
  onPlay: (item: Item) => void
  onInfo: (item: Item) => void
}

export default function Hero({ item, onPlay, onInfo }: Props) {
  if (!item) return <div className="hero hero-empty" />

  return (
    <section className="hero">
      {item.cover && <img className="hero-img" src={item.cover.replace('/w500/', '/w1280/')} alt="" />}
      <div className="hero-vignette" />
      <div className="hero-content">
        <div className="hero-badge">
          {item.catId === 'anime' ? '⛩️ انیمه' :
           item.catId === 'latest-movie' ? '🎬 فیلم' :
           item.catId === 'latest-series' ? '📺 سریال' :
           item.catId === 'korean' ? '🇰🇷 کره‌ای' :
           item.catId === 'turkish' ? '🇹🇷 ترکی' :
           item.catId === 'animation' ? '🎭 انیمیشن' : ''}
        </div>
        <h1 className="hero-title">{item.title}</h1>
        <div className="hero-meta">
          {item.rating && <span className="hero-match">{(item.rating * 10).toFixed(0)}٪</span>}
          {item.rating && <span className="hero-dot" />}
          {item.year && <span style={{ color: 'var(--sub)' }}>{item.year}</span>}
          {item.year && <span className="hero-dot" />}
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
