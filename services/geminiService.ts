import { CoinData, PortfolioItem, GeminiInsight } from "../types";

export const analyzePortfolioWithGemini = async (
  portfolio: PortfolioItem[],
  marketData: CoinData[]
): Promise<GeminiInsight[]> => {
  if (!portfolio.length) {
    return [{
      title: "Portföy Boş",
      content: "AI öngörüleri oluşturmak için portföyünüze varlık ekleyin.",
      sentiment: "neutral",
      recommendation: "hold"
    }];
  }

  const portfolioSummary = portfolio.map(item => {
    const coin = marketData.find(c => c.id === item.coinId);
    if (!coin) return null;
    const value = item.amount * coin.current_price;
    return {
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      amount: item.amount,
      currentPrice: coin.current_price,
      value: value,
      performance24h: coin.price_change_percentage_24h
    };
  }).filter(Boolean);

  try {
    const response = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ portfolioSummary }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json() as GeminiInsight[];
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return [{
      title: "Analiz Başarısız",
      content: "Şu anda öngörü oluşturulamıyor. Lütfen API anahtarınızı veya bağlantınızı kontrol edin.",
      sentiment: "neutral",
      recommendation: "hold"
    }];
  }
};

export const chatWithAdvisor = async (
    message: string,
    history: { role: 'user' | 'model', parts: { text: string }[] }[],
    contextData: string
): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, history, contextData }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        return data.response || "Bir yanıt oluşturamadım.";
    } catch (error) {
        console.error("Chat failed", error);
        return "Üzgünüm, şu anda AI servisine bağlanmakta sorun yaşıyorum.";
    }
}
