import React, { useState } from 'react';
import { CoinData, PriceAlert } from '../types';

interface AlertsSectionProps {
  marketData: CoinData[];
  alerts: PriceAlert[];
  onAddAlert: (coinId: string, targetPrice: number, condition: 'above' | 'below') => void;
  onRemoveAlert: (id: string) => void;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ 
  marketData, 
  alerts, 
  onAddAlert, 
  onRemoveAlert
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(marketData[0]?.id || '');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoinId || !targetPrice) return;
    
    onAddAlert(selectedCoinId, parseFloat(targetPrice), condition);
    setTargetPrice('');
    alert('Alarm basariyla olusturuldu!');
  };

  const selectedCoin = marketData.find(c => c.id === selectedCoinId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            Yeni Alarm Kur
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Kripto Varlik</label>
              <select 
                value={selectedCoinId}
                onChange={(e) => setSelectedCoinId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {marketData.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()}) - ${coin.current_price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Hedef Fiyat ($)</label>
              <div className="relative">
                 <input 
                    type="number" 
                    step="0.00000001"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Orn: 50000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none pl-8"
                    required
                 />
                 <span className="absolute left-3 top-2.5 text-gray-400">$</span>
              </div>
              {selectedCoin && (
                  <div className="text-xs text-gray-500 mt-1">
                      Su an: ${selectedCoin.current_price.toLocaleString()}
                  </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Kosul</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${condition === 'above' ? 'bg-green-50 border-green-500 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  Yukselince
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${condition === 'below' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  Dusunce
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-sm transition-all mt-2"
            >
              Alarmi Kaydet
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
         <h3 className="text-xl font-bold text-gray-900 mb-6">Aktif Alarmlar ({alerts.length})</h3>
         
         {alerts.length === 0 ? (
             <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed p-12 text-center text-gray-500">
                 <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                 <p>Henuz kurulu bir alarminiz yok.</p>
                 <p className="mt-2 text-sm">Soldaki formu kullanarak yeni bir alarm olusturabilirsiniz.</p>
             </div>
         ) : (
             <div className="grid gap-4">
                 {alerts.map(alert => (
                     <div key={alert.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between group hover:border-gray-300 transition-colors shadow-sm">
                         <div className="flex items-center gap-4">
                             <img src={alert.coinImage} alt={alert.coinSymbol} className="w-10 h-10 rounded-full" />
                             <div>
                                 <div className="font-bold text-gray-900 text-lg">{alert.coinSymbol.toUpperCase()}</div>
                                 <div className="text-sm text-gray-500">
                                     Hedef: <span className="text-gray-900 font-mono">${alert.targetPrice.toLocaleString()}</span>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="flex items-center gap-6">
                             <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase flex items-center gap-1 ${
                                 alert.condition === 'above' 
                                 ? 'bg-green-50 border-green-200 text-green-600' 
                                 : 'bg-red-50 border-red-200 text-red-600'
                             }`}>
                                 {alert.condition === 'above' ? 'Ustune Cikarsa' : 'Altina Duserse'}
                             </div>
                             
                             <button 
                                onClick={() => onRemoveAlert(alert.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                title="Alarmi Sil"
                             >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>
    </div>
  );
};

export default AlertsSection;
