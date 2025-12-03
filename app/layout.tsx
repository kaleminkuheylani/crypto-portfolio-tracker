import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'KriptoPusula | Yapay Zeka Destekli Kripto Takibi',
  description: 'Yapay zeka destekli piyasa analizleri, anlık fiyat takibi ve akıllı portföy yönetimi. Kripto yatırımlarınızı Gemini AI ile güçlendirin.',
  keywords: 'kripto, bitcoin, analiz, yapay zeka, portföy takibi, gemini ai, borsa',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="tr" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com" async></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
