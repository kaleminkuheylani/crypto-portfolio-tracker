
import { CoinData, FearGreedData } from '../types';

const API_BASE = 'https://api.coinpaprika.com/v1';
const IMAGE_BASE = 'https://static.coinpaprika.com/coin';
// CORS Proxy - Daha kararlı olan corsproxy.io servisi
const PROXY_URL = 'https://corsproxy.io/?';

// CoinPaprika verisini uygulamamızın tipine dönüştür
const mapPaprikaToCoinData = (coin: any): CoinData => {
  const usdData = coin.quotes?.USD || {};
  
  return {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    // Paprika ID'si (örn: btc-bitcoin) üzerinden görsel çekiyoruz
    image: `${IMAGE_BASE}/${coin.id}/logo.png`,
    current_price: usdData.price || 0,
    market_cap: usdData.market_cap || 0,
    market_cap_rank: coin.rank,
    fully_diluted_valuation: usdData.fully_diluted_market_cap || null,
    total_volume: usdData.volume_24h || 0,
    high_24h: usdData.ath_price || 0, // 24h high yerine ATH veriyor, UI'da ATH olarak kullanabiliriz
    low_24h: 0,
    price_change_24h: 0,
    price_change_percentage_24h: usdData.percent_change_24h || 0,
    market_cap_change_24h: usdData.market_cap_change_24h || 0,
    market_cap_change_percentage_24h: usdData.percent_change_24h || 0, // Market cap değişimi yoksa fiyat değişimini kullan
    circulating_supply: coin.circulating_supply || 0,
    total_supply: coin.total_supply || 0,
    max_supply: coin.max_supply || 0,
    ath: usdData.ath_price || 0,
    ath_change_percentage: usdData.percent_from_price_ath || 0,
    ath_date: usdData.ath_date || '',
    atl: 0,
    atl_change_percentage: 0,
    atl_date: '',
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: [] }
  };
};

export const getTopCoins = async (): Promise<CoinData[]> => {
  try {
    // CoinPaprika tickers endpoint'i
    // Cache-busting için t parametresini proxy URL'inin sonuna ekliyoruz
    const targetUrl = `${API_BASE}/tickers?quotes=USD`;
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}&t=${Date.now()}`);

    if (!response.ok) {
      throw new Error('CoinPaprika API Error');
    }

    const json = await response.json();
    
    // İlk 100 coini al ve formatla
    return json
      .slice(0, 100)
      .map(mapPaprikaToCoinData);

  } catch (error) {
    console.error("Failed to fetch crypto data from CoinPaprika:", error);
    return [];
  }
};

export const searchCoins = async (query: string): Promise<CoinData[]> => {
    if (!query || query.length < 2) return [];

    try {
        // Arama endpointi: /search?q=...&c=currencies
        const targetUrl = `${API_BASE}/search?q=${query}&c=currencies&limit=20`;
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}&t=${Date.now()}`);
        
        if (!response.ok) {
            throw new Error('CoinPaprika Search Error');
        }

        const json = await response.json();
        
        if (json.currencies && json.currencies.length > 0) {
            const coinId = json.currencies[0].id; // En iyi eşleşmeyi al
            const tickerUrl = `${API_BASE}/tickers/${coinId}`;
            const tickerResponse = await fetch(`${PROXY_URL}${encodeURIComponent(tickerUrl)}`);
            if (tickerResponse.ok) {
                const coinDetail = await tickerResponse.json();
                return [mapPaprikaToCoinData(coinDetail)];
            }
        }
        
        return [];
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}

export const getFearAndGreedIndex = async (): Promise<FearGreedData | null> => {
    try {
        // Alternative.me API
        const targetUrl = 'https://api.alternative.me/fng/';
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
        
        if (!response.ok) throw new Error("F&G API Error");
        
        const json = await response.json();
        if (json.data && json.data.length > 0) {
            return json.data[0];
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch Fear & Greed index:", error);
        return null;
    }
};
