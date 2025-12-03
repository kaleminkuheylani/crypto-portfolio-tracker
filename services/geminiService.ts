import { GoogleGenAI, Type } from "@google/genai";
import { CoinData, PortfolioItem, GeminiInsight } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

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

  // Construct a summary of the portfolio for the AI
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

  const prompt = `
    Sen kıdemli bir kripto para finans danışmanısın. Aşağıdaki portföyü mevcut piyasa verilerine dayanarak analiz et.
    Portföy: ${JSON.stringify(portfolioSummary)}
    
    Bana 3 adet belirgin içgörü/tavsiye ver. Her içgörü için bir başlık, kısa detaylı bir analiz (içerik), bir duygu durumu (positive, negative, neutral) ve bir tavsiye (buy, sell, hold) sağla.
    Çeşitlendirme, risk yönetimi ve bu varlıkları etkileyen son piyasa trendlerine odaklan.
    
    ÖNEMLİ: Tüm metin yanıtlarını (title, content) TÜRKÇE olarak ver.
    Yanıtı kesinlikle JSON formatında döndür.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['positive', 'negative', 'neutral'] },
              recommendation: { type: Type.STRING, enum: ['buy', 'sell', 'hold'] }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as GeminiInsight[];
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
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: [
                {
                    role: 'user',
                    parts: [{ text: `Sistem Bağlamı: Sen bir kripto uzmanısın. Şu piyasa bağlamını kullan: ${contextData}. Türkçe cevap ver.` }]
                },
                {
                    role: 'model',
                    parts: [{ text: "Anlaşıldı. Kripto piyasası ve portföyünüz hakkındaki soruları Türkçe olarak yanıtlamaya hazırım." }]
                },
                ...history
            ]
        });

        const result = await chat.sendMessage({ message });
        return result.text || "Bir yanıt oluşturamadım.";
    } catch (error) {
        console.error("Chat failed", error);
        return "Üzgünüm, şu anda AI servisine bağlanmakta sorun yaşıyorum.";
    }
}