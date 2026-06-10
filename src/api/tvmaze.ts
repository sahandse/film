import { TVMAZE_BASE } from '../config'
import type { Item } from '../types'

interface TVShow {
  id: number
  name: string
  image: { medium: string; original: string } | null
  summary: string
  premiered: string
  rating: { average: number | null }
  genres: string[]
  language: string
}

function mapShow(s: TVShow, catId: string): Item {
  return {
    id: `tvmaze-${s.id}`,
    title: s.name,
    cover: s.image?.medium || '',
    desc: (s.summary || '').replace(/<[^>]+>/g, '').slice(0, 300),
    year: (s.premiered || '').slice(0, 4),
    catId,
    source: 'tvmaze',
    sourceId: s.id,
    rating: s.rating?.average ?? undefined,
    genres: s.genres || [],
  }
}

export async function fetchTVMaze(pages = 5): Promise<Item[]> {
  const results = await Promise.allSettled(
    Array.from({ length: pages }, (_, i) =>
      fetch(`${TVMAZE_BASE}/shows?page=${i}`).then(r => r.json() as Promise<TVShow[]>)
    )
  )
  return results.flatMap(r =>
    r.status === 'fulfilled' ? r.value.map(s => mapShow(s, 'latest-series')) : []
  )
}
