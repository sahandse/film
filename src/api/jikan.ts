import { JIKAN_BASE } from '../config'
import type { Item } from '../types'

interface JikanAnime {
  mal_id: number
  title: string
  title_japanese: string
  images: { jpg: { large_image_url?: string; image_url?: string } }
  synopsis: string
  year: number
  score: number
  genres: { name: string }[]
}

function mapAnime(a: JikanAnime): Item {
  return {
    id: `jikan-${a.mal_id}`,
    title: a.title_japanese || a.title || '',
    cover: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || '',
    desc: (a.synopsis || '').slice(0, 300),
    year: a.year ? String(a.year) : '',
    catId: 'anime',
    source: 'jikan',
    sourceId: a.mal_id,
    rating: a.score || undefined,
    genres: (a.genres || []).map(g => g.name),
  }
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export async function fetchJikanAnime(pages = 5): Promise<Item[]> {
  const all: Item[] = []
  for (let page = 1; page <= pages; page++) {
    try {
      const r = await fetch(`${JIKAN_BASE}/top/anime?limit=25&page=${page}&type=tv`)
      if (!r.ok) break
      const data = await r.json() as { data: JikanAnime[] }
      all.push(...data.data.map(mapAnime))
      if (page < pages) await sleep(400)
    } catch { break }
  }
  return all
}

export async function fetchJikanMovies(pages = 3): Promise<Item[]> {
  const all: Item[] = []
  for (let page = 1; page <= pages; page++) {
    try {
      const r = await fetch(`${JIKAN_BASE}/top/anime?limit=25&page=${page}&type=movie`)
      if (!r.ok) break
      const data = await r.json() as { data: JikanAnime[] }
      all.push(...data.data.map(a => ({ ...mapAnime(a), catId: 'animation' })))
      if (page < pages) await sleep(400)
    } catch { break }
  }
  return all
}
