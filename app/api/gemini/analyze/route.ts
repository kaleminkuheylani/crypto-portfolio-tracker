import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function POST(request: NextRequest) {
  try {
    const { portfolioSummary } = await request.json();

    if (!portfolioSummary || portfolioSummary.length === 0) {
      return NextResponse.json([{
        title: "Portföy Boş",
        content: "AI öngörüleri oluşturmak için portföyünüze varlık ekleyin.",
        sentiment: "neutral",
        recommendation: "hold"
      }]);
    }

    const prompt = `
      Sen kıdemli bir kripto para finans danışmanısın. Aşağıdaki portföyü mevcut piyasa verilerine dayanarak analiz et.
      Portföy: ${JSON.stringify(portfolioSummary)}
      
      Bana 3 adet belirgin içgörü/tavsiye ver. Her içgörü için bir başlık, kısa detaylı bir analiz (içerik), bir duygu durumu (positive, negative, neutral) ve bir tavsiye (buy, sell, hold) sağla.
      Çeşitlendirme, risk yönetimi ve bu varlıkları etkileyen son piyasa trendlerine odaklan.
      
      ÖNEMLİ: Tüm metin yanıtlarını (title, content) TÜRKÇE olarak ver.
      Yanıtı kesinlikle JSON formatında döndür.
    `;

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
    if (!text) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return NextResponse.json([{
      title: "Analiz Başarısız",
      content: "Şu anda öngörü oluşturulamıyor. Lütfen API anahtarınızı veya bağlantınızı kontrol edin.",
      sentiment: "neutral",
      recommendation: "hold"
    }]);
  }
}
