import { useState, useEffect, useRef } from 'react'
import { useStore } from './hooks/useStore'
import { CATS, getTmdbKey } from './config'
import {
  fetchNowPlaying,
  fetchOnAirSeries,
  fetchAnimation,
  fetchKorean,
  fetchTurkish,
  fetchTMDBDetail,
} from './api/tmdb'
import { fetchTopAnime, fetchSeasonalAnime } from './api/jikan'
import { fetchAniListTrending } from './api/anilist'
import { fetchTVMazePopular } from './api/tvmaze'
import type { Item } from './types'
import Header from './components/Header'
import Hero from './components/Hero'
import Slider from './components/Slider'
import Modal from './components/Modal'
import BottomNav from './components/BottomNav'
import SearchOverlay from './components/SearchOverlay'
import FullGrid from './components/FullGrid'
import ApiKeyModal from './components/ApiKeyModal'

export default function App() {
  const store = useStore()
  const [featured, setFeatured] = useState<Item | null>(null)
  const [modalItem, setModalItem] = useState<Item | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [apiKeyOpen, setApiKeyOpen] = useState(false)
  const [detailData, setDetailData] = useState<import('./types').DetailData | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const fetched = useRef(false)
  const featuredSet = useRef(false)

  const loadAll = async (key: string) => {
    const hasTmdb = !!key
    const tasks: Promise<void>[] = []

    if (hasTmdb) {
      tasks.push(
        fetchNowPlaying()
          .then(items => {
            store.addItems('latest-movie', items)
            if (!featuredSet.current && items.length) {
              setFeatured(items[0])
              featuredSet.current = true
            }
          })
          .catch(() => {}),
        fetchOnAirSeries()
          .then(items => store.addItems('latest-series', items))
          .catch(() => {}),
        fetchAnimation()
          .then(items => store.addItems('animation', items))
          .catch(() => {}),
        fetchKorean()
          .then(items => store.addItems('korean', items))
          .catch(() => {}),
        fetchTurkish()
          .then(items => store.addItems('turkish', items))
          .catch(() => {}),
      )
    }

    tasks.push(
      Promise.all([fetchTopAnime(), fetchSeasonalAnime()])
        .then(([top, seasonal]) => {
          const seen = new Set<string>()
          const merged: Item[] = []
          for (const item of [...top, ...seasonal]) {
            if (!seen.has(item.id)) {
              seen.add(item.id)
              merged.push(item)
            }
          }
          store.addItems('anime', merged.slice(0, 20))
          if (!hasTmdb && !featuredSet.current && merged.length) {
            setFeatured(merged[0])
            featuredSet.current = true
          }
        })
        .catch(() => {}),
      fetchAniListTrending()
        .then(items => store.addItems('anime', items.slice(0, 10)))
        .catch(() => {}),
      fetchTVMazePopular()
        .then(items => {
          if (!hasTmdb) store.addItems('latest-series', items.slice(0, 10))
        })
        .catch(() => {}),
    )

    store.setLoading(true)
    await Promise.allSettled(tasks)
    store.setLoading(false)
  }

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    loadAll(getTmdbKey())
  }, [])

  const openItem = async (item: Item) => {
    setModalItem(item)
    setDetailData(null)
    if (item.source === 'tmdb' && item.sourceId !== undefined && item.tmdbType) {
      setDetailLoading(true)
      try {
        const data = await fetchTMDBDetail(item.sourceId as number, item.tmdbType)
        setDetailData(data)
      } catch {
        // ignore
      }
      setDetailLoading(false)
    }
  }

  const handleTmdbKeySet = (key: string) => {
    store.setTmdbKey(key)
    setApiKeyOpen(false)
    fetched.current = false
    loadAll(key)
  }

  return (
    <div className="app">
      <div id="nbar" className={store.loading ? 'nbar-active' : ''} />

      <Header
        tab={store.tab}
        setTab={store.setTab}
        onSearch={() => setSearchOpen(true)}
        onApiKey={() => setApiKeyOpen(true)}
        hasTmdbKey={!!store.tmdbKey}
      />

      {/* HOME */}
      <div className={`page${store.tab === 'home' ? ' on' : ''}`}>
        <Hero item={featured} onPlay={openItem} onInfo={openItem} />
        <div className="home-content">
          {CATS.map(cat => {
            const items = store.items[cat.id] ?? []
            if (!items.length) {
              if (cat.id !== 'anime' && !store.tmdbKey) {
                return (
                  <div key={cat.id} className="row">
                    <div className="row-head">
                      <h3 className="row-title">
                        {cat.icon} {cat.label}
                      </h3>
                    </div>
                    <div className="no-key-msg">
                      🔑 برای مشاهده این بخش، کلید TMDB را وارد کنید
                      <button onClick={() => setApiKeyOpen(true)}>افزودن کلید</button>
                    </div>
                  </div>
                )
              }
              return null
            }
            return (
              <Slider
                key={cat.id}
                cat={cat}
                items={items.slice(0, 20)}
                onOpen={openItem}
              />
            )
          })}
        </div>
      </div>

      {/* MOVIES */}
      <div className={`page${store.tab === 'movies' ? ' on' : ''}`}>
        <div className="pg-head">
          <h1>🎬 فیلم‌ها</h1>
          <p>{(store.items['latest-movie'] ?? []).length} فیلم</p>
        </div>
        <FullGrid
          items={store.items['latest-movie'] ?? []}
          onOpen={openItem}
          emptyMsg={!store.tmdbKey ? 'کلید TMDB لازم است' : 'در حال بارگذاری...'}
        />
      </div>

      {/* SERIES */}
      <div className={`page${store.tab === 'series' ? ' on' : ''}`}>
        <div className="pg-head">
          <h1>📺 سریال‌ها</h1>
          <p>{(store.items['latest-series'] ?? []).length} سریال</p>
        </div>
        <FullGrid
          items={store.items['latest-series'] ?? []}
          onOpen={openItem}
          emptyMsg={!store.tmdbKey ? 'کلید TMDB لازم است' : 'در حال بارگذاری...'}
        />
      </div>

      <BottomNav tab={store.tab} setTab={store.setTab} />

      {modalItem && (
        <Modal
          item={modalItem}
          detail={detailData}
          loading={detailLoading}
          onClose={() => {
            setModalItem(null)
            setDetailData(null)
          }}
        />
      )}

      <SearchOverlay
        open={searchOpen}
        all={store.all}
        onClose={() => setSearchOpen(false)}
        onOpen={item => {
          setSearchOpen(false)
          openItem(item)
        }}
      />

      {apiKeyOpen && (
        <ApiKeyModal
          currentKey={store.tmdbKey}
          onSave={handleTmdbKeySet}
          onClose={() => setApiKeyOpen(false)}
        />
      )}
    </div>
  )
}
