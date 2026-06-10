import { ANILIST_URL } from '../config'
import type { Item } from '../types'

interface AniMedia {
  id: number
  title: { romaji: string; native: string }
  coverImage: { large: string }
  description: string
  startDate: { year: number }
  averageScore: number
  genres: string[]
}

function makeQuery(page: number, perPage: number) {
  return `query {
    Page(page: ${page}, perPage: ${perPage}) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id title { romaji native }
        coverImage { large }
        description startDate { year }
        averageScore genres
      }
    }
  }`
}

async function fetchPage(page: number): Promise<Item[]> {
  const r = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: makeQuery(page, 50) }),
  })
  if (!r.ok) throw new Error('AniList')
  const data = await r.json() as { data: { Page: { media: AniMedia[] } } }
  return data.data.Page.media.map(a => ({
    id: `anilist-${a.id}`,
    title: a.title.native || a.title.romaji || '',
    cover: a.coverImage?.large || '',
    desc: (a.description || '').replace(/<[^>]+>/g, '').slice(0, 300),
    year: a.startDate?.year ? String(a.startDate.year) : '',
    catId: 'anime',
    source: 'anilist' as const,
    sourceId: a.id,
    rating: a.averageScore ? a.averageScore / 10 : undefined,
    genres: a.genres || [],
  }))
}

export async function fetchAniList(pages = 2): Promise<Item[]> {
  const results = await Promise.allSettled(
    Array.from({ length: pages }, (_, i) => fetchPage(i + 1))
  )
  return results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
}
