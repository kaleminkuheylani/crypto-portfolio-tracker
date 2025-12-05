import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: {
    default: 'KriptoPusula | Yapay Zeka Destekli Kripto Takibi',
    template: '%s | KriptoPusula'
  },
  description: 'Yapay zeka destekli piyasa analizleri, anlik fiyat takibi ve akilli portfoy yonetimi. Kripto yatirimlarinizi Gemini AI ile guclendirin.',
  keywords: ['kripto', 'bitcoin', 'ethereum', 'analiz', 'yapay zeka', 'portfoy takibi', 'gemini ai', 'borsa', 'kripto para', 'yatirim'],
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
    siteName: 'KriptoPusula',
    title: 'KriptoPusula | Yapay Zeka Destekli Kripto Takibi',
    description: 'Yapay zeka destekli piyasa analizleri, anlik fiyat takibi ve akilli portfoy yonetimi.',
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
    description: 'Yapay zeka destekli piyasa analizleri, anlik fiyat takibi ve akilli portfoy yonetimi.',
    images: ['/logo.png'],
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
        <script src="https://cdn.tailwindcss.com" async></script>
        <link rel="canonical" href="https://kriptopusula.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
