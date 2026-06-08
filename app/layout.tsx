import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PAW | فیلم و سریال',
  description: 'تماشای آنلاین فیلم و سریال با کیفیت بالا',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-vazir antialiased">{children}</body>
    </html>
  );
}
