import { notFound } from 'next/navigation';
import { getMovieById, movies } from '@/data/movies';
import Header from '@/components/Header';
import Player from '@/components/Player';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return movies.map((m) => ({ id: String(m.id) }));
}

export default function WatchPage({ params }: Props) {
  const movie = getMovieById(Number(params.id));
  if (!movie) notFound();

  return (
    <main className="min-h-screen bg-paw-bg">
      <Header />

      <div className="pt-16 max-w-6xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/" className="text-paw-muted hover:text-white text-sm flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            بازگشت به خانه
          </Link>
        </div>

        <Player movie={movie} />

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
              <p className="text-paw-muted text-sm mt-1">{movie.originalTitle}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className={`badge text-white py-1 px-3 ${movie.type === 'series' ? 'bg-blue-600' : 'bg-paw-accent'}`}>
                {movie.type === 'series' ? 'سریال' : 'فیلم'}
              </span>
              <span className="badge bg-paw-gold/20 text-paw-gold py-1 px-3">{movie.year}</span>
              {movie.duration && (
                <span className="badge bg-white/10 text-paw-muted py-1 px-3">{movie.duration}</span>
              )}
              <span className="flex items-center gap-1 badge bg-white/10 text-paw-gold py-1 px-3">
                ★ {movie.rating}
              </span>
            </div>

            <p className="text-paw-muted leading-relaxed text-sm">{movie.description}</p>

            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <span key={g} className="badge bg-white/5 text-paw-muted border border-white/10 py-1 px-3">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
