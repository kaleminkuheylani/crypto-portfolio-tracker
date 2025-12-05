import React from 'react';
import { CoinData, PortfolioItem, FearGreedData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
  marketData: CoinData[];
  onRemove: (id: string) => void;
  fearGreedData: FearGreedData | null;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolio, marketData, onRemove, fearGreedData }) => {
  const holdings = portfolio.map(item => {
    const coinLive = marketData.find(c => c.id === item.coinId);
    
    const displayCoin = {
        name: coinLive?.name || item.name || 'Varlik',
        symbol: coinLive?.symbol || item.symbol || '???',
        image: coinLive?.image || item.image || 'https://via.placeholder.com/32',
        current_price: coinLive?.current_price || item.buyPrice || 0,
    };

    const isLive = !!coinLive;

    const currentValue = item.amount * displayCoin.current_price;
    const initialValue = item.amount * item.buyPrice;
    
    const profit = isLive ? currentValue - initialValue : 0;
    const profitPercent = (isLive && initialValue > 0) ? (profit / initialValue) * 100 : 0;

    return {
      ...item,
      coin: displayCoin,
      currentValue,
      profit,
      profitPercent,
      isLive
    };
  });

  const totalValue = holdings.reduce((acc, curr) => acc + curr.currentValue, 0);
  const totalProfit = holdings.reduce((acc, curr) => acc + curr.profit, 0);

  const allocationData = holdings.map(h => ({
    name: h.coin.symbol.toUpperCase(),
    value: h.currentValue
  }));

  const generateHistoryData = () => {
      if (totalValue === 0) return [];
      const data = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          const volatility = (Math.random() - 0.5) * 0.1;
          const value = i === 0 ? totalValue : totalValue * (1 - volatility * (i + 1));
          
          data.push({
              date: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
              value: value
          });
      }
      return data;
  };

  const historyData = generateHistoryData();

  const sortedHoldings = [...holdings].sort((a, b) => b.profitPercent - a.profitPercent);
  const bestPerformer = sortedHoldings.length > 0 ? sortedHoldings[0] : null;
  const worstPerformer = sortedHoldings.length > 0 ? sortedHoldings[sortedHoldings.length - 1] : null;

  const handleExportCSV = () => {
      const headers = ['Varlik', 'Miktar', 'Alis Fiyati', 'Guncel Fiyat', 'Toplam Deger', 'Kar/Zarar ($)', 'Kar/Zarar (%)'];
      const rows = holdings.map(h => [
          h.coin.name,
          h.amount,
          h.buyPrice.toFixed(4),
          h.coin.current_price.toFixed(4),
          h.currentValue.toFixed(2),
          h.profit.toFixed(2),
          h.profitPercent.toFixed(2) + '%'
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `kriptopusula_portfoy_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (holdings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center animate-fade-in shadow-sm">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfoyunuz Bos</h2>
        <p className="text-gray-500 max-w-md mx-auto">Takibe baslamak icin piyasa ekranindan varlik ekleyin veya sag ustten arama yapin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Veri Yedekleme</div>
                    <div className="font-bold text-gray-900">Portfoy Disa Aktar</div>
                </div>
             </div>
             <button onClick={handleExportCSV} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                 Excel / CSV Indir
             </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 relative overflow-hidden shadow-sm">
             {fearGreedData ? (
                 <>
                    <div className="text-xs text-gray-500 mb-1">Piyasa Duygusu</div>
                    <div className="text-2xl font-bold text-gray-900">{fearGreedData.value}</div>
                    <div className={`text-sm font-medium ${
                        parseInt(fearGreedData.value) > 60 ? 'text-green-600' : 
                        parseInt(fearGreedData.value) < 40 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                        {fearGreedData.value_classification}
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
                        <div 
                           className={`h-full rounded-full ${
                               parseInt(fearGreedData.value) > 60 ? 'bg-green-500' : 
                               parseInt(fearGreedData.value) < 40 ? 'bg-red-500' : 'bg-yellow-500'
                           }`} 
                           style={{ width: `${fearGreedData.value}%` }}
                        ></div>
                    </div>
                 </>
             ) : (
                 <div className="flex items-center justify-center h-full text-gray-400 text-sm">Veri Yukleniyor...</div>
             )}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Portfoy Performansi</h2>
                        <p className="text-sm text-gray-500">Son 7 Gun (Simule)</p>
                    </div>
                    <div className="text-right">
                         <div className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                         <div className={`text-sm ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         </div>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historyData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827' }}
                                itemStyle={{ color: '#111827' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Deger']}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Varlik Detaylari</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Varlik</th>
                            <th className="px-6 py-3 text-right">Miktar</th>
                            <th className="px-6 py-3 text-right">Ort. Fiyat</th>
                            <th className="px-6 py-3 text-right">Guncel Deger</th>
                            <th className="px-6 py-3 text-right">K/Z</th>
                            <th className="px-6 py-3 text-right"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {holdings.map((h) => (
                            <tr key={h.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                <img src={h.coin.image} alt={h.coin.name} className={`w-8 h-8 rounded-full ${!h.isLive ? 'opacity-50 grayscale' : ''}`} />
                                <div>
                                    <span className="font-bold text-gray-900 block">{h.coin.name}</span>
                                    <span className="text-xs uppercase">{h.coin.symbol}</span>
                                    {!h.isLive && <span className="ml-1 text-[10px] text-yellow-600 border border-yellow-300 px-1 rounded">Offline</span>}
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="text-gray-900 font-medium">{h.amount}</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                ${h.buyPrice.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-900 font-medium">
                                ${h.currentValue.toLocaleString()}
                            </td>
                            <td className={`px-6 py-4 text-right ${!h.isLive ? 'text-gray-400' : (h.profit >= 0 ? 'text-green-600' : 'text-red-600')}`}>
                                {!h.isLive ? '-' : (
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold">{h.profit >= 0 ? '+' : ''}{h.profit.toLocaleString(undefined, { maximumFractionDigits: 2 })} $</span>
                                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mt-0.5">{h.profitPercent.toFixed(2)}%</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => onRemove(h.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Portfoy Dagilimi</h3>
                <div className="flex-1 min-h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={allocationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {allocationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827' }}
                            itemStyle={{ color: '#111827' }}
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-xs text-gray-500">Toplam</div>
                        <div className="text-lg font-bold text-gray-900">${totalValue.toLocaleString(undefined, { notation: "compact" })}</div>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {allocationData.slice(0, 4).map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-gray-700 truncate">{entry.name}</span>
                        <span className="text-gray-400 ml-auto">{totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(0) : 0}%</span>
                    </div>
                    ))}
                </div>
            </div>

            {bestPerformer && bestPerformer.profit > 0 && (
                <div className="bg-gradient-to-br from-white to-green-50 rounded-xl border border-green-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                        <div className="text-sm text-green-700 font-medium">En Iyi Performans</div>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <img src={bestPerformer.coin.image} alt="" className="w-8 h-8 rounded-full" />
                             <span className="font-bold text-gray-900">{bestPerformer.coin.name}</span>
                         </div>
                         <div className="text-green-600 font-bold">+{bestPerformer.profitPercent.toFixed(2)}%</div>
                    </div>
                </div>
            )}

            {worstPerformer && worstPerformer.profit < 0 && (
                <div className="bg-gradient-to-br from-white to-red-50 rounded-xl border border-red-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                        </div>
                        <div className="text-sm text-red-700 font-medium">En Kotu Performans</div>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <img src={worstPerformer.coin.image} alt="" className="w-8 h-8 rounded-full" />
                             <span className="font-bold text-gray-900">{worstPerformer.coin.name}</span>
                         </div>
                         <div className="text-red-600 font-bold">{worstPerformer.profitPercent.toFixed(2)}%</div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;
