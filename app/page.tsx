'use client';

import React, { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { getTopCoins, searchCoins, getFearAndGreedIndex, getMarketSentiment } from '../services/cryptoApi';
import { CoinData, PortfolioItem, PriceAlert, User, FearGreedData, MarketSentiment } from '../types';
import AuthModal from '../components/AuthModal';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Notifications from '../components/Notifications';
import Footer from '../components/Footer';

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
    
    let desc = "KriptoSavasi ile portfoyunuzu yonetin, yapay zeka destekli analizler alin ve piyasayi canli takip edin.";
    let title = "KriptoSavasi | Akilli Kripto Takibi";

    switch(activeTab) {
      case 'dashboard':
        title = "Portfoy Paneli | KriptoSavasi";
        desc = "Kripto varliklarinizi tek bir yerden yonetin ve kar/zarar durumunuzu anlik gorun.";
        break;
      case 'market':
        title = "Canli Piyasa | KriptoSavasi";
        desc = "En populer kripto paralarin canli fiyatlari, degisim oranlari ve piyasa verileri.";
        break;
      case 'chart':
        title = "Pro Teknik Analiz | KriptoSavasi";
        desc = "TradingView altyapisi ve Binance verileriyle profesyonel teknik analiz grafikleri.";
        break;
      case 'blog':
        title = "Blog & Haberler | KriptoSavasi";
        desc = "Yapay zeka tarafindan hazirlanan gunluk kripto tahminleri, teknik analizler ve piyasa haberleri.";
        break;
      case 'alerts':
        title = "Fiyat Alarmlari | KriptoSavasi";
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

  const handleRemoveNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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

      <Notifications 
        notifications={notifications} 
        onRemove={handleRemoveNotification} 
      />

      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isLoading={isLoading}
        isSearching={isSearching}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <MainContent
        activeTab={activeTab}
        coins={coins}
        portfolio={portfolio}
        alerts={alerts}
        isLoading={isLoading}
        isSearching={isSearching}
        user={user}
        fearGreedData={fearGreedData}
        marketSentiment={marketSentiment}
        selectedChartCoin={selectedChartCoin}
        onAddAsset={handleAddAsset}
        onViewChart={handleViewChart}
        onRemoveAsset={handleRemoveAsset}
        onAddAlert={handleAddAlert}
        onRemoveAlert={handleRemoveAlert}
      />

      <Footer />
    </div>
  );
}
