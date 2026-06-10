import { useState, useEffect, useRef, useCallback } from 'react'
import { CATS, getTmdbKey, setTmdbKey } from './config'
import { loadCache, saveCache } from './lib/cache'
import { fetchMovies, fetchNowPlaying, fetchSeries, fetchAnimation, fetchKorean, fetchTurkish, fetchTMDBDetail } from './api/tmdb'
import { fetchJikanAnime, fetchJikanMovies } from './api/jikan'
import { fetchAniList } from './api/anilist'
import { fetchTVMaze } from './api/tvmaze'
import type { Item, Tab, DetailData } from './types'
import Header from './components/Header'
import Hero from './components/Hero'
import Slider from './components/Slider'
import FullGrid from './components/FullGrid'
import Modal from './components/Modal'
import BottomNav from './components/BottomNav'
import SearchOverlay from './components/SearchOverlay'
import ApiKeyModal from './components/ApiKeyModal'

type Store = Record<string, Item[]>

function dedup(existing: Item[], incoming: Item[]): Item[] {
  const ids = new Set(existing.map(x => x.id))
  return [...existing, ...incoming.filter(x => !ids.has(x.id))]
}

export default function App() {
  const [store, setStore] = useState<Store>({})
  const [all, setAll] = useState<Item[]>([])
  const [tab, setTab] = useState<Tab>('home')
  const [loading, setLoading] = useState(false)
  const [featured, setFeatured] = useState<Item | null>(null)
  const [tmdbKey, setTmdbKeyState] = useState(() => getTmdbKey())
  const [modalItem, setModalItem] = useState<Item | null>(null)
  const [detail, setDetail] = useState<DetailData | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [apiKeyOpen, setApiKeyOpen] = useState(false)
  const loaded = useRef(false)

  const addItems = useCallback((catId: string, items: Item[]) => {
    if (!items.length) return
    setStore(prev => ({ ...prev, [catId]: dedup(prev[catId] ?? [], items) }))
    setAll(prev => dedup(prev, items))
  }, [])

  // Scroll-based header opacity
  useEffect(() => {
    const hdr = document.getElementById('hdr')
    const onScroll = () => {
      if (hdr) hdr.className = `header${window.scrollY > 10 ? ' scrolled' : ''}`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const loadAll = useCallback(async (key: string) => {
    setLoading(true)
    const hasTmdb = !!key

    const tasks: Promise<void>[] = []

    // Free APIs – always run
    tasks.push(
      fetchJikanAnime(5)
        .then(items => { addItems('anime', items); if (!featured) setFeatured(items[0] ?? null) })
        .catch(() => {}),
      fetchAniList(2)
        .then(items => addItems('anime', items))
        .catch(() => {}),
      fetchJikanMovies(3)
        .then(items => addItems('animation', items))
        .catch(() => {}),
      fetchTVMaze(5)
        .then(items => { addItems('latest-series', items); addItems('korean', items.filter(i => i.genres?.includes('Korean')).map(i => ({ ...i, catId: 'korean' }))); })
        .catch(() => {}),
    )

    // TMDB – only when key present
    if (hasTmdb) {
      tasks.push(
        Promise.allSettled([fetchMovies(3), fetchNowPlaying()])
          .then(results => {
            const items = results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
            addItems('latest-movie', items)
            const first = items[0]
            if (first) setFeatured(first)
          }),
        fetchSeries(3).then(items => addItems('latest-series', items)).catch(() => {}),
        fetchAnimation(3).then(items => addItems('animation', items)).catch(() => {}),
        fetchKorean(3).then(items => addItems('korean', items)).catch(() => {}),
        fetchTurkish(3).then(items => addItems('turkish', items)).catch(() => {}),
      )
    }

    await Promise.allSettled(tasks)
    setLoading(false)
  }, [addItems, featured])

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    // Load from cache immediately
    const cached = loadCache()
    if (cached) {
      const newStore: Store = {}
      const newAll: Item[] = []
      for (const [catId, items] of Object.entries(cached)) {
        newStore[catId] = items
        newAll.push(...items)
      }
      setStore(newStore)
      setAll(newAll)
      const hero = cached['latest-movie']?.[0] ?? cached['latest-series']?.[0] ?? cached['anime']?.[0] ?? null
      setFeatured(hero)
    }

    // Always refresh in background
    loadAll(getTmdbKey())
  }, [loadAll])

  // Save to cache whenever store changes (debounced)
  useEffect(() => {
    if (!Object.keys(store).length) return
    const t = setTimeout(() => saveCache(store), 2000)
    return () => clearTimeout(t)
  }, [store])

  const openItem = async (item: Item) => {
    setModalItem(item)
    setDetail(null)
    if (item.source === 'tmdb' && item.sourceId && item.tmdbType) {
      setDetailLoading(true)
      try {
        const d = await fetchTMDBDetail(item.sourceId as number, item.tmdbType)
        setDetail(d)
      } catch { /* ignore */ }
      setDetailLoading(false)
    }
  }

  const handleSaveKey = (key: string) => {
    setTmdbKey(key)
    setTmdbKeyState(key)
    setApiKeyOpen(false)
    loadAll(key)
  }

  const movies  = store['latest-movie']  ?? []
  const series  = store['latest-series'] ?? []

  return (
    <div className="app">
      <div className={`nbar${loading ? ' nbar-on' : ''}`} />

      <Header
        tab={tab}
        setTab={t => { setTab(t); window.scrollTo(0, 0) }}
        onSearch={() => setSearchOpen(true)}
        onApiKey={() => setApiKeyOpen(true)}
        hasTmdbKey={!!tmdbKey}
      />

      {/* HOME */}
      <div className={`page${tab === 'home' ? ' on' : ''}`}>
        <Hero item={featured} onPlay={openItem} onInfo={openItem} />
        <div className="home-content">
          {CATS.map(cat => {
            const items = store[cat.id] ?? []
            if (!items.length) {
              const needsKey = cat.id !== 'anime' && cat.id !== 'latest-series'
              if (needsKey && !tmdbKey) {
                return (
                  <div key={cat.id} className="row">
                    <div className="row-head">
                      <h3 className="row-title">{cat.icon} {cat.label}</h3>
                    </div>
                    <div className="no-key-row">
                      <span>🔑 برای نمایش این بخش کلید TMDB لازم است</span>
                      <button onClick={() => setApiKeyOpen(true)}>افزودن کلید</button>
                    </div>
                  </div>
                )
              }
              if (loading) return (
                <div key={cat.id} className="sk-row">
                  <div className="skeleton sk-title" />
                  <div className="sk-cards">
                    {[...Array(6)].map((_, i) => <div key={i} className="skeleton sk-card" />)}
                  </div>
                </div>
              )
              return null
            }
            return <Slider key={cat.id} cat={cat} items={items.slice(0, 30)} onOpen={openItem} />
          })}
        </div>
      </div>

      {/* MOVIES */}
      <div className={`page${tab === 'movies' ? ' on' : ''}`}>
        <div className="pg-head">
          <h1>🎬 فیلم‌ها</h1>
          <p>{movies.length} فیلم</p>
        </div>
        <FullGrid
          items={movies}
          onOpen={openItem}
          emptyMsg={!tmdbKey ? '🔑 برای مشاهده فیلم‌ها کلید TMDB را وارد کنید' : 'در حال بارگذاری...'}
        />
      </div>

      {/* SERIES */}
      <div className={`page${tab === 'series' ? ' on' : ''}`}>
        <div className="pg-head">
          <h1>📺 سریال‌ها</h1>
          <p>{series.length} سریال</p>
        </div>
        <FullGrid items={series} onOpen={openItem} />
      </div>

      <BottomNav tab={tab} setTab={t => { setTab(t); window.scrollTo(0, 0) }} />

      {modalItem && (
        <Modal
          item={modalItem}
          detail={detail}
          loading={detailLoading}
          onClose={() => { setModalItem(null); setDetail(null) }}
        />
      )}

      <SearchOverlay
        open={searchOpen}
        all={all}
        onClose={() => setSearchOpen(false)}
        onOpen={i => { setSearchOpen(false); openItem(i) }}
      />

      {apiKeyOpen && (
        <ApiKeyModal
          currentKey={tmdbKey}
          onSave={handleSaveKey}
          onClose={() => setApiKeyOpen(false)}
        />
      )}
    </div>
  )
}
