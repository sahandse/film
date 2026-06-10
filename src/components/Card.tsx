import type { Item } from '../types'

const CAT_ICON: Record<string, string> = {
  'latest-movie': '🎬', 'animation': '🎭', 'anime': '⛩️',
  'latest-series': '📺', 'korean': '🇰🇷', 'turkish': '🇹🇷',
}

interface Props {
  item: Item
  onOpen: (item: Item) => void
  gridMode?: boolean
}

export default function Card({ item, onOpen, gridMode }: Props) {
  const icon = CAT_ICON[item.catId] ?? '🎬'

  return (
    <div className={`card${gridMode ? ' card-grid' : ''}`} onClick={() => onOpen(item)}>
      {item.cover ? (
        <img
          className="card-img"
          src={item.cover}
          loading="lazy"
          alt=""
          decoding="async"
          onError={e => {
            const img = e.currentTarget
            img.style.display = 'none'
            const ph = img.nextElementSibling as HTMLElement | null
            if (ph) ph.style.display = 'flex'
          }}
        />
      ) : null}
      <div className="card-ph" style={item.cover ? { display: 'none' } : undefined}>
        <span style={{ fontSize: 32 }}>{icon}</span>
        <span>{item.title}</span>
      </div>
      <div className="card-hover-panel">
        <div className="panel-btns">
          <button
            className="pbtn pbtn-play"
            onClick={e => { e.stopPropagation(); onOpen(item) }}
          >
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <button
            className="pbtn pbtn-more"
            onClick={e => { e.stopPropagation(); onOpen(item) }}
          >
            <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
          </button>
        </div>
        <div className="panel-title">{item.title}</div>
        <div className="panel-meta">
          {item.rating != null && (
            <span className="pmatch">{(item.rating * 10).toFixed(0)}٪</span>
          )}
          {item.year && <span className="pbadge">{item.year}</span>}
          <span className="pcat">{icon}</span>
        </div>
      </div>
    </div>
  )
}
