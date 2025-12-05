import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const predictions: Map<string, { coinId: string; createdAt: string; expiresAt: string }> = new Map();

function getPredictionKey(userId: string, coinId: string): string {
  return `${userId}_${coinId}`;
}

function isCurrentMonth(dateStr: string): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, coinId, coinName, coinSymbol, currentPrice, priceChange24h, marketCap, volume } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Kullanici girisi gerekli' }, { status: 401 });
    }

    if (!coinId || !coinName) {
      return NextResponse.json({ error: 'Coin bilgisi gerekli' }, { status: 400 });
    }

    const predictionKey = getPredictionKey(userId, coinId);
    const existingPrediction = predictions.get(predictionKey);
    
    if (existingPrediction && isCurrentMonth(existingPrediction.createdAt)) {
      return NextResponse.json({ 
        error: `${coinName} icin bu ay zaten tahmin aldiniz. Sonraki ay tekrar deneyebilirsiniz.` 
      }, { status: 429 });
    }

    const prompt = `Sen bir kripto para analisti olarak gorev yapiyorsun. Asagidaki kripto para icin kisa vadeli (1 ay) analiz yap.

Kripto Para: ${coinName} (${coinSymbol?.toUpperCase()})
Guncel Fiyat: $${currentPrice}
24 Saatlik Degisim: %${priceChange24h?.toFixed(2)}
Piyasa Degeri: $${marketCap?.toLocaleString()}
24 Saatlik Islem Hacmi: $${volume?.toLocaleString()}

Lutfen su formatta JSON yaniti ver:
{
  "prediction": "bullish" | "bearish" | "neutral",
  "confidence": 0-100 arasi sayi,
  "analysis": "2-3 cumlelik Turkce analiz",
  "targetPrice": hedef fiyat (sayi),
  "timeframe": "1 Ay"
}

Sadece JSON formatinda yanit ver, baska hicbir sey ekleme.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt
    });

    const text = response.text || '';
    
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON parse edilemedi');
    }

    const predictionData = JSON.parse(jsonMatch[0]);

    const now = new Date();
    const expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    predictions.set(predictionKey, {
      coinId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    });

    const result = {
      coinId,
      coinName,
      coinSymbol: coinSymbol || '',
      prediction: predictionData.prediction || 'neutral',
      confidence: predictionData.confidence || 50,
      analysis: predictionData.analysis || 'Analiz yapilamadi.',
      targetPrice: predictionData.targetPrice || null,
      timeframe: predictionData.timeframe || '1 Ay',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Prediction API error:', error);
    return NextResponse.json({ error: 'Tahmin olusturulamadi' }, { status: 500 });
  }
}
