import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function POST(request: NextRequest) {
  try {
    const { message, history, contextData } = await request.json();

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
    return NextResponse.json({ response: result.text || "Bir yanıt oluşturamadım." });
  } catch (error) {
    console.error("Chat failed", error);
    return NextResponse.json({ response: "Üzgünüm, şu anda AI servisine bağlanmakta sorun yaşıyorum." });
  }
}
