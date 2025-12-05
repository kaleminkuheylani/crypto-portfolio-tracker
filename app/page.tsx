'use client';

import React, { useState, useEffect } from 'react';
import { getTopCoins, searchCoins, getFearAndGreedIndex, getMarketSentiment } from '../services/cryptoApi';
import { CoinData, PortfolioItem, PriceAlert, User, FearGreedData, MarketSentiment } from '../types';
import MarketTable from '../components/MarketTable';
import PortfolioSection from '../components/PortfolioSection';
import GeminiAdvisor from '../components/GeminiAdvisor';
import BlogSection from '../components/BlogSection';
import TradingChart from '../components/TradingChart';
import AlertsSection from '../components/AlertsSection';
import AuthModal from '../components/AuthModal';
import AboutSection from '../components/AboutSection';
import MarketSentimentPanel from '../components/MarketSentimentPanel';
import { AuthService } from '../services/authService';

export default function Home() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'market' | 'blog' | 'chart' | 'alerts' | 'about'>('dashboard');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAssetToAdd, setPendingAssetToAdd] = useState<CoinData | null>(null);
  
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'success' | 'info'}[]>([]);
  const [selectedChartCoin, setSelectedChartCoin] = useState<{symbol: string, name: string} | null>(null);
  
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedPortfolio = localStorage.getItem('nexus_portfolio');
    const savedAlerts = localStorage.getItem('nexus_alerts');
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    let title = "KriptoPusula | Akilli Kripto Takibi";
    let desc = "KriptoPusula ile portfoyunuzu yonetin, yapay zeka destekli analizler alin ve piyasayi canli takip edin.";

    switch(activeTab) {
      case 'dashboard':
        title = "Portfoy Paneli | KriptoPusula";
        desc = "Kripto varliklarinizi tek bir yerden yonetin ve kar/zarar durumunuzu anlik gorun.";
        break;
      case 'market':
        title = "Canli Piyasa | KriptoPusula";
        desc = "En populer kripto paralarin canli fiyatlari, degisim oranlari ve piyasa verileri.";
        break;
      case 'chart':
        title = "Pro Teknik Analiz | KriptoPusula";
        desc = "TradingView altyapisi ve Binance verileriyle profesyonel teknik analiz grafikleri.";
        break;
      case 'blog':
        title = "Blog & Haberler | KriptoPusula";
        desc = "Yapay zeka tarafindan hazirlanan gunluk kripto tahminleri, teknik analizler ve piyasa haberleri.";
        break;
      case 'alerts':
        title = "Fiyat Alarmlari | KriptoPusula";
        break;
    }

    document.title = title;
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);
  }, [activeTab, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
        setUser(currentUser);
    }
    
    getFearAndGreedIndex().then(data => setFearGreedData(data));
    getMarketSentiment().then(data => setMarketSentiment(data));
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    
    const fetchData = async () => {
      if (searchQuery.length > 2) {
          setIsSearching(true);
          const results = await searchCoins(searchQuery);
          setCoins(results);
          setIsSearching(false);
      } else {
          if (coins.length === 0 || searchQuery === '') {
              if (coins.length === 0) setIsLoading(true);
              const data = await getTopCoins();
              setCoins(data);
              setIsLoading(false);
          }
      }
    };

    const timeoutId = setTimeout(() => {
        fetchData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (searchQuery.length > 0) return;

    const interval = setInterval(async () => {
        const data = await getTopCoins();
        setCoins(data);
    }, 15000);

    return () => clearInterval(interval);
  }, [searchQuery, isMounted]);


  useEffect(() => {
    if (!isMounted) return;
    if (coins.length === 0 || alerts.length === 0) return;
    const triggeredAlertIds: string[] = [];
    alerts.forEach(alert => {
      const coin = coins.find(c => c.id === alert.coinId);
      if (coin) {
        let triggered = false;
        if (alert.condition === 'above' && coin.current_price >= alert.targetPrice) {
           triggered = true;
           addNotification(`${coin.symbol.toUpperCase()} fiyati $${alert.targetPrice} seviyesini GECTI!`, 'success');
        } else if (alert.condition === 'below' && coin.current_price <= alert.targetPrice) {
           triggered = true;
           addNotification(`${coin.symbol.toUpperCase()} fiyati $${alert.targetPrice} seviyesinin ALTINA DUSTU!`, 'info');
        }
        if (triggered) triggeredAlertIds.push(alert.id);
      }
    });
    if (triggeredAlertIds.length > 0) {
      setAlerts(prev => prev.filter(a => !triggeredAlertIds.includes(a.id)));
    }
  }, [coins, alerts, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('nexus_portfolio', JSON.stringify(portfolio));
  }, [portfolio, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('nexus_alerts', JSON.stringify(alerts));
  }, [alerts, isMounted]);

  const addNotification = (message: string, type: 'success' | 'info') => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleAddAsset = (coin: CoinData) => {
    if (portfolio.some(item => item.coinId === coin.id)) {
        alert(`${coin.name} zaten portfoyunuzde mevcut.`);
        return;
    }
    if (!user) {
        setPendingAssetToAdd(coin);
        setIsAuthModalOpen(true);
        return;
    }
    processAddAsset(coin);
  };

  const processAddAsset = (coin: CoinData) => {
    const amountStr = prompt(`${coin.name} miktarini girin:`, "1");
    if (amountStr === null) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        alert("Lutfen gecerli bir miktar girin.");
        return;
    }
    const newAsset: PortfolioItem = {
        id: crypto.randomUUID(),
        coinId: coin.id,
        amount: amount,
        buyPrice: coin.current_price,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image
    };
    setPortfolio(prev => [...prev, newAsset]);
    addNotification(`${coin.name} portfoye eklendi.`, 'success');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
      setUser(loggedInUser);
      setIsAuthModalOpen(false);
      addNotification(`Hosgeldin, ${loggedInUser.name}!`, 'success');
      if (pendingAssetToAdd) {
          processAddAsset(pendingAssetToAdd);
          setPendingAssetToAdd(null);
      }
  };

  const handleLogout = () => {
      if(confirm('Cikis yapmak istediginize emin misiniz?')) {
          AuthService.logout();
          setUser(null);
          addNotification('Cikis yapildi.', 'info');
      }
  };

  const handleRemoveAsset = (id: string) => {
    if(confirm('Bu varligi silmek istediginizden emin misiniz?')) {
        setPortfolio(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleViewChart = (coin: CoinData) => {
      setSelectedChartCoin({ symbol: coin.symbol, name: coin.name });
      setActiveTab('chart');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAlert = (coinId: string, targetPrice: number, condition: 'above' | 'below') => {
    const coin = coins.find(c => c.id === coinId);
    if (!coin) return;
    const newAlert: PriceAlert = {
      id: crypto.randomUUID(),
      coinId,
      coinSymbol: coin.symbol,
      coinImage: coin.image,
      targetPrice,
      condition,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-800 text-xl">Yukleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { setIsAuthModalOpen(false); setPendingAssetToAdd(null); }} 
        onLoginSuccess={handleLoginSuccess}
      />

      <div className="fixed top-4 right-4 z-[110] flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto p-4 rounded-lg shadow-2xl text-white font-medium flex items-center gap-3 animate-fade-in-right w-80 ${n.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
             <span className="text-2xl">{n.type === 'success' ? '🚀' : '📩'}</span>
             <div>
               <div className="text-xs opacity-75">{n.type === 'success' ? 'Basarili' : 'Bildirim'}</div>
               {n.message}
             </div>
          </div>
        ))}
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
               <img src="/logo.png" alt="KriptoPusula Logo" className="w-10 h-10 object-contain" />
               KriptoPusula
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Panel
              </button>
              <button onClick={() => setActiveTab('market')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'market' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Canli Piyasa
              </button>
              <button onClick={() => setActiveTab('chart')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'chart' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Pro Grafik
              </button>
              <button onClick={() => setActiveTab('alerts')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Alarmlar
              </button>
              <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'blog' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Blog
              </button>
              <button onClick={() => setActiveTab('about')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'about' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Hakkimizda
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></span>
                <span className="text-xs font-medium text-gray-600">{isLoading || isSearching ? 'Guncelleniyor...' : 'Canli'}</span>
              </div>
              
              {user ? (
                <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-200" />
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title="Cikis Yap">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
              ) : (
                <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                    Giris Yap
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden pb-3 flex gap-2 overflow-x-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Panel</button>
            <button onClick={() => setActiveTab('market')} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Piyasa</button>
            <button onClick={() => setActiveTab('chart')} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Grafik</button>
            <button onClick={() => setActiveTab('alerts')} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Alarmlar</button>
            <button onClick={() => setActiveTab('blog')} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'blog' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Blog</button>
            <button onClick={() => setActiveTab('about')} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'about' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Hakkimizda</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'dashboard' ? 'Portfoy Paneli' : 
             activeTab === 'market' ? 'Piyasa Genel Bakis' : 
             activeTab === 'chart' ? 'Pro Teknik Analiz' : 
             activeTab === 'alerts' ? 'Fiyat Alarmlari' : 
             activeTab === 'about' ? 'Hakkimizda' :
             'Kripto Gundemi'}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeTab === 'dashboard' ? 'Varliklarinizi takip edin ve piyasa durumunu gorun.' : 
             activeTab === 'market' ? 'Anlik piyasa verileri ve detayli istatistikler.' : 
             activeTab === 'chart' ? 'Binance canli veri akisi ile detayli mum grafigi.' :
             activeTab === 'alerts' ? 'Kritik fiyat seviyeleri icin kisisel alarmlarinizi yonetin.' :
             activeTab === 'about' ? 'Misyonumuz ve vizyonumuz hakkinda bilgi edinin.' :
             'Piyasa verilerine gore yapay zeka tarafindan derlenen guncel haberler.'}
          </p>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <MarketSentimentPanel sentiment={marketSentiment} fearGreedData={fearGreedData} />
            <PortfolioSection 
              portfolio={portfolio} 
              marketData={coins} 
              onRemove={handleRemoveAsset}
              fearGreedData={fearGreedData}
            />
            <GeminiAdvisor portfolio={portfolio} marketData={coins} user={user} />
          </div>
        )}
        
        {activeTab === 'market' && (
          <MarketTable 
            data={coins} 
            isLoading={isLoading} 
            onAddAsset={handleAddAsset}
            onViewChart={handleViewChart}
            portfolio={portfolio}
          />
        )}
        
        {activeTab === 'chart' && selectedChartCoin && (
          <TradingChart symbol={selectedChartCoin.symbol} coinName={selectedChartCoin.name} />
        )}
        {activeTab === 'chart' && !selectedChartCoin && (
          <TradingChart symbol="btc" coinName="Bitcoin" />
        )}

        {activeTab === 'alerts' && (
          <AlertsSection 
            marketData={coins}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onRemoveAlert={handleRemoveAlert}
          />
        )}

        {activeTab === 'blog' && (
          <BlogSection marketData={coins} />
        )}

        {activeTab === 'about' && (
          <AboutSection />
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>KriptoPusula - Kar amaci gutmeyen, topluluk odakli kripto egitim platformu</p>
            <p className="mt-2">Veriler CoinPaprika ve Binance tarafindan saglanmaktadir. AI ongoruleri Google Gemini ile guclendirilmistir.</p>
            <p className="mt-2">&copy; {new Date().getFullYear()} KriptoPusula. Tum haklari saklidir.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
