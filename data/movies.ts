export type MediaType = 'movie' | 'series';

export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  type: MediaType;
  genre: string[];
  year: number;
  rating: number;
  duration?: string;
  description: string;
  poster: string;
  streamUrl: string;
  featured?: boolean;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: '۱۰ هزار سال',
    originalTitle: '10,000 Years',
    type: 'series',
    genre: ['اکشن', 'ماجرایی', 'تاریخی'],
    year: 2024,
    rating: 8.2,
    duration: '۴۵ دقیقه',
    description:
      'سریالی حماسی و پرهیجان که داستانی فراموش‌نشدنی از دنیای کهن را روایت می‌کند. هر قسمت شما را به ماجراجویی‌های تازه‌ای می‌برد.',
    poster: 'https://via.placeholder.com/300x450/1a1a2e/f5c518?text=10+هزار+سال',
    streamUrl: 'https://dls6.film2cinemaha.top/DonyayeSerial/10_thous.html',
    featured: true,
  },
];

export function getMovieById(id: number): Movie | undefined {
  return movies.find((m) => m.id === id);
}

export function getFeatured(): Movie | undefined {
  return movies.find((m) => m.featured);
}

export function getByType(type: MediaType): Movie[] {
  return movies.filter((m) => m.type === type);
}
