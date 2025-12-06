import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kriptopusula.com'),
  title: {
    default: 'KriptoPusula | Yapay Zeka Destekli Kripto Takibi',
    template: '%s | KriptoPusula'
  },
  description: 'Yapay zeka destekli piyasa analizleri, canlı fiyat takibi ve akıllı portföy yönetimi. Kripto yatırımlarınızı Gemini AI ile güçlendirin.',
  keywords: ['kripto', 'bitcoin', 'ethereum', 'analiz', 'yapay zeka', 'portföy takibi', 'gemini ai', 'borsa', 'kripto para', 'yatırım', 'fiyat takibi'],
  authors: [{ name: 'KriptoPusula' }],
  creator: 'KriptoPusula',
  publisher: 'KriptoPusula',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://kriptopusula.com',
    siteName: 'KriptoPusula',
    title: 'KriptoPusula | Yapay Zeka Destekli Kripto Takibi',
    description: 'Yapay zeka destekli piyasa analizleri, canlı fiyat takibi ve akıllı portföy yönetimi.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'KriptoPusula Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KriptoPusula | Yapay Zeka Destekli Kripto Takibi',
    description: 'Yapay zeka destekli piyasa analizleri, canlı fiyat takibi ve akıllı portföy yönetimi.',
    images: ['/logo.png'],
    creator: '@kriptopusula',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="tr">
      <head>
        <link rel="canonical" href="https://kriptopusula.com" />
        <meta name="google-site-verification" content="lzwuDrHLjD2upb3dKLjyam-lmu9uQRnTzHnNHx7tBBE" />
      </head>
      <body>{children}</body>
    </html>
  );
}