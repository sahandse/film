import Link from 'next/link';
import type { Movie } from '@/data/movies';

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  return (
    <Link href={`/watch/${movie.id}`} className="block group">
      <div className="card-hover relative overflow-hidden rounded-xl bg-paw-card">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <span className={`badge text-white ${movie.type === 'series' ? 'bg-blue-600' : 'bg-paw-accent'}`}>
              {movie.type === 'series' ? 'سریال' : 'فیلم'}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full bg-paw-accent/90 hover:bg-paw-accent text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <PlayIcon />
              پخش
            </button>
          </div>
        </div>

        <div className="p-3">
          <h3 className="text-white font-semibold text-sm truncate mb-1">{movie.title}</h3>
          <div className="flex items-center justify-between text-xs text-paw-muted">
            <span>{movie.year}</span>
            <div className="flex items-center gap-1">
              <StarIcon />
              <span className="text-paw-gold">{movie.rating}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre.slice(0, 2).map((g) => (
              <span key={g} className="badge bg-white/10 text-paw-muted">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-3 h-3 text-paw-gold" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
