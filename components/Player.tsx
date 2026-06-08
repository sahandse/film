'use client';

import { useState } from 'react';
import type { Movie } from '@/data/movies';

interface Props {
  movie: Movie;
}

export default function Player({ movie }: Props) {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => setPlaying(true)}
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <button className="w-20 h-20 bg-paw-accent hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/50 transition-all group-hover:scale-110">
            <svg className="w-10 h-10 text-white mr-[-4px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <p className="text-white font-semibold text-lg">{movie.title}</p>
          <p className="text-paw-muted text-sm">برای پخش کلیک کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
      <iframe
        src={movie.streamUrl}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
        title={movie.title}
      />
    </div>
  );
}
