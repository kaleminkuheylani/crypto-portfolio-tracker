'use client';

import React, { useState, useEffect } from 'react';
import { getTopCoins, searchCoins, getFearAndGreedIndex } from '../services/cryptoApi';
import { CoinData, PortfolioItem, PriceAlert, User, FearGreedData } from '../types';
import MarketTable from '../components/MarketTable';
import PortfolioSection from '../components/PortfolioSection';
import GeminiAdvisor from '../components/GeminiAdvisor';
import BlogSection from '../components/BlogSection';
import TradingChart from '../components/TradingChart';
import PremiumModal from '../components/PremiumModal';
import AlertsSection from '../components/AlertsSection';
import PremiumSection from '../components/PremiumSection';
import AuthModal from '../components/AuthModal';
import PaymentModal from '../components/PaymentModal';
import AboutSection from '../components/AboutSection';
import PrivacyModal from '../components/PrivacyModal';
import { AuthService } from '../services/authService';

export default function Home() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'market' | 'blog' | 'chart' | 'alerts' | 'premium' | 'about'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAssetToAdd, setPendingAssetToAdd] = useState<CoinData | null>(null);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  
  const [isPremium, setIsPremium] = useState(false);
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'success' | 'info'}[]>([]);
  const [selectedChartCoin, setSelectedChartCoin] = useState<{symbol: string, name: string} | null>(null);
  
  const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(null);
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
    
    let title = "KriptoPusula | Akıllı Kripto Takibi";
    let desc = "KriptoPusula ile portföyünüzü yönetin, yapay zeka destekli analizler alın ve piyasayı canlı takip edin.";

    switch(activeTab) {
      case 'dashboard':
        title = "Portföy Paneli | KriptoPusula";
        desc = "Kripto varlıklarınızı tek bir yerden yönetin ve kâr/zarar durumunuzu anlık görün.";
        break;
      case 'market':
        title = "Canlı Piyasa | KriptoPusula";
        desc = "En popüler kripto paraların canlı fiyatları, değişim oranları ve piyasa verileri.";
        break;
      case 'chart':
        title = "Pro Teknik Analiz | KriptoPusula";
        desc = "TradingView altyapısı ve Binance verileriyle profesyonel teknik analiz grafikleri.";
        break;
      case 'blog':
        title = "Blog & Haberler | KriptoPusula";
        desc = "Yapay zeka tarafından hazırlanan günlük kripto tahminleri, teknik analizler ve piyasa haberleri.";
        break;
      case 'premium':
        title = "Premium Üyelik | KriptoPusula";
        desc = "Sınırsız portföy takibi ve özel özellikler için KriptoPusula Premium'a geçin.";
        break;
      case 'alerts':
        title = "Fiyat Alarmları | KriptoPusula";
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
           addNotification(`${coin.symbol.toUpperCase()} fiyatı $${alert.targetPrice} seviyesini GEÇTİ!`, 'success');
        } else if (alert.condition === 'below' && coin.current_price <= alert.targetPrice) {
           triggered = true;
           addNotification(`${coin.symbol.toUpperCase()} fiyatı $${alert.targetPrice} seviyesinin ALTINA DÜŞTÜ!`, 'info');
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
        alert(`${coin.name} zaten portföyünüzde mevcut.`);
        return;
    }
    if (!user) {
        setPendingAssetToAdd(coin);
        setIsAuthModalOpen(true);
        return;
    }
    if (!isPremium && portfolio.length >= 5) {
        setIsPremiumModalOpen(true);
        return;
    }
    processAddAsset(coin);
  };

  const processAddAsset = (coin: CoinData) => {
    const amountStr = prompt(`${coin.name} miktarını girin:`, "1");
    if (amountStr === null) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        alert("Lütfen geçerli bir miktar girin.");
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
    addNotification(`${coin.name} portföye eklendi.`, 'success');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
      setUser(loggedInUser);
      setIsAuthModalOpen(false);
      addNotification(`Hoşgeldin, ${loggedInUser.name}!`, 'success');
      if (pendingAssetToAdd) {
          processAddAsset(pendingAssetToAdd);
          setPendingAssetToAdd(null);
      }
  };

  const handleLogout = () => {
      if(confirm('Çıkış yapmak istediğinize emin misiniz?')) {
          AuthService.logout();
          setUser(null);
          addNotification('Çıkış yapıldı.', 'info');
      }
  };

  const handleRemoveAsset = (id: string) => {
    if(confirm('Bu varlığı silmek istediğinizden emin misiniz?')) {
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

  const handleInitiateSubscribe = () => {
    if (!user) {
        setIsAuthModalOpen(true);
        addNotification("Önce giriş yapmalısınız.", "info");
        return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPremium(true);
    setIsPaymentModalOpen(false);
    setIsPremiumModalOpen(false);
    addNotification("Ödeme başarılı! Premium hesabınız aktif edildi.", "success");
    setTimeout(() => {
        addNotification(`Sipariş özeti ve fatura ${user?.email || 'e-posta'} adresinize gönderildi.`, "info");
    }, 1500);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100 font-sans relative">
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { setIsAuthModalOpen(false); setPendingAssetToAdd(null); }} 
        onLoginSuccess={handleLoginSuccess}
      />
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        price="99.90"
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />
      <PrivacyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <div className="fixed top-4 right-4 z-[110] flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`pointer-events-auto p-4 rounded-lg shadow-2xl text-white font-medium flex items-center gap-3 animate-fade-in-right w-80 ${n.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
             <span className="text-2xl">{n.type === 'success' ? '🚀' : '📩'}</span>
             <div>
               <div className="text-xs opacity-75">{n.type === 'success' ? 'Başarılı' : 'Bildirim'}</div>
               {n.message}
             </div>
          </div>
        ))}
      </div>

      <div className="md:hidden bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-500">
           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
           KriptoPusula
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-800 border-b border-gray-700 z-40 p-4 space-y-2 shadow-xl">
             <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Panel</button>
             <button onClick={() => { setActiveTab('market'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-lg ${activeTab === 'market' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Piyasa</button>
             <button onClick={() => { setActiveTab('chart'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-lg ${activeTab === 'chart' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Pro Grafik</button>
             <button onClick={() => { setActiveTab('alerts'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-lg ${activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Alarmlar</button>
             <button onClick={() => { setActiveTab('blog'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-lg ${activeTab === 'blog' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Blog</button>
             <button onClick={() => { setActiveTab('premium'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-lg ${activeTab === 'premium' ? 'bg-yellow-600 text-white' : 'text-yellow-500'}`}>Premium</button>
             <button onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-lg ${activeTab === 'about' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Hakkımızda</button>
        </div>
      )}

      <div className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2 font-bold text-2xl text-blue-500">
           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
           KriptoPusula
        </div>

        <div className="px-6 py-4 border-b border-gray-700 mb-4">
            {user ? (
                <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-600" />
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{user.name}</div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                    </div>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-400" title="Çıkış Yap">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                    Giriş Yap / Üye Ol
                </button>
            )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Panel
          </button>
          <button onClick={() => setActiveTab('market')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'market' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            Canlı Piyasa
          </button>
          <button onClick={() => setActiveTab('chart')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chart' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
            Pro Grafik
          </button>
          <button onClick={() => setActiveTab('alerts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'alerts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            Alarmlar
            {!isPremium && <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">PRO</span>}
          </button>
          <button onClick={() => setActiveTab('blog')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'blog' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
            Blog & Haberler
          </button>
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'about' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Hakkımızda
          </button>

          <div className="pt-4 mt-auto">
             {!isPremium && (
                <div 
                  onClick={() => setActiveTab('premium')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-3 text-black text-center cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20 mb-4"
                >
                    <div className="font-bold text-sm">Premium&apos;a Yükselt</div>
                    <div className="text-xs opacity-80">Tüm özelliklerin kilidini aç</div>
                </div>
            )}
            <div className="bg-gray-700/50 rounded-lg p-4 text-xs text-gray-400">
                <p>Piyasa verileri <strong>CoinPaprika API</strong> ile sağlanmaktadır.</p>
                <p className="mt-2">AI öngörüleri Google Gemini tarafından.</p>
            </div>
          </div>
        </nav>
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {activeTab === 'dashboard' ? 'Portföy Paneli' : 
               activeTab === 'market' ? 'Piyasa Genel Bakış' : 
               activeTab === 'chart' ? 'Pro Teknik Analiz' : 
               activeTab === 'alerts' ? 'Fiyat Alarmları' : 
               activeTab === 'premium' ? 'Premium Üyelik' :
               activeTab === 'about' ? 'Hakkımızda' :
               'Kripto Gündemi'}
            </h1>
            <p className="text-gray-400 mt-1">
              {activeTab === 'dashboard' ? `Varlıklarınızı takip edin. ${!isPremium ? `(Ücretsiz Plan: ${portfolio.length}/5)` : '(Premium Sınırsız)'}` : 
               activeTab === 'market' ? 'Anlık piyasa verileri ve detaylı istatistikler.' : 
               activeTab === 'chart' ? 'Binance canlı veri akışı ile detaylı mum grafiği.' :
               activeTab === 'alerts' ? 'Kritik fiyat seviyeleri için kişisel alarmlarınızı yönetin.' :
               activeTab === 'premium' ? 'Yatırım araçlarınızı bir üst seviyeye taşıyın.' :
               activeTab === 'about' ? 'Ekibimiz ve vizyonumuz hakkında bilgi edinin.' :
               'Piyasa verilerine göre yapay zeka tarafından derlenen güncel haberler.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></span>
                <span className="text-xs font-medium text-gray-300">{isLoading || isSearching ? 'Güncelleniyor...' : 'Canlı'}</span>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {!isPremium && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                   <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Ücretsiz Plan Kotası</span>
                      <span className="text-white font-bold">{portfolio.length} / 5 Varlık</span>
                   </div>
                   <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full transition-all duration-500 ${portfolio.length >= 5 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((portfolio.length / 5) * 100, 100)}%` }}></div>
                   </div>
                </div>
            )}
            <PortfolioSection 
              portfolio={portfolio} 
              marketData={coins} 
              onRemove={handleRemoveAsset}
              fearGreedData={fearGreedData}
            />
            <GeminiAdvisor portfolio={portfolio} marketData={coins} />
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
            isPremium={isPremium}
            onOpenPremium={() => setActiveTab('premium')}
          />
        )}

        {activeTab === 'blog' && (
          <BlogSection marketData={coins} />
        )}

        {activeTab === 'premium' && (
          <PremiumSection 
            isPremium={isPremium}
            onSubscribe={handleInitiateSubscribe}
          />
        )}

        {activeTab === 'about' && (
          <AboutSection />
        )}
      </main>
    </div>
  );
}
