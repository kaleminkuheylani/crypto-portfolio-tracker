
import React from 'react';
import { CoinData, PortfolioItem } from '../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MarketTableProps {
  data: CoinData[];
  onAddAsset: (coin: CoinData) => void;
  onViewChart: (coin: CoinData) => void;
  isLoading: boolean;
  portfolio: PortfolioItem[];
}

const MarketTable: React.FC<MarketTableProps> = ({ data, onAddAsset, onViewChart, isLoading, portfolio }) => {
  if (isLoading) {
    return <div className="p-12 text-center text-gray-400 animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Piyasa verileri CoinPaprika üzerinden yükleniyor...
    </div>;
  }

  if (data.length === 0) {
      return <div className="p-8 text-center text-gray-400 bg-gray-800 rounded-xl border border-gray-700">
          Kriterlere uygun coin bulunamadı.
      </div>;
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg animate-fade-in">
      <div className="p-6 border-b border-gray-700 bg-gray-900/50">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Canlı Piyasa 
            <span className="text-xs font-normal text-gray-500 border border-gray-700 px-2 py-0.5 rounded">CoinPaprika</span>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-900/50 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Sıra</th>
              <th className="px-6 py-4 font-semibold">Varlık</th>
              <th className="px-6 py-4 font-semibold text-right">Fiyat</th>
              <th className="px-6 py-4 font-semibold text-right">24s Değişim</th>
              <th className="px-6 py-4 font-semibold text-right hidden md:table-cell">Hacim (24s)</th>
              <th className="px-6 py-4 font-semibold text-right hidden lg:table-cell">Piyasa Değeri</th>
              <th className="px-6 py-4 font-semibold text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((coin) => {
              const isAdded = portfolio.some(item => item.coinId === coin.id);
              
              // Resim yüklenemezse fallback
              const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = 'https://assets.coincap.io/assets/icons/generic@2x.png';
              };
              
              return (
                <tr key={coin.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 w-12 text-gray-500 font-mono">
                      {coin.market_cap_rank}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                          src={coin.image} 
                          alt={coin.name}
                          onError={handleImageError} 
                          className="w-8 h-8 rounded-full bg-gray-700 object-cover"
                      />
                      <div>
                        <div className="font-bold text-white">{coin.name}</div>
                        <div className="text-xs uppercase text-gray-500">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-white font-mono">
                    ${coin.current_price < 1 
                        ? coin.current_price.toFixed(6) 
                        : coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <div className="flex items-center justify-end gap-1">
                        {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell text-gray-300">
                    ${(coin.total_volume / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 })}M
                  </td>
                  <td className="px-6 py-4 text-right hidden lg:table-cell text-gray-300">
                     ${(coin.market_cap / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })}B
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onViewChart(coin)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Canlı Grafik"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                      </button>
                      
                      {isAdded ? (
                        <button 
                          disabled
                          className="px-3 py-1.5 text-xs font-medium text-green-400 bg-green-900/20 border border-green-500/30 rounded-lg cursor-default flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Eklendi
                        </button>
                      ) : (
                        <button 
                          onClick={() => onAddAsset(coin)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
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
