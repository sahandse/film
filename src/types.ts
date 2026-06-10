export interface Item {
  id: string
  title: string
  cover: string
  desc: string
  year?: string
  catId: string
  source: 'tmdb' | 'jikan' | 'anilist' | 'tvmaze'
  sourceId?: number | string
  tmdbType?: 'movie' | 'tv'
  rating?: number
  genres?: string[]
}

export interface Category {
  id: string
  label: string
  icon: string
  badge: string
}

export interface DetailData {
  title: string
  cover: string
  backdrop?: string
  desc: string
  year?: string
  rating?: number
  genres?: string[]
  trailerKey?: string
  episodes?: number
  seasons?: number
  status?: string
}

export type Tab = 'home' | 'movies' | 'series'
