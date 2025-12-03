
import React, { useState } from 'react';
import { CoinData, PriceAlert } from '../types';

interface AlertsSectionProps {
  marketData: CoinData[];
  alerts: PriceAlert[];
  onAddAlert: (coinId: string, targetPrice: number, condition: 'above' | 'below') => void;
  onRemoveAlert: (id: string) => void;
  isPremium: boolean;
  onOpenPremium: () => void;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ 
  marketData, 
  alerts, 
  onAddAlert, 
  onRemoveAlert,
  isPremium,
  onOpenPremium
}) => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(marketData[0]?.id || '');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Premium kontrolü
    if (!isPremium) {
      onOpenPremium();
      return;
    }

    if (!selectedCoinId || !targetPrice) return;
    
    onAddAlert(selectedCoinId, parseFloat(targetPrice), condition);
    setTargetPrice('');
    alert('Alarm başarıyla oluşturuldu!');
  };

  const selectedCoin = marketData.find(c => c.id === selectedCoinId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Alarm Oluşturma Formu */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg sticky top-24 relative overflow-hidden">
          
          {/* Non-Premium Overlay */}
          {!isPremium && (
            <div className="absolute inset-0 z-10 bg-gray-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
               <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-yellow-500/50 shadow-lg shadow-yellow-500/10">
                  <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Özellik Kilitli</h3>
               <p className="text-sm text-gray-300 mb-6">Sınırsız fiyat alarmı kurmak için Premium üyeliğe geçiş yapın.</p>
               <button 
                 onClick={onOpenPremium}
                 className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg shadow-lg hover:scale-105 transition-transform"
               >
                 Kilidi Aç
               </button>
            </div>
          )}

          <h2 className={`text-xl font-bold text-white mb-6 flex items-center gap-2 ${!isPremium ? 'opacity-50' : ''}`}>
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            Yeni Alarm Kur
          </h2>
          
          <form onSubmit={handleSubmit} className={`space-y-4 ${!isPremium ? 'opacity-30 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Kripto Varlık</label>
              <select 
                value={selectedCoinId}
                onChange={(e) => setSelectedCoinId(e.target.value)}
                disabled={!isPremium}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {marketData.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()}) - ${coin.current_price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Hedef Fiyat ($)</label>
              <div className="relative">
                 <input 
                    type="number" 
                    step="0.00000001"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Örn: 50000"
                    disabled={!isPremium}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none pl-8"
                    required
                 />
                 <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              </div>
              {selectedCoin && (
                  <div className="text-xs text-gray-500 mt-1">
                      Şu an: ${selectedCoin.current_price.toLocaleString()}
                  </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Koşul</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  disabled={!isPremium}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${condition === 'above' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                >
                  ▲ Yükselince
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  disabled={!isPremium}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${condition === 'below' ? 'bg-red-600/20 border-red-500 text-red-400' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                >
                  ▼ Düşünce
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!isPremium}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all mt-2 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Alarmı Kaydet
            </button>
          </form>
        </div>
      </div>

      {/* Aktif Alarmlar Listesi */}
      <div className="lg:col-span-2">
         <h3 className="text-xl font-bold text-white mb-6">Aktif Alarmlar ({alerts.length})</h3>
         
         {alerts.length === 0 ? (
             <div className="bg-gray-800/50 rounded-xl border border-gray-700 border-dashed p-12 text-center text-gray-400">
                 <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                 <p>Henüz kurulu bir alarmınız yok.</p>
                 {!isPremium && <p className="mt-2 text-sm text-yellow-500">Alarm kurmak için Premium üyelik gereklidir.</p>}
             </div>
         ) : (
             <div className="grid gap-4">
                 {alerts.map(alert => (
                     <div key={alert.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 flex items-center justify-between group hover:border-gray-500 transition-colors">
                         <div className="flex items-center gap-4">
                             <img src={alert.coinImage} alt={alert.coinSymbol} className="w-10 h-10 rounded-full" />
                             <div>
                                 <div className="font-bold text-white text-lg">{alert.coinSymbol.toUpperCase()}</div>
                                 <div className="text-sm text-gray-400">
                                     Hedef: <span className="text-white font-mono">${alert.targetPrice.toLocaleString()}</span>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="flex items-center gap-6">
                             <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase flex items-center gap-1 ${
                                 alert.condition === 'above' 
                                 ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                 : 'bg-red-500/10 border-red-500/30 text-red-400'
                             }`}>
                                 {alert.condition === 'above' ? '▲ Üstüne Çıkarsa' : '▼ Altına Düşerse'}
                             </div>
                             
                             <button 
                                onClick={() => onRemoveAlert(alert.id)}
                                className="text-gray-500 hover:text-red-400 transition-colors p-2"
                                title="Alarmı Sil"
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
