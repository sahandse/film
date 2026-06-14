import { useEffect, useState } from 'react'
import type { Item, DetailData } from '../types'

interface Props {
  item: Item
  detail: DetailData | null
  loading: boolean
  onClose: () => void
}


const SOURCES = [
  { label: 'Vidsrc',  url: (id: number | string, type: string, s: number, e: number) =>
      type === 'movie' ? `https://vidsrc.to/embed/movie/${id}` : `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { label: '2Embed', url: (id: number | string, type: string, s: number, e: number) =>
      type === 'movie' ? `https://www.2embed.cc/embed/${id}` : `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` },
  { label: 'EmbedSu', url: (id: number | string, type: string, s: number, e: number) =>
      type === 'movie' ? `https://embed.su/embed/movie/${id}` : `https://embed.su/embed/tv/${id}/${s}/${e}` },
]

export default function Modal({ item, detail, loading, onClose }: Props) {
  const [playing, setPlaying]   = useState(false)
  const [season, setSeason]     = useState(1)
  const [episode, setEpisode]   = useState(1)
  const [srcIdx, setSrcIdx]     = useState(0)

  const hasTmdbId = item.source === 'tmdb' && !!item.sourceId
  const type      = item.tmdbType ?? 'movie'
  const isTv      = type === 'tv'
  const totalSeasons  = detail?.seasons  ?? 1
  const totalEpisodes = detail?.episodes ?? (isTv ? 24 : 1)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Reset when item changes
  useEffect(() => { setPlaying(false); setSeason(1); setEpisode(1); setSrcIdx(0) }, [item.id])

  const d = detail ?? {
    title: item.title, cover: item.cover,
    backdrop: item.cover.replace('/w500/', '/w1280/'),
    desc: item.desc, year: item.year, rating: item.rating, genres: item.genres,
  }

  const backdrop   = d.backdrop || d.cover
  const searchUrl  = `https://serialblog1.top/?s=${encodeURIComponent(d.title)}`
  const playerUrl  = hasTmdbId
    ? SOURCES[srcIdx].url(item.sourceId!, type, season, episode)
    : null

  return (
    <div className="movl on" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* ── PLAYER or BACKDROP ── */}
        <div className="modal-hero">
          {playing && playerUrl ? (
            <iframe
              className="modal-player"
              src={playerUrl}
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              referrerPolicy="origin"
            />
          ) : (
            <>
              {backdrop && (
                <img
                  className="modal-backdrop" src={backdrop} alt=""
                  onError={e => { if (d.cover) (e.currentTarget as HTMLImageElement).src = d.cover }}
                />
              )}
              <div className="modal-hero-vign" />
            </>
          )}

          <button className="modal-close" onClick={onClose}>✕</button>

          {!playing && (
            <div className="modal-hero-btns">
              {hasTmdbId ? (
                <button className="hbtn hbtn-play" onClick={() => setPlaying(true)}>
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  پخش آنلاین
                </button>
              ) : (
                <button className="hbtn hbtn-play" onClick={() => window.open(searchUrl, '_blank')}>
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  پخش
                </button>
              )}
              {d.trailerKey && (
                <button className="hbtn hbtn-info"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${d.trailerKey}`, '_blank')}>
                  <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  تریلر
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── SOURCE SWITCHER (while playing) ── */}
        {playing && (
          <div className="player-controls">
            {isTv && (
              <div className="ep-controls">
                <label>فصل
                  <select value={season} onChange={e => { setSeason(+e.target.value); setEpisode(1) }}>
                    {Array.from({ length: totalSeasons }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </label>
                <label>قسمت
                  <select value={episode} onChange={e => setEpisode(+e.target.value)}>
                    {Array.from({ length: totalEpisodes }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <div className="src-btns">
              <span className="src-label">سرور:</span>
              {SOURCES.map((s, i) => (
                <button
                  key={s.label}
                  className={`src-btn${srcIdx === i ? ' active' : ''}`}
                  onClick={() => setSrcIdx(i)}
                >{s.label}</button>
              ))}
              <button className="src-btn" onClick={() => setPlaying(false)}>✕ بستن پخش</button>
            </div>
          </div>
        )}

        {/* ── INFO ── */}
        <div className="modal-body">
          <h2 className="modal-title">{d.title}</h2>
          {loading && <p className="modal-loading">در حال دریافت اطلاعات...</p>}
          <div className="modal-meta">
            {d.rating != null && <span className="hero-match">{(d.rating * 10).toFixed(0)}٪</span>}
            {d.year    && <span>{d.year}</span>}
            {d.seasons  != null && <span>{d.seasons} فصل</span>}
            {d.episodes != null && <span>{d.episodes} قسمت</span>}
            {d.status  && <span>{d.status}</span>}
          </div>
          {d.desc && <p className="modal-desc">{d.desc}</p>}
          {d.genres?.length ? (
            <div className="modal-genres">
              {d.genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
            </div>
          ) : null}
          {!hasTmdbId && (
            <a className="ext-link" href={searchUrl} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              تماشا در سایت خارجی
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
