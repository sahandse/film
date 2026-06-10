import { TMDB_BASE, TMDB_IMG, getTmdbKey } from '../config'
import type { Item } from '../types'

async function tmdb(path: string, params: Record<string, string> = {}): Promise<unknown> {
  const key = getTmdbKey()
  if (!key) throw new Error('NO_KEY')
  const p = new URLSearchParams({ api_key: key, language: 'fa-IR', ...params })
  const r = await fetch(`${TMDB_BASE}${path}?${p}`)
  if (!r.ok) throw new Error(`TMDB ${r.status}`)
  return r.json()
}

function mapMovie(m: Record<string, unknown>, catId: string): Item {
  return {
    id: `tmdb-movie-${m.id as number}`,
    title: (m.title as string) || (m.original_title as string) || '',
    cover: m.poster_path ? TMDB_IMG + (m.poster_path as string) : '',
    desc: (m.overview as string) || '',
    year: ((m.release_date as string) || '').slice(0, 4),
    catId,
    source: 'tmdb',
    sourceId: m.id as number,
    tmdbType: 'movie',
    rating: m.vote_average as number,
  }
}

function mapTV(s: Record<string, unknown>, catId: string): Item {
  return {
    id: `tmdb-tv-${s.id as number}`,
    title: (s.name as string) || (s.original_name as string) || '',
    cover: s.poster_path ? TMDB_IMG + (s.poster_path as string) : '',
    desc: (s.overview as string) || '',
    year: ((s.first_air_date as string) || '').slice(0, 4),
    catId,
    source: 'tmdb',
    sourceId: s.id as number,
    tmdbType: 'tv',
    rating: s.vote_average as number,
  }
}

export async function fetchNowPlaying(): Promise<Item[]> {
  const data = await tmdb('/movie/now_playing') as { results: Record<string, unknown>[] }
  return data.results.map(m => mapMovie(m, 'latest-movie'))
}

export async function fetchPopularMovies(): Promise<Item[]> {
  const data = await tmdb('/movie/popular') as { results: Record<string, unknown>[] }
  return data.results.map(m => mapMovie(m, 'latest-movie'))
}

export async function fetchOnAirSeries(): Promise<Item[]> {
  const data = await tmdb('/tv/on_the_air') as { results: Record<string, unknown>[] }
  return data.results.map(s => mapTV(s, 'latest-series'))
}

export async function fetchPopularSeries(): Promise<Item[]> {
  const data = await tmdb('/tv/popular') as { results: Record<string, unknown>[] }
  return data.results.map(s => mapTV(s, 'latest-series'))
}

export async function fetchAnimation(): Promise<Item[]> {
  const data = await tmdb('/discover/movie', { with_genres: '16', sort_by: 'popularity.desc' }) as { results: Record<string, unknown>[] }
  return data.results.map(m => mapMovie(m, 'animation'))
}

export async function fetchKorean(): Promise<Item[]> {
  const data = await tmdb('/discover/tv', { with_original_language: 'ko', sort_by: 'popularity.desc' }) as { results: Record<string, unknown>[] }
  return data.results.map(s => mapTV(s, 'korean'))
}

export async function fetchTurkish(): Promise<Item[]> {
  const data = await tmdb('/discover/tv', { with_original_language: 'tr', sort_by: 'popularity.desc' }) as { results: Record<string, unknown>[] }
  return data.results.map(s => mapTV(s, 'turkish'))
}

export async function fetchTMDBDetail(sourceId: number, type: 'movie' | 'tv'): Promise<import('../types').DetailData> {
  const key = getTmdbKey()
  if (!key) throw new Error('NO_KEY')
  const [detail, videos] = await Promise.all([
    tmdb(`/${type}/${sourceId}`) as Promise<Record<string, unknown>>,
    tmdb(`/${type}/${sourceId}/videos`) as Promise<{ results: Record<string, unknown>[] }>,
  ])
  const trailer = (videos as { results: Record<string, unknown>[] }).results.find(
    (v: Record<string, unknown>) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const d = detail as Record<string, unknown>
  return {
    title: (type === 'movie' ? d.title : d.name) as string || '',
    cover: d.poster_path ? TMDB_IMG + (d.poster_path as string) : '',
    backdrop: d.backdrop_path ? `https://image.tmdb.org/t/p/w1280${d.backdrop_path as string}` : '',
    desc: (d.overview as string) || '',
    year: type === 'movie'
      ? ((d.release_date as string) || '').slice(0, 4)
      : ((d.first_air_date as string) || '').slice(0, 4),
    rating: d.vote_average as number,
    genres: ((d.genres as { name: string }[]) || []).map((g) => g.name),
    trailerKey: trailer ? (trailer.key as string) : undefined,
    episodes: type === 'tv' ? (d.number_of_episodes as number) : undefined,
    seasons: type === 'tv' ? (d.number_of_seasons as number) : undefined,
    status: d.status as string,
  }
}
