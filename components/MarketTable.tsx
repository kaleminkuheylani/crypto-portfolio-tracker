import React from 'react';
import Link from 'next/link';
import { CoinData, PortfolioItem } from '../types';

interface MarketTableProps {
  data: CoinData[];
  onAddAsset: (coin: CoinData) => void;
  onViewChart: (coin: CoinData) => void;
  isLoading: boolean;
  portfolio: PortfolioItem[];
}

const MarketTable: React.FC<MarketTableProps> = ({ data, onAddAsset, onViewChart, isLoading, portfolio }) => {
  if (isLoading) {
    return <div className="p-12 text-center text-gray-500 animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Piyasa verileri CoinPaprika uzerinden yukleniyor...
    </div>;
  }

  if (data.length === 0) {
      return <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
          Kriterlere uygun coin bulunamadi.
      </div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-fade-in">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Canli Piyasa 
            <span className="text-xs font-normal text-gray-500 border border-gray-200 px-2 py-0.5 rounded">CoinPaprika</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Sira</th>
              <th className="px-6 py-4 font-semibold">Varlik</th>
              <th className="px-6 py-4 font-semibold text-right">Fiyat</th>
              <th className="px-6 py-4 font-semibold text-right">24s Degisim</th>
              <th className="px-6 py-4 font-semibold text-right hidden md:table-cell">Hacim (24s)</th>
              <th className="px-6 py-4 font-semibold text-right hidden lg:table-cell">Piyasa Degeri</th>
              <th className="px-6 py-4 font-semibold text-right">Islem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((coin) => {
              const isAdded = portfolio.some(item => item.coinId === coin.id);
              
              const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = 'https://assets.coincap.io/assets/icons/generic@2x.png';
              };
              
              return (
                <tr key={coin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 w-12 text-gray-400 font-mono">
                      {coin.market_cap_rank}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                          src={coin.image} 
                          alt={coin.name}
                          onError={handleImageError} 
                          className="w-8 h-8 rounded-full bg-gray-100 object-cover"
                      />
                      <div>
                        <Link href={`/piyasa/${coin.id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                          {coin.name}
                        </Link>
                        <div className="text-xs uppercase text-gray-400">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900 font-mono">
                    ${coin.current_price < 1 
                        ? coin.current_price.toFixed(6) 
                        : coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="flex items-center justify-end gap-1">
                        {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell text-gray-600">
                    ${(coin.total_volume / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 })}M
                  </td>
                  <td className="px-6 py-4 text-right hidden lg:table-cell text-gray-600">
                     ${(coin.market_cap / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })}B
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onViewChart(coin)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Canli Grafik"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                      </button>
                      
                      {isAdded ? (
                        <button 
                          disabled
                          className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg cursor-default flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Eklendi
                        </button>
                      ) : (
                        <button 
                          onClick={() => onAddAsset(coin)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          + Ekle
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;