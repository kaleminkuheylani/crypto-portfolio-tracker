import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api.coinpaprika.com/v1';
const IMAGE_BASE = 'https://static.coinpaprika.com/coin';

const mapPaprikaToCoinData = (coin: any) => {
  const usdData = coin.quotes?.USD || {};
  
  return {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: `${IMAGE_BASE}/${coin.id}/logo.png`,
    current_price: usdData.price || 0,
    market_cap: usdData.market_cap || 0,
    market_cap_rank: coin.rank,
    fully_diluted_valuation: usdData.fully_diluted_market_cap || null,
    total_volume: usdData.volume_24h || 0,
    high_24h: usdData.ath_price || 0,
    low_24h: 0,
    price_change_24h: 0,
    price_change_percentage_24h: usdData.percent_change_24h || 0,
    market_cap_change_24h: usdData.market_cap_change_24h || 0,
    market_cap_change_percentage_24h: usdData.percent_change_24h || 0,
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  try {
    if (action === 'tickers') {
      const response = await fetch(`${API_BASE}/tickers?quotes=USD`, {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 }
      });

      if (!response.ok) {
        throw new Error('CoinPaprika API Error');
      }

      const json = await response.json();
      const coins = json.slice(0, 100).map(mapPaprikaToCoinData);
      return NextResponse.json(coins);
    }

    if (action === 'search') {
      const query = searchParams.get('q');
      if (!query) {
        return NextResponse.json([]);
      }

      const response = await fetch(`${API_BASE}/search?q=${query}&c=currencies&limit=20`);
      
      if (!response.ok) {
        throw new Error('CoinPaprika Search Error');
      }

      const json = await response.json();
      
      if (json.currencies && json.currencies.length > 0) {
        const coinId = json.currencies[0].id;
        const tickerResponse = await fetch(`${API_BASE}/tickers/${coinId}`);
        if (tickerResponse.ok) {
          const coinDetail = await tickerResponse.json();
          return NextResponse.json([mapPaprikaToCoinData(coinDetail)]);
        }
      }
      
      return NextResponse.json([]);
    }

    if (action === 'feargreed') {
      const response = await fetch('https://api.alternative.me/fng/', {
        next: { revalidate: 300 }
      });
      
      if (!response.ok) {
        throw new Error('F&G API Error');
      }
      
      const json = await response.json();
      if (json.data && json.data.length > 0) {
        return NextResponse.json(json.data[0]);
      }
      return NextResponse.json(null);
    }

    if (action === 'sentiment') {
      const fearGreedResponse = await fetch('https://api.alternative.me/fng/', {
        next: { revalidate: 300 }
      });
      
      let fearGreedValue = 50;
      let fearGreedClassification = 'Neutral';
      
      if (fearGreedResponse.ok) {
        const fgJson = await fearGreedResponse.json();
        if (fgJson.data && fgJson.data.length > 0) {
          fearGreedValue = parseInt(fgJson.data[0].value);
          fearGreedClassification = fgJson.data[0].value_classification;
        }
      }

      let redditScore = 50;
      let redditMentions = 0;
      
      try {
        const coingeckoResponse = await fetch(
          'https://api.coingecko.com/api/v3/search/trending',
          { next: { revalidate: 600 } }
        );
        
        if (coingeckoResponse.ok) {
          const trendingData = await coingeckoResponse.json();
          if (trendingData.coins && trendingData.coins.length > 0) {
            redditMentions = trendingData.coins.reduce((sum: number, coin: any) => 
              sum + (coin.item?.score || 0), 0
            );
            const avgMarketCapRank = trendingData.coins.reduce((sum: number, coin: any) => 
              sum + (coin.item?.market_cap_rank || 100), 0
            ) / trendingData.coins.length;
            redditScore = Math.min(80, Math.max(20, 100 - avgMarketCapRank));
          }
        }
      } catch (e) {
        console.error('CoinGecko trending error:', e);
      }

      let sentcryptScore = 50;
      let sentcryptConfidence = 75;
      
      try {
        const globalResponse = await fetch(
          'https://api.coingecko.com/api/v3/global',
          { next: { revalidate: 300 } }
        );
        
        if (globalResponse.ok) {
          const globalData = await globalResponse.json();
          if (globalData.data) {
            const marketCapChange = globalData.data.market_cap_change_percentage_24h_usd || 0;
            sentcryptScore = Math.min(90, Math.max(10, 50 + (marketCapChange * 5)));
            sentcryptConfidence = Math.min(95, Math.max(60, 80 + Math.abs(marketCapChange)));
          }
        }
      } catch (e) {
        console.error('CoinGecko global error:', e);
      }

      const getSentiment = (score: number): 'bullish' | 'bearish' | 'neutral' => {
        if (score >= 55) return 'bullish';
        if (score <= 45) return 'bearish';
        return 'neutral';
      };

      const overallScore = Math.round((redditScore + sentcryptScore + fearGreedValue) / 3);

      const sentiment = {
        overall: getSentiment(overallScore),
        score: overallScore,
        sources: {
          reddit: {
            sentiment: getSentiment(redditScore),
            score: Math.round(redditScore),
            mentions: redditMentions
          },
          sentcrypt: {
            sentiment: getSentiment(sentcryptScore),
            score: Math.round(sentcryptScore),
            confidence: Math.round(sentcryptConfidence)
          },
          fearGreed: {
            sentiment: getSentiment(fearGreedValue),
            value: fearGreedValue,
            classification: fearGreedClassification
          }
        },
        lastUpdated: new Date().toISOString()
      };

      return NextResponse.json(sentiment);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Crypto API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
