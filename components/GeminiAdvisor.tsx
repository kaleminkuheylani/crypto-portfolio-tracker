import React, { useState } from 'react';
import { GeminiInsight, PortfolioItem, CoinData } from '../types';
// import { analyzePortfolioWithGemini } from '../services/geminiService';

interface GeminiAdvisorProps {
  portfolio: PortfolioItem[];
  marketData: CoinData[];
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ portfolio, marketData }) => {
  // State for future use when feature is re-enabled
  const [insights, setInsights] = useState<GeminiInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  /* Feature temporarily disabled
  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const results = await analyzePortfolioWithGemini(portfolio, marketData);
      setInsights(results);
      setHasAnalyzed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  */

  // Helper to translate sentiment to Turkish for display
  const getSentimentText = (s: string) => {
    switch(s) {
      case 'positive': return 'Olumlu';
      case 'negative': return 'Olumsuz';
      case 'neutral': return 'Nötr';
      default: return s;
    }
  }

  // Helper to translate recommendation to Turkish for display
  const getRecommendationText = (r: string) => {
    switch(r) {
      case 'buy': return 'Al';
      case 'sell': return 'Sat';
      case 'hold': return 'Tut';
      default: return r;
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-xl border border-indigo-700/50 mb-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Gemini AI Danışmanı
            </h2>
            <p className="text-indigo-200 mt-1">Portföy dağılımınız ve risk durumu hakkında akıllı öngörüler alın.</p>
          </div>
          <button
            disabled={true}
            className="px-6 py-2 rounded-lg font-semibold shadow-lg bg-white/10 text-gray-400 cursor-not-allowed border border-white/5 backdrop-blur-sm"
          >
            Çok Yakında
          </button>
        </div>

        {hasAnalyzed && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:bg-white/20 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    insight.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                    insight.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {getSentimentText(insight.sentiment)}
                  </span>
                  <span className={`text-xs font-bold uppercase ${
                    insight.recommendation === 'buy' ? 'text-green-300' :
                    insight.recommendation === 'sell' ? 'text-red-300' :
                    'text-yellow-300'
                  }`}>
                    {getRecommendationText(insight.recommendation)}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{insight.title}</h3>
                <p className="text-sm text-indigo-100 leading-relaxed opacity-90">
                  {insight.content}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {!hasAnalyzed && !isLoading && (
            <div className="text-center py-8 text-indigo-300 border-2 border-dashed border-indigo-500/30 rounded-lg bg-indigo-900/20">
                <p className="text-lg font-medium mb-1">AI Danışmanı Hazırlanıyor</p>
                <p className="text-sm opacity-70">Yapay zeka modellerimiz daha iyi analizler sunmak için eğitiliyor. Bu özellik çok yakında aktif olacak.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default GeminiAdvisor;