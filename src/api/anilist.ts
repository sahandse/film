import { ANILIST_URL } from '../config'
import type { Item } from '../types'

const QUERY = `
query {
  Page(page: 1, perPage: 20) {
    media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
      id title { romaji native } coverImage { large } description startDate { year }
      averageScore genres episodes
    }
  }
}
`

interface AniMedia {
  id: number
  title: { romaji: string; native: string }
  coverImage: { large: string }
  description: string
  startDate: { year: number }
  averageScore: number
  genres: string[]
  episodes: number
}

export async function fetchAniListTrending(): Promise<Item[]> {
  const r = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  })
  if (!r.ok) throw new Error('AniList error')
  const data = await r.json() as { data: { Page: { media: AniMedia[] } } }
  return data.data.Page.media.map(a => ({
    id: `anilist-${a.id}`,
    title: a.title.native || a.title.romaji || '',
    cover: a.coverImage.large || '',
    desc: (a.description || '').replace(/<[^>]+>/g, ''),
    year: String(a.startDate?.year || ''),
    catId: 'anime',
    source: 'anilist' as const,
    sourceId: a.id,
    rating: a.averageScore ? a.averageScore / 10 : undefined,
    genres: a.genres || [],
  }))
}
