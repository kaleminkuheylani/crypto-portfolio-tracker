import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://kriptosavasi.com'),
  title: {
    default: 'KriptoSavası | Yapay Zeka Destekli Kripto Takibi',
    template: '%s | KriptoSavası'
  },
  description: 'Yapay zeka destekli piyasa analizleri, canlı fiyat takibi ve akıllı portföy yönetimi. Kripto yatırımlarınızı Gemini AI ile güçlendirin.',
  keywords: ['kripto', 'bitcoin', 'ethereum', 'analiz', 'yapay zeka', 'portföy takibi', 'gemini ai', 'borsa', 'kripto para', 'yatırım', 'fiyat takibi'],
  authors: [{ name: 'KriptoSavası' }],
  creator: 'KriptoSavası',
  publisher: 'KriptoSavası',
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
    url: 'https://kriptosavasi.com',
    siteName: 'KriptoSavası',
    title: 'KriptoSavası | Yapay Zeka Destekli Kripto Takibi',
    description: 'Yapay zeka destekli piyasa analizleri, canlı fiyat takibi ve akıllı portföy yönetimi.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'KriptoSavası Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KriptoSavası | Yapay Zeka Destekli Kripto Takibi',
    description: 'Yapay zeka destekli piyasa analizleri, canlı fiyat takibi ve akıllı portföy yönetimi.',
    images: ['/logo.png'],
    creator: '@kriptosavasi',
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
        <link rel="canonical" href="https://kriptosavasi.com" />
        <meta name="google-site-verification" content="lzwuDrHLjD2upb3dKLjyam-lmu9uQRnTzHnNHx7tBBE" />
      </head>
      <body>{children}</body>
    </html>
  );
}