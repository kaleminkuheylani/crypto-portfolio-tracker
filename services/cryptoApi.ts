import { CoinData, FearGreedData, MarketSentiment } from '../types';

const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side
    return '';
  }
  // Server-side: use absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL || process.env.NETLIFY_HOST || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${baseUrl}`;
};

export const getTopCoins = async (): Promise<CoinData[]> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/crypto?action=tickers`);

    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch crypto data:", error);
    return [];
  }
};

export const searchCoins = async (query: string): Promise<CoinData[]> => {
  if (!query || query.length < 2) return [];

  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/crypto?action=search&q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Search failed');
    }

    return await response.json();
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

export const getFearAndGreedIndex = async (): Promise<FearGreedData | null> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/crypto?action=feargreed`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Fear & Greed index');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Fear & Greed index:", error);
    return null;
  }
};

export const getMarketSentiment = async (): Promise<MarketSentiment | null> => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/crypto?action=sentiment`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch market sentiment');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch market sentiment:", error);
    return null;
  }
};
