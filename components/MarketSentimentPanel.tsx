import React from 'react';
import { MarketSentiment, FearGreedData } from '../types';

interface MarketSentimentPanelProps {
  sentiment: MarketSentiment | null;
  fearGreedData: FearGreedData | null;
}

const MarketSentimentPanel: React.FC<MarketSentimentPanelProps> = ({ sentiment, fearGreedData }) => {
  const getBullBearIcon = (type: 'bullish' | 'bearish' | 'neutral') => {
    if (type === 'bullish') {
      return (
        <div className="flex items-center gap-2">
          <svg className="w-12 h-12 text-green-500" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 8c-2 0-4 1-5 3l-6 10c-1 2-3 3-5 3H8c-2 0-3 1-3 3v4c0 2 1 3 3 3h8c2 0 4 1 5 3l2 4c1 2 1 4 0 6l-4 8c-1 2 0 4 2 5l4 2c2 1 4 0 5-2l6-10c1-2 3-3 5-3h4c2 0 4-1 5-3l6-10c1-2 0-4-2-5l-4-2c-2-1-4 0-5 2l-2 4c-1 2-3 3-5 3h-2c-2 0-4-1-5-3l-2-4c-1-2-1-4 0-6l2-4c1-2 0-4-2-5l-4-2c-1-1-2-1-3-1z"/>
            <circle cx="20" cy="24" r="3"/>
            <circle cx="44" cy="24" r="3"/>
            <path d="M24 38c2-2 6-3 8-3s6 1 8 3" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl font-bold text-green-600">BOGA</span>
        </div>
      );
    } else if (type === 'bearish') {
      return (
        <div className="flex items-center gap-2">
          <svg className="w-12 h-12 text-red-500" viewBox="0 0 64 64" fill="currentColor">
            <ellipse cx="32" cy="36" rx="20" ry="16"/>
            <circle cx="24" cy="32" r="3" fill="white"/>
            <circle cx="40" cy="32" r="3" fill="white"/>
            <circle cx="24" cy="32" r="1.5" fill="black"/>
            <circle cx="40" cy="32" r="1.5" fill="black"/>
            <ellipse cx="32" cy="42" rx="4" ry="2" fill="#8B4513"/>
            <path d="M12 28c-4-8-2-16 4-20s14-2 16 2" strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round"/>
            <path d="M52 28c4-8 2-16-4-20s-14-2-16 2" strokeWidth="3" stroke="currentColor" fill="none" strokeLinecap="round"/>
            <path d="M26 46c2 2 4 3 6 3s4-1 6-3" strokeWidth="2" stroke="white" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="text-2xl font-bold text-red-600">AYI</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-2xl">⚖️</span>
        </div>
        <span className="text-2xl font-bold text-gray-600">NOTR</span>
      </div>
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'reddit':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
        );
      case 'sentcrypt':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'feargreed':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getSentimentColor = (type: 'bullish' | 'bearish' | 'neutral') => {
    switch (type) {
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200';
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const defaultSentiment: MarketSentiment = {
    overall: 'neutral',
    score: 50,
    sources: {
      reddit: { sentiment: 'neutral', score: 50, mentions: 0 },
      sentcrypt: { sentiment: 'neutral', score: 50, confidence: 0 },
      fearGreed: { 
        sentiment: fearGreedData ? (parseInt(fearGreedData.value) > 50 ? 'bullish' : parseInt(fearGreedData.value) < 50 ? 'bearish' : 'neutral') : 'neutral',
        value: fearGreedData ? parseInt(fearGreedData.value) : 50,
        classification: fearGreedData?.value_classification || 'Neutral'
      }
    },
    lastUpdated: new Date().toISOString()
  };

  const data = sentiment || defaultSentiment;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          Piyasa Duyarlilik Analizi
        </h2>
        <p className="text-gray-500 text-sm mt-1">3 farkli kaynaktan toplanan verilerle piyasa yonu</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm text-gray-500 mb-2">Genel Piyasa Durumu</p>
            {getBullBearIcon(data.overall)}
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${data.overall === 'bullish' ? 'bg-green-500' : data.overall === 'bearish' ? 'bg-red-500' : 'bg-gray-400'}`}
                    style={{ width: `${data.score}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-gray-700">{data.score}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${getSentimentColor(data.sources.reddit.sentiment)}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-orange-500">{getSourceIcon('reddit')}</div>
              <div>
                <h3 className="font-bold text-gray-900">Reddit</h3>
                <p className="text-xs text-gray-500">r/cryptocurrency</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${data.sources.reddit.sentiment === 'bullish' ? 'text-green-600' : data.sources.reddit.sentiment === 'bearish' ? 'text-red-600' : 'text-gray-600'}`}>
                {data.sources.reddit.sentiment === 'bullish' ? 'Yukselis' : data.sources.reddit.sentiment === 'bearish' ? 'Dusus' : 'Notr'}
              </span>
              <span className="text-xs text-gray-500">{data.sources.reddit.mentions} bahsetme</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${data.sources.reddit.sentiment === 'bullish' ? 'bg-green-500' : data.sources.reddit.sentiment === 'bearish' ? 'bg-red-500' : 'bg-gray-400'}`}
                style={{ width: `${data.sources.reddit.score}%` }}
              ></div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${getSentimentColor(data.sources.sentcrypt.sentiment)}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-purple-500">{getSourceIcon('sentcrypt')}</div>
              <div>
                <h3 className="font-bold text-gray-900">Sentcrypt</h3>
                <p className="text-xs text-gray-500">AI Duygu Analizi</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${data.sources.sentcrypt.sentiment === 'bullish' ? 'text-green-600' : data.sources.sentcrypt.sentiment === 'bearish' ? 'text-red-600' : 'text-gray-600'}`}>
                {data.sources.sentcrypt.sentiment === 'bullish' ? 'Yukselis' : data.sources.sentcrypt.sentiment === 'bearish' ? 'Dusus' : 'Notr'}
              </span>
              <span className="text-xs text-gray-500">%{data.sources.sentcrypt.confidence} guven</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${data.sources.sentcrypt.sentiment === 'bullish' ? 'bg-green-500' : data.sources.sentcrypt.sentiment === 'bearish' ? 'bg-red-500' : 'bg-gray-400'}`}
                style={{ width: `${data.sources.sentcrypt.score}%` }}
              ></div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${getSentimentColor(data.sources.fearGreed.sentiment)}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-blue-500">{getSourceIcon('feargreed')}</div>
              <div>
                <h3 className="font-bold text-gray-900">Fear & Greed</h3>
                <p className="text-xs text-gray-500">Korku ve Acgozluluk</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${data.sources.fearGreed.sentiment === 'bullish' ? 'text-green-600' : data.sources.fearGreed.sentiment === 'bearish' ? 'text-red-600' : 'text-gray-600'}`}>
                {data.sources.fearGreed.classification}
              </span>
              <span className="text-xs text-gray-500">Deger: {data.sources.fearGreed.value}</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${data.sources.fearGreed.sentiment === 'bullish' ? 'bg-green-500' : data.sources.fearGreed.sentiment === 'bearish' ? 'bg-red-500' : 'bg-gray-400'}`}
                style={{ width: `${data.sources.fearGreed.value}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Son guncelleme: {new Date(data.lastUpdated).toLocaleString('tr-TR')}
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentPanel;
