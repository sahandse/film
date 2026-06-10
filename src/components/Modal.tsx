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
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const d: DetailData = detail ?? {
    title: item.title,
    cover: item.cover,
    backdrop: item.cover.replace('/w500/', '/w1280/'),
    desc: item.desc,
    year: item.year,
    rating: item.rating,
    genres: item.genres,
  }

  return (
    <div className="movl on" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hero">
          {(d.backdrop ?? d.cover) && (
            <img className="modal-backdrop" src={d.backdrop ?? d.cover} alt="" />
          )}
          <div className="modal-hero-vign" />
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-hero-info">
            <h2 className="modal-title">{d.title}</h2>
            <div className="modal-btns">
              <button
                className="hbtn hbtn-play"
                onClick={() => {
                  if (d.trailerKey) {
                    window.open(`https://www.youtube.com/watch?v=${d.trailerKey}`, '_blank')
                  } else {
                    window.open(
                      `https://serialblog1.top/?s=${encodeURIComponent(d.title)}`,
                      '_blank',
                    )
                  }
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {d.trailerKey ? 'تریلر' : 'پخش'}
              </button>
            </div>
          </div>
        </div>
        <div className="modal-body">
          {loading && <div className="modal-loading">در حال بارگذاری اطلاعات...</div>}
          <div className="modal-meta">
            {d.rating != null && (
              <span className="hero-match">{(d.rating * 10).toFixed(0)}٪ امتیاز</span>
            )}
            {d.year && <span>{d.year}</span>}
            {d.seasons != null && <span>{d.seasons} فصل</span>}
            {d.episodes != null && <span>{d.episodes} قسمت</span>}
            {d.status && <span>{d.status}</span>}
          </div>
          {d.desc && <p className="modal-desc">{d.desc}</p>}
          {d.genres?.length ? (
            <div className="modal-genres">
              {d.genres.map(g => (
                <span key={g} className="genre-tag">
                  {g}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
