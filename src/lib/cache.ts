import type { Item } from '../types'

const KEY = 'highfilm_cache_v2'
const TTL = 12 * 60 * 60 * 1000

interface Stored {
  ts: number
  items: Record<string, Item[]>
}

export function loadCache(): Record<string, Item[]> | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const d = JSON.parse(raw) as Stored
    if (Date.now() - d.ts > TTL) return null
    return d.items
  } catch {
    return null
  }
}

export function saveCache(items: Record<string, Item[]>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), items }))
  } catch { /* storage quota */ }
}

export function clearCache(): void {
  localStorage.removeItem(KEY)
}
