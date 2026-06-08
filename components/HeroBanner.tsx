import Link from 'next/link';
import type { Movie } from '@/data/movies';

interface Props {
  movie: Movie;
}

export default function HeroBanner({ movie }: Props) {
  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.poster})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-paw-bg/60 to-paw-bg" />
      <div className="absolute inset-0 bg-gradient-to-t from-paw-bg via-transparent to-black/40" />
      <div className="absolute inset-0 hero-gradient" />

      <div className="relative h-full flex items-end pb-16 px-4 max-w-7xl mx-auto">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-paw-accent text-white">
              {movie.type === 'series' ? 'سریال' : 'فیلم'}
            </span>
            <span className="badge bg-paw-gold/20 text-paw-gold">{movie.year}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
            {movie.title}
          </h1>
          <p className="text-paw-muted text-sm mb-1">{movie.originalTitle}</p>

          <div className="flex items-center gap-3 text-sm text-paw-muted mb-4">
            <span className="flex items-center gap-1">
              <span className="text-paw-gold">★</span>
              <span className="text-white font-semibold">{movie.rating}</span>
            </span>
            {movie.duration && <span>{movie.duration}</span>}
            <span>{movie.genre.join(' · ')}</span>
          </div>

          <p className="text-paw-muted text-sm leading-relaxed mb-6 max-w-md">
            {movie.description}
          </p>

          <div className="flex gap-3">
            <Link href={`/watch/${movie.id}`} className="btn-primary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              پخش آنلاین
            </Link>
            <Link
              href={`/watch/${movie.id}`}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            >
              اطلاعات بیشتر
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
