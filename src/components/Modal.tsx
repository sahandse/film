import { useEffect } from 'react'
import type { Item, DetailData } from '../types'

interface Props {
  item: Item
  detail: DetailData | null
  loading: boolean
  onClose: () => void
}

export default function Modal({ item, detail, loading, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const d = detail ?? {
    title: item.title,
    cover: item.cover,
    backdrop: item.cover.replace('/w500/', '/w1280/'),
    desc: item.desc,
    year: item.year,
    rating: item.rating,
    genres: item.genres,
  }

  const backdrop = d.backdrop || d.cover
  const searchUrl = `https://serialblog1.top/?s=${encodeURIComponent(d.title)}`

  return (
    <div className="movl on" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hero">
          {backdrop && (
            <img className="modal-backdrop" src={backdrop} alt=""
              onError={e => { if (d.cover) (e.currentTarget as HTMLImageElement).src = d.cover }} />
          )}
          <div className="modal-hero-vign" />
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-hero-btns">
            <button className="hbtn hbtn-play" onClick={() => {
              if (d.trailerKey) window.open(`https://www.youtube.com/watch?v=${d.trailerKey}`, '_blank')
              else window.open(searchUrl, '_blank')
            }}>
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              {d.trailerKey ? 'تریلر' : 'پخش'}
            </button>
            <button className="hbtn hbtn-info" onClick={() => window.open(searchUrl, '_blank')}>
              <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              تماشای آنلاین
            </button>
          </div>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{d.title}</h2>
          {loading && <p className="modal-loading">در حال دریافت اطلاعات...</p>}
          <div className="modal-meta">
            {d.rating != null && <span className="hero-match">{(d.rating * 10).toFixed(0)}٪</span>}
            {d.year && <span>{d.year}</span>}
            {d.seasons != null && <span>{d.seasons} فصل</span>}
            {d.episodes != null && <span>{d.episodes} قسمت</span>}
            {d.status && <span>{d.status}</span>}
          </div>
          {d.desc && <p className="modal-desc">{d.desc}</p>}
          {d.genres?.length ? (
            <div className="modal-genres">
              {d.genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
