import { movies, getFeatured } from '@/data/movies';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import MovieCard from '@/components/MovieCard';

export default function Home() {
  const featured = getFeatured() ?? movies[0];
  const seriesList = movies.filter((m) => m.type === 'series');
  const movieList = movies.filter((m) => m.type === 'movie');

  return (
    <main className="min-h-screen bg-paw-bg">
      <Header />

      {featured && <HeroBanner movie={featured} />}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {seriesList.length > 0 && (
          <section>
            <h2 className="section-title">سریال‌ها</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {seriesList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {movieList.length > 0 && (
          <section>
            <h2 className="section-title">فیلم‌ها</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {movies.length === 0 && (
          <div className="text-center py-24 text-paw-muted">
            <p className="text-6xl mb-4">🎬</p>
            <p className="text-lg">محتوایی برای نمایش وجود ندارد.</p>
          </div>
        )}
      </div>

      <footer className="text-center py-8 text-paw-muted text-xs border-t border-white/5 mt-8">
        <p>© ۱۴۰۳ PAW — فیلم و سریال</p>
      </footer>
    </main>
  );
}
