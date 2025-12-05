'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopCoins } from '../../../services/cryptoApi';
import { CoinData } from '../../../types';
import TradingChart from '../../../components/TradingChart';

interface CoinPageClientProps {
  coinId: string;
}

export default function CoinPageClient({ coinId }: CoinPageClientProps) {
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchCoin = async () => {
      setIsLoading(true);
      const coins = await getTopCoins();
      const foundCoin = coins.find(c => 
        c.id === coinId || 
        c.symbol.toLowerCase() === coinId.toLowerCase() ||
        c.name.toLowerCase() === coinId.toLowerCase()
      );
      setCoin(foundCoin || null);
      setIsLoading(false);
    };

    fetchCoin();
  }, [coinId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-lg">Yukleniyor...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <img src="/logo.png" alt="KriptoPusula Logo" className="w-10 h-10 object-contain" />
              KriptoPusula
            </Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Coin Bulunamadi</h1>
          <p className="text-gray-500 mb-8">Aradiginiz kripto para bulunamadi.</p>
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg">
            Ana Sayfaya Don
          </Link>
        </main>
      </div>
    );
  }

  const priceChangeColor = coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600';
  const priceChangeBg = coin.price_change_percentage_24h >= 0 ? 'bg-green-50' : 'bg-red-50';

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
            <span className="text-blue-600 font-medium text-sm">Piyasa</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/" className="hover:text-blue-600">Piyasa</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{coin.name}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <img src={coin.image} alt={coin.name} className="w-16 h-16 rounded-full" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{coin.name}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-lg font-medium">{coin.symbol.toUpperCase()}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">#{coin.market_cap_rank}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href={`/grafik/${coin.symbol}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Pro Grafik
              </Link>
              <button
                onClick={() => setShowChart(!showChart)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                {showChart ? 'Grafigi Gizle' : 'Hizli Grafik'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Guncel Fiyat</div>
              <div className="text-2xl font-bold text-gray-900">
                ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </div>
              <div className={`text-sm font-medium ${priceChangeColor} flex items-center gap-1 mt-1`}>
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% (24s)
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Piyasa Degeri</div>
              <div className="text-xl font-bold text-gray-900">
                ${(coin.market_cap / 1000000000).toFixed(2)}B
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Sira: #{coin.market_cap_rank}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">24s Hacim</div>
              <div className="text-xl font-bold text-gray-900">
                ${(coin.total_volume / 1000000000).toFixed(2)}B
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Islem Miktari
              </div>
            </div>

            <div className={`${priceChangeBg} rounded-xl p-4`}>
              <div className="text-sm text-gray-500 mb-1">24s Degisim</div>
              <div className={`text-xl font-bold ${priceChangeColor}`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                ${Math.abs(coin.price_change_24h).toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        {showChart && (
          <div className="mb-6">
            <TradingChart symbol={coin.symbol} coinName={coin.name} onClose={() => setShowChart(false)} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Piyasa Istatistikleri</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">24s En Yuksek</span>
                <span className="font-semibold text-green-600">${coin.high_24h?.toLocaleString() || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">24s En Dusuk</span>
                <span className="font-semibold text-red-600">${coin.low_24h?.toLocaleString() || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">Tum Zamanlarin En Yuksegi</span>
                <span className="font-semibold">${coin.ath?.toLocaleString() || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">ATH'den Uzaklik</span>
                <span className={`font-semibold ${coin.ath_change_percentage < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {coin.ath_change_percentage?.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500">Tum Zamanlarin En Dusugu</span>
                <span className="font-semibold">${coin.atl?.toLocaleString() || '-'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Arz Bilgileri</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">Dolasimda Arz</span>
                <span className="font-semibold">{coin.circulating_supply?.toLocaleString() || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">Toplam Arz</span>
                <span className="font-semibold">{coin.total_supply?.toLocaleString() || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">Maksimum Arz</span>
                <span className="font-semibold">{coin.max_supply?.toLocaleString() || 'Sinirsiz'}</span>
              </div>
              {coin.max_supply && (
                <div className="pt-2">
                  <div className="text-sm text-gray-500 mb-2">Arz Orani</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min((coin.circulating_supply / coin.max_supply) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {((coin.circulating_supply / coin.max_supply) * 100).toFixed(2)}% dolasiyor
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>KriptoPusula - Yapay Zeka Destekli Kripto Takibi</p>
          <p className="mt-2 text-xs">Veriler CoinPaprika tarafindan saglanmaktadir. Yatirim tavsiyesi degildir.</p>
        </div>
      </footer>
    </div>
  );
}
