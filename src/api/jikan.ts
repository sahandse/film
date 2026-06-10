import { JIKAN_BASE } from '../config'
import type { Item } from '../types'

function mapAnime(a: Record<string, unknown>): Item {
  const images = a.images as { jpg?: { large_image_url?: string; image_url?: string } } | undefined
  return {
    id: `jikan-${(a.mal_id as number)}`,
    title: (a.title_japanese as string) || (a.title as string) || '',
    cover: images?.jpg?.large_image_url || images?.jpg?.image_url || '',
    desc: (a.synopsis as string) || '',
    year: String((a.year as number) || ''),
    catId: 'anime',
    source: 'jikan',
    sourceId: a.mal_id as number,
    rating: (a.score as number) || undefined,
    genres: ((a.genres as { name: string }[]) || []).map(g => g.name),
  }
}

export async function fetchTopAnime(): Promise<Item[]> {
  const r = await fetch(`${JIKAN_BASE}/top/anime?limit=20&type=tv`)
  if (!r.ok) throw new Error('Jikan error')
  const data = await r.json() as { data: Record<string, unknown>[] }
  return data.data.map(mapAnime)
}

export async function fetchSeasonalAnime(): Promise<Item[]> {
  const r = await fetch(`${JIKAN_BASE}/seasons/now?limit=20`)
  if (!r.ok) throw new Error('Jikan seasonal error')
  const data = await r.json() as { data: Record<string, unknown>[] }
  return data.data.map(mapAnime)
}
