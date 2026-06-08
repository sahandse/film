import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paw: {
          bg: '#0d0d0d',
          surface: '#1a1a2e',
          card: '#16213e',
          accent: '#e50914',
          gold: '#f5c518',
          text: '#e5e5e5',
          muted: '#8a8a9a',
        },
      },
      fontFamily: {
        vazir: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
