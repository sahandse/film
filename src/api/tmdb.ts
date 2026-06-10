import { TMDB_BASE, TMDB_IMG, TMDB_BACK, getTmdbKey } from '../config'
import type { Item, DetailData } from '../types'

async function req(path: string, params: Record<string, string> = {}): Promise<unknown> {
  const key = getTmdbKey()
  if (!key) throw new Error('NO_KEY')
  const p = new URLSearchParams({ api_key: key, language: 'fa-IR', ...params })
  const r = await fetch(`${TMDB_BASE}${path}?${p}`)
  if (!r.ok) throw new Error(`TMDB ${r.status}`)
  return r.json()
}

type TmdbResult = { id: number; title?: string; name?: string; original_title?: string; original_name?: string; poster_path?: string; overview?: string; release_date?: string; first_air_date?: string; vote_average?: number }

function mapMovie(m: TmdbResult, catId: string): Item {
  return {
    id: `tmdb-movie-${m.id}`,
    title: m.title || m.original_title || '',
    cover: m.poster_path ? TMDB_IMG + m.poster_path : '',
    desc: m.overview || '',
    year: (m.release_date || '').slice(0, 4),
    catId,
    source: 'tmdb',
    sourceId: m.id,
    tmdbType: 'movie',
    rating: m.vote_average,
  }
}

function mapTV(s: TmdbResult, catId: string): Item {
  return {
    id: `tmdb-tv-${s.id}`,
    title: s.name || s.original_name || '',
    cover: s.poster_path ? TMDB_IMG + s.poster_path : '',
    desc: s.overview || '',
    year: (s.first_air_date || '').slice(0, 4),
    catId,
    source: 'tmdb',
    sourceId: s.id,
    tmdbType: 'tv',
    rating: s.vote_average,
  }
}

async function multiPage(path: string, params: Record<string, string>, pages: number): Promise<TmdbResult[]> {
  const settled = await Promise.allSettled(
    Array.from({ length: pages }, (_, i) =>
      req(path, { ...params, page: String(i + 1) }) as Promise<{ results: TmdbResult[] }>
    )
  )
  return settled.flatMap(r => r.status === 'fulfilled' ? r.value.results : [])
}

export async function fetchMovies(pages = 3): Promise<Item[]> {
  const results = await multiPage('/movie/popular', {}, pages)
  return results.map(m => mapMovie(m, 'latest-movie'))
}

export async function fetchNowPlaying(): Promise<Item[]> {
  const data = await req('/movie/now_playing') as { results: TmdbResult[] }
  return data.results.map(m => mapMovie(m, 'latest-movie'))
}

export async function fetchSeries(pages = 3): Promise<Item[]> {
  const results = await multiPage('/tv/popular', {}, pages)
  return results.map(s => mapTV(s, 'latest-series'))
}

export async function fetchAnimation(pages = 3): Promise<Item[]> {
  const results = await multiPage('/discover/movie', { with_genres: '16', sort_by: 'popularity.desc' }, pages)
  return results.map(m => mapMovie(m, 'animation'))
}

export async function fetchKorean(pages = 3): Promise<Item[]> {
  const results = await multiPage('/discover/tv', { with_original_language: 'ko', sort_by: 'popularity.desc' }, pages)
  return results.map(s => mapTV(s, 'korean'))
}

export async function fetchTurkish(pages = 3): Promise<Item[]> {
  const results = await multiPage('/discover/tv', { with_original_language: 'tr', sort_by: 'popularity.desc' }, pages)
  return results.map(s => mapTV(s, 'turkish'))
}

export async function fetchTMDBDetail(sourceId: number, type: 'movie' | 'tv'): Promise<DetailData> {
  type DetailRaw = { title?: string; name?: string; poster_path?: string; backdrop_path?: string; overview?: string; release_date?: string; first_air_date?: string; vote_average?: number; genres?: { name: string }[]; number_of_episodes?: number; number_of_seasons?: number; status?: string }
  type VideoRaw = { type: string; site: string; key: string }
  const [detail, videos] = await Promise.all([
    req(`/${type}/${sourceId}`) as Promise<DetailRaw>,
    req(`/${type}/${sourceId}/videos`) as Promise<{ results: VideoRaw[] }>,
  ])
  const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  return {
    title: (type === 'movie' ? detail.title : detail.name) || '',
    cover: detail.poster_path ? TMDB_IMG + detail.poster_path : '',
    backdrop: detail.backdrop_path ? TMDB_BACK + detail.backdrop_path : '',
    desc: detail.overview || '',
    year: type === 'movie'
      ? (detail.release_date || '').slice(0, 4)
      : (detail.first_air_date || '').slice(0, 4),
    rating: detail.vote_average,
    genres: (detail.genres || []).map(g => g.name),
    trailerKey: trailer?.key,
    episodes: type === 'tv' ? detail.number_of_episodes : undefined,
    seasons: type === 'tv' ? detail.number_of_seasons : undefined,
    status: detail.status,
  }
}
