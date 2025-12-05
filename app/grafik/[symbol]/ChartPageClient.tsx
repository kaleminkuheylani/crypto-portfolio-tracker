'use client';

import React from 'react';
import Link from 'next/link';
import TradingChart from '../../../components/TradingChart';

interface ChartPageClientProps {
  symbol: string;
}

const coinNames: Record<string, string> = {
  'btc': 'Bitcoin',
  'eth': 'Ethereum',
  'bnb': 'Binance Coin',
  'xrp': 'XRP',
  'ada': 'Cardano',
  'sol': 'Solana',
  'doge': 'Dogecoin',
  'dot': 'Polkadot',
  'matic': 'Polygon',
  'shib': 'Shiba Inu',
  'ltc': 'Litecoin',
  'avax': 'Avalanche',
  'link': 'Chainlink',
  'atom': 'Cosmos',
  'uni': 'Uniswap',
};

export default function ChartPageClient({ symbol }: ChartPageClientProps) {
  const coinName = coinNames[symbol.toLowerCase()] || symbol.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-500 transition-colors">
            <img src="/logo.png" alt="KriptoPusula Logo" className="w-10 h-10 object-contain" />
            KriptoPusula
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
              Ana Sayfa
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
              Blog
            </Link>
            <span className="text-blue-600 font-medium text-sm">Grafik</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/" className="hover:text-blue-600">Piyasa</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{coinName} Grafik</span>
          </nav>
        </div>

        <TradingChart symbol={symbol} coinName={coinName} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Teknik Analiz
            </h3>
            <p className="text-sm text-gray-600">
              SMA, EMA, Bollinger Bands gibi profesyonel teknik indikatorleri kullanarak piyasayi analiz edin.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Canli Veri
            </h3>
            <p className="text-sm text-gray-600">
              Binance WebSocket API uzerinden anlik fiyat guncellemeleri ve gercek zamanli mum grafikleri.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Coklu Zaman Dilimi
            </h3>
            <p className="text-sm text-gray-600">
              1 dakika ile 1 gun arasinda farkli zaman dilimlerinde grafik analizi yapin.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>KriptoPusula - Yapay Zeka Destekli Kripto Takibi</p>
          <p className="mt-2 text-xs">Veriler Binance tarafindan saglanmaktadir. Yatirim tavsiyesi degildir.</p>
        </div>
      </footer>
    </div>
  );
}
