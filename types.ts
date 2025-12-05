
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface PortfolioItem {
  id: string;
  coinId: string;
  amount: number;
  buyPrice: number; // Average buy price
  name?: string;    // Fallback display name
  symbol?: string;  // Fallback symbol
  image?: string;   // Fallback image URL
}

export interface PortfolioStats {
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
}

export interface GeminiInsight {
  title: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  recommendation: 'buy' | 'sell' | 'hold';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string; // SEO friendly URL part
  summary: string;
  metaDescription: string; // SEO meta description
  htmlContent: string; // HTML content for semantic rendering
  content: string; // Fallback plain text
  author: string;
  date: string; // ISO String format YYYY-MM-DD
  readTime: string;
  imageUrl: string;
  tags: string[];
  keywords: string[]; // SEO keywords
  category: 'tahmin' | 'analiz' | 'haber';
}

export interface CandleData {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface PriceAlert {
  id: string;
  coinId: string;
  coinSymbol: string;
  coinImage: string;
  targetPrice: number;
  condition: 'above' | 'below'; // Fiyat yukarısına çıkarsa veya aşağısına düşerse
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'email';
  createdAt: string;
}

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export interface MarketSentiment {
  overall: 'bullish' | 'bearish' | 'neutral';
  score: number;
  sources: {
    reddit: {
      sentiment: 'bullish' | 'bearish' | 'neutral';
      score: number;
      mentions: number;
    };
    sentcrypt: {
      sentiment: 'bullish' | 'bearish' | 'neutral';
      score: number;
      confidence: number;
    };
    fearGreed: {
      sentiment: 'bullish' | 'bearish' | 'neutral';
      value: number;
      classification: string;
    };
  };
  lastUpdated: string;
}

export interface PredictionData {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  prediction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  analysis: string;
  targetPrice?: number;
  timeframe: string;
  createdAt: string;
  expiresAt: string;
}
