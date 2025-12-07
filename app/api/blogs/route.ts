import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { Blog } from '../../../models/Blog';
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622630998477-20aa696fab05?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop"
];

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getDailyPostType = (): 'tahmin' | 'analiz' | 'haber' => {
  const day = new Date().getDay();
  if (day === 6) return 'analiz';
  if (day === 0) return 'haber';
  return 'tahmin';
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    if (slug) {
      const blog = await Blog.findOne({ slug, isPublished: true });
      if (!blog) {
        return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 });
      }
      await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
      return NextResponse.json(blog);
    }

    const query: any = { isPublished: true };
    if (category) {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .select('-htmlContent -content');

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Blogs GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { action } = body;

    if (action === 'generate') {
      const { marketData, category, overrideTitle } = body;
      const postCategory = category || getDailyPostType();
      const today = getTodayDateString();

      const existingPost = await Blog.findOne({ date: today, category: postCategory });
      if (existingPost) {
        return NextResponse.json(existingPost);
      }

      const topMovers = marketData
        .sort((a: any, b: any) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
        .slice(0, 5)
        .map((c: any) => `${c.name} (${c.price_change_percentage_24h.toFixed(2)}%)`)
        .join(', ');

      let systemPrompt = "";
      if (postCategory === 'tahmin') {
        systemPrompt = `Sen bir SEO uzmanı ve kıdemli kripto analistisin. GÜNLÜK FİYAT TAHMİNİ makalesi yaz.
          Odak: Önümüzdeki 24-48 saat içinde yükseliş veya düşüş beklediğin 2 coini seç.
          Yapı: Başlık H1, Alt başlıklar H2 kullan. Paragraflar kısa ve okunaklı olsun.
          Ton: Profesyonel ama spekülatif (Yatırım tavsiyesi değildir uyarısı ekle).`;
      } else if (postCategory === 'analiz') {
        systemPrompt = `Sen bir SEO uzmanı ve kripto araştırmacısısın. Haftalık detaylı TEKNİK ANALİZ makalesi yaz.
          Odak: Piyasayı domine eden ana trendi (Bitcoin dominansı, Makro ekonomi) incele.
          Yapı: Semantik HTML etiketleri kullan (h2, p, ul, li).
          Ton: Akademik ve eğitici.`;
      } else {
        systemPrompt = `Sen bir kripto haber editörüsün. Haftalık özet ve GENEL HABER makalesi yaz.
          Odak: Hafta sonu hareketleri ve gelecek haftanın takvimi.
          Yapı: Madde işaretleri ve net başlıklar.`;
      }

      const prompt = `
        ${systemPrompt}
        
        Piyasa Verileri: ${topMovers}
        Tarih: ${today}
        ${overrideTitle ? `Konu Başlığı: ${overrideTitle}` : ''}

        ÇOK ÖNEMLİ: 
        1. Çıktıyı SADECE geçerli bir JSON objesi olarak ver. 
        2. "htmlContent" alanı HTML formatında (h2, p, ul, li, strong etiketleri ile) olmalı.
        3. "content" alanı düz metin olmalı.
        4. "slug" alanı URL dostu olmalı (örn: kripto-piyasa-analizi-2024).
        5. "metaDescription" alanı 160 karakteri geçmemeli.

        JSON Şeması:
        {
             "title": "String (Başlık)",
             "slug": "String (kebab-case)",
             "metaDescription": "String (SEO açıklaması)",
             "summary": "String (Kısa özet)",
             "htmlContent": "String (HTML etiketli içerik)",
             "content": "String (Düz metin)",
             "author": "KriptoSavasi AI",
             "readTime": "String (örn: 5 dk)",
             "tags": ["String", "String"],
             "keywords": ["String", "String"]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              slug: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              summary: { type: Type.STRING },
              htmlContent: { type: Type.STRING },
              content: { type: Type.STRING },
              author: { type: Type.STRING },
              readTime: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      const text = response.text;
      if (!text) {
        return NextResponse.json({ error: 'AI yanıt vermedi' }, { status: 500 });
      }

      const data = JSON.parse(text);
      const slugBase = data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
      const uniqueSlug = `${slugBase}-${today}`;

      const blog = await Blog.create({
        title: data.title,
        slug: uniqueSlug,
        metaDescription: data.metaDescription || data.summary,
        summary: data.summary,
        htmlContent: data.htmlContent || `<p>${data.content}</p>`,
        content: data.content,
        author: data.author || 'KriptoSavasi AI',
        date: today,
        readTime: data.readTime,
        imageUrl: IMAGE_POOL[Math.floor(Math.random() * IMAGE_POOL.length)],
        tags: data.tags || [],
        keywords: data.keywords || [],
        category: postCategory,
      });

      return NextResponse.json(blog);
    }

    if (action === 'check-today') {
      const today = getTodayDateString();
      const category = getDailyPostType();
      const existingPost = await Blog.findOne({ date: today, category });
      return NextResponse.json({ exists: !!existingPost, post: existingPost });
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Blogs POST error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID gerekli' }, { status: 400 });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog başarıyla silindi' });
  } catch (error) {
    console.error('Blogs DELETE error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
