import React from 'react';
import { CoinData, PortfolioItem, PriceAlert, User, FearGreedData, MarketSentiment } from '../types';
import MarketSentimentPanel from './MarketSentimentPanel';
import PortfolioSection from './PortfolioSection';
import GeminiAdvisor from './GeminiAdvisor';
import MarketTable from './MarketTable';
import TradingChart from './TradingChart';
import AlertsSection from './AlertsSection';
import BlogSection from './BlogSection';
import AboutSection from './AboutSection';

interface MainContentProps {
  activeTab: 'dashboard' | 'market' | 'blog' | 'chart' | 'alerts' | 'about';
  coins: CoinData[];
  portfolio: PortfolioItem[];
  alerts: PriceAlert[];
  isLoading: boolean;
  isSearching: boolean;
  user: User | null;
  fearGreedData: FearGreedData | null;
  marketSentiment: MarketSentiment | null;
  selectedChartCoin: { symbol: string; name: string } | null;
  onAddAsset: (coin: CoinData) => void;
  onViewChart: (coin: CoinData) => void;
  onRemoveAsset: (id: string) => void;
  onAddAlert: (coinId: string, targetPrice: number, condition: 'above' | 'below') => void;
  onRemoveAlert: (id: string) => void;
}

export default function MainContent({
  activeTab,
  coins,
  portfolio,
  alerts,
  isLoading,
  isSearching,
  user,
  fearGreedData,
  marketSentiment,
  selectedChartCoin,
  onAddAsset,
  onViewChart,
  onRemoveAsset,
  onAddAlert,
  onRemoveAlert
}: MainContentProps) {
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Portfoy Paneli';
      case 'market': return 'Piyasa Genel Bakis';
      case 'chart': return 'Pro Teknik Analiz';
      case 'alerts': return 'Fiyat Alarmlari';
      case 'about': return 'Hakkimizda';
      default: return 'Kripto Gundemi';
    }
  };

  const getDescription = () => {
    switch(activeTab) {
      case 'dashboard': return 'Varliklarinizi takip edin ve piyasa durumunu gorun.';
      case 'market': return 'Anlik piyasa verileri ve detayli istatistikler.';
      case 'chart': return 'Binance canli veri akisi ile detayli mum grafigi.';
      case 'alerts': return 'Kritik fiyat seviyeleri icin kisisel alarmlarinizi yonetin.';
      case 'about': return 'Misyonumuz ve vizyonumuz hakkinda bilgi edinin.';
      default: return 'Piyasa verilerine gore yapay zeka tarafindan derlenen guncel haberler.';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getTitle()}
        </h1>
        <p className="text-gray-500 mt-1">
          {getDescription()}
        </p>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <MarketSentimentPanel sentiment={marketSentiment} fearGreedData={fearGreedData} />
          <PortfolioSection 
            portfolio={portfolio} 
            marketData={coins} 
            onRemove={onRemoveAsset}
            fearGreedData={fearGreedData}
          />
          <GeminiAdvisor portfolio={portfolio} marketData={coins} user={user} />
        </div>
      )}
      
      {activeTab === 'market' && (
        <MarketTable 
          data={coins} 
          isLoading={isLoading} 
          onAddAsset={onAddAsset}
          onViewChart={onViewChart}
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
          onAddAlert={onAddAlert}
          onRemoveAlert={onRemoveAlert}
        />
      )}

      {activeTab === 'blog' && (
        <BlogSection marketData={coins} />
      )}

      {activeTab === 'about' && (
        <AboutSection />
      )}
    </main>
  );
}