import { useState, useCallback } from 'react'
import type { Item, Tab } from '../types'

export interface Store {
  items: Record<string, Item[]>
  all: Item[]
  tab: Tab
  loading: boolean
  tmdbKey: string
  setTab: (t: Tab) => void
  addItems: (catId: string, newItems: Item[]) => void
  setLoading: (v: boolean) => void
  setTmdbKey: (k: string) => void
}

export function useStore(): Store {
  const [items, setItems] = useState<Record<string, Item[]>>({})
  const [all, setAll] = useState<Item[]>([])
  const [tab, setTab] = useState<Tab>('home')
  const [loading, setLoadingState] = useState(false)
  const [tmdbKey, setTmdbKeyState] = useState(() => localStorage.getItem('tmdb_key') ?? '')

  const addItems = useCallback((catId: string, newItems: Item[]) => {
    setItems(prev => ({ ...prev, [catId]: [...(prev[catId] || []), ...newItems] }))
    setAll(prev => [...prev, ...newItems])
  }, [])

  const setLoading = useCallback((v: boolean) => setLoadingState(v), [])

  const setTmdbKey = useCallback((k: string) => {
    localStorage.setItem('tmdb_key', k)
    setTmdbKeyState(k)
  }, [])

  return { items, all, tab, loading, tmdbKey, setTab, addItems, setLoading, setTmdbKey }
}
