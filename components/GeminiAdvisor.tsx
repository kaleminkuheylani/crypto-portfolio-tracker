import React, { useState, useEffect } from 'react';
import { PortfolioItem, CoinData, User, PredictionData } from '../types';

interface GeminiAdvisorProps {
  portfolio: PortfolioItem[];
  marketData: CoinData[];
  user: User | null;
}

interface StoredPredictions {
  [key: string]: PredictionData;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ portfolio, marketData, user }) => {
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<StoredPredictions>({});
  const [currentPrediction, setCurrentPrediction] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPredictionKey = (userId: string, coinId: string) => {
    return `${userId}_${coinId}`;
  };

  const getStorageKey = (userId: string) => {
    return `kp_predictions_${userId}`;
  };

  useEffect(() => {
    if (!user) {
      setPredictions({});
      setCurrentPrediction(null);
      return;
    }

    const storedData = localStorage.getItem(getStorageKey(user.id));
    if (storedData) {
      try {
        const data = JSON.parse(storedData) as StoredPredictions;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const validPredictions: StoredPredictions = {};
        Object.entries(data).forEach(([key, pred]) => {
          const predDate = new Date(pred.createdAt);
          if (predDate.getMonth() === currentMonth && predDate.getFullYear() === currentYear) {
            validPredictions[key] = pred;
          }
        });
        
        setPredictions(validPredictions);
        localStorage.setItem(getStorageKey(user.id), JSON.stringify(validPredictions));
      } catch (e) {
        setPredictions({});
      }
    }
  }, [user]);

  useEffect(() => {
    if (!selectedCoin || !user) {
      setCurrentPrediction(null);
      return;
    }

    const key = getPredictionKey(user.id, selectedCoin);
    if (predictions[key]) {
      setCurrentPrediction(predictions[key]);
    } else {
      setCurrentPrediction(null);
    }
  }, [selectedCoin, user, predictions]);

  const hasUsedPrediction = (coinId: string): boolean => {
    if (!user) return false;
    const key = getPredictionKey(user.id, coinId);
    return !!predictions[key];
  };

  const handlePredict = async () => {
    if (!selectedCoin || !user) return;
    
    if (hasUsedPrediction(selectedCoin)) {
      setError('Bu varlik icin bu ay zaten tahmin aldiniz.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const coin = marketData.find(c => c.id === selectedCoin);
      if (!coin) throw new Error('Coin bulunamadi');

      const response = await fetch('/api/gemini/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          coinId: coin.id,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          currentPrice: coin.current_price,
          priceChange24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
          volume: coin.total_volume
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Tahmin olusturulamadi');
      }

      const key = getPredictionKey(user.id, selectedCoin);
      const updatedPredictions = { ...predictions, [key]: data };
      
      setPredictions(updatedPredictions);
      setCurrentPrediction(data);
      localStorage.setItem(getStorageKey(user.id), JSON.stringify(updatedPredictions));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu');
    } finally {
      setIsLoading(false);
    }
  };

  const getUsedPredictionsCount = (): number => {
    return Object.keys(predictions).length;
  };

  const getPredictionIcon = (type: 'bullish' | 'bearish' | 'neutral') => {
    if (type === 'bullish') {
      return (
        <div className="flex flex-col items-center">
          <svg className="w-24 h-24 text-green-500" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 8c-2 0-4 1-5 3l-6 10c-1 2-3 3-5 3H8c-2 0-3 1-3 3v4c0 2 1 3 3 3h8c2 0 4 1 5 3l2 4c1 2 1 4 0 6l-4 8c-1 2 0 4 2 5l4 2c2 1 4 0 5-2l6-10c1-2 3-3 5-3h4c2 0 4-1 5-3l6-10c1-2 0-4-2-5l-4-2c-2-1-4 0-5 2l-2 4c-1 2-3 3-5 3h-2c-2 0-4-1-5-3l-2-4c-1-2-1-4 0-6l2-4c1-2 0-4-2-5l-4-2c-1-1-2-1-3-1z"/>
            <circle cx="20" cy="24" r="3"/>
            <circle cx="44" cy="24" r="3"/>
          </svg>
          <span className="text-2xl font-bold text-green-600 mt-2">BOGA PIYASASI</span>
        </div>
      );
    } else if (type === 'bearish') {
      return (
        <div className="flex flex-col items-center">
          <svg className="w-24 h-24 text-red-500" viewBox="0 0 64 64" fill="currentColor">
            <ellipse cx="32" cy="36" rx="20" ry="16"/>
            <circle cx="24" cy="32" r="3" fill="white"/>
            <circle cx="40" cy="32" r="3" fill="white"/>
            <circle cx="24" cy="32" r="1.5" fill="black"/>
            <circle cx="40" cy="32" r="1.5" fill="black"/>
            <ellipse cx="32" cy="42" rx="4" ry="2" fill="#8B4513"/>
            <path d="M12 28c-4-8-2-16 4-20s14-2 16 2" strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round"/>
            <path d="M52 28c4-8 2-16-4-20s-14-2-16 2" strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl font-bold text-red-600 mt-2">AYI PIYASASI</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-4xl">⚖️</span>
        </div>
        <span className="text-2xl font-bold text-gray-600 mt-2">NOTR</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Gemini AI - Gelecege Bakis
        </h2>
        <p className="text-gray-600 mt-1">Her varlik icin ayda 1 tahmin hakkiniz var. AI destekli gelecek analizi alin.</p>
        {user && (
          <div className="mt-2 text-sm text-purple-600 font-medium">
            Bu ay {getUsedPredictionsCount()} varlik icin tahmin aldiniz.
          </div>
        )}
      </div>

      <div className="p-6">
        {!user ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-1">Giris Yapmaniz Gerekiyor</p>
            <p className="text-sm text-gray-500">Tahmin ozelligini kullanmak icin lutfen giris yapin.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tahmin Yapilacak Varlik</label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Bir varlik secin...</option>
                {marketData.slice(0, 50).map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()}) - ${coin.current_price.toLocaleString()}
                    {hasUsedPrediction(coin.id) ? ' (Tahmin Alindi)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {currentPrediction ? (
              <div className="space-y-6">
                <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                  {getPredictionIcon(currentPrediction.prediction)}
                  <div className="mt-4">
                    <span className="text-lg font-bold text-gray-900">{currentPrediction.coinName}</span>
                    <span className="text-gray-500 ml-2">({currentPrediction.coinSymbol.toUpperCase()})</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Zaman Dilimi: {currentPrediction.timeframe}
                  </div>
                  {currentPrediction.targetPrice && (
                    <div className="mt-2 text-lg font-bold text-blue-600">
                      Hedef Fiyat: ${currentPrediction.targetPrice.toLocaleString()}
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-500">Guven Orani:</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${currentPrediction.prediction === 'bullish' ? 'bg-green-500' : currentPrediction.prediction === 'bearish' ? 'bg-red-500' : 'bg-gray-400'}`}
                        style={{ width: `${currentPrediction.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">%{currentPrediction.confidence}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    AI Analizi
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{currentPrediction.analysis}</p>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>Bu varlik icin bu ay tahmin hakkinizi kullandiniz.</p>
                  <p>Sonraki tahmin hakki: {new Date(currentPrediction.expiresAt).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
            ) : selectedCoin ? (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePredict}
                  disabled={isLoading || hasUsedPrediction(selectedCoin)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI Analiz Ediyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      Tahmin Al
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-gray-500">
                  <p>Bu tahmin yatirim tavsiyesi degildir. Yatirim kararlari icin profesyonel danismanlik aliniz.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Tahmin almak icin bir varlik secin.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiAdvisor;
