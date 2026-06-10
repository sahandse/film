import { TVMAZE_BASE } from '../config'
import type { Item } from '../types'

interface TVMazeShow {
  id: number
  name: string
  image: { medium: string; original: string } | null
  summary: string
  premiered: string
  rating: { average: number }
  genres: string[]
}

function mapShow(s: TVMazeShow, catId: string): Item {
  return {
    id: `tvmaze-${s.id}`,
    title: s.name,
    cover: s.image?.medium || '',
    desc: (s.summary || '').replace(/<[^>]+>/g, ''),
    year: (s.premiered || '').slice(0, 4),
    catId,
    source: 'tvmaze',
    sourceId: s.id,
    rating: s.rating?.average,
    genres: s.genres || [],
  }
}

export async function fetchTVMazePopular(): Promise<Item[]> {
  const r = await fetch(`${TVMAZE_BASE}/shows?page=0`)
  if (!r.ok) throw new Error('TVmaze error')
  const data = await r.json() as TVMazeShow[]
  return data.slice(0, 20).map(s => mapShow(s, 'latest-series'))
}
