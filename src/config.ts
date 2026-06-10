export const CATS: import('./types').Category[] = [
  { id: 'latest-movie', label: 'جدیدترین فیلم‌ها', icon: '🎬', badge: 'فیلم' },
  { id: 'latest-series', label: 'جدیدترین سریال‌ها', icon: '📺', badge: 'سریال' },
  { id: 'animation', label: 'انیمیشن', icon: '🎭', badge: 'انیمیشن' },
  { id: 'anime', label: 'انیمه', icon: '⛩️', badge: 'انیمه' },
  { id: 'korean', label: 'سریال کره‌ای', icon: '🇰🇷', badge: 'کره‌ای' },
  { id: 'turkish', label: 'سریال ترکی', icon: '🇹🇷', badge: 'ترکی' },
]

export const TMDB_IMG = 'https://image.tmdb.org/t/p/w500'
export const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w1280'
export const TMDB_BASE = 'https://api.themoviedb.org/3'
export const JIKAN_BASE = 'https://api.jikan.moe/v4'
export const ANILIST_URL = 'https://graphql.anilist.co'
export const TVMAZE_BASE = 'https://api.tvmaze.com'

export function getTmdbKey(): string {
  return localStorage.getItem('tmdb_key') ?? ''
}

export function setTmdbKey(key: string): void {
  localStorage.setItem('tmdb_key', key)
}
