
import { GoogleGenAI, Type } from "@google/genai";
import { BlogPost, CoinData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const STORAGE_KEY = 'kriptopusula_blog_db';

// Görseller havuzu
const IMAGE_POOL = [
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622630998477-20aa696fab05?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop"
];

// Helper: DB'den yazıları çek
const getStoredPosts = (): BlogPost[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Helper: DB'ye kaydet
const savePosts = (posts: BlogPost[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

// Helper: Bugünün tarihini YYYY-MM-DD formatında al
const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

// Helper: Günün içeriğini belirle (Pzt-Cum: Tahmin, Cmt: Analiz, Paz: Haber)
const getDailyPostType = (): 'tahmin' | 'analiz' | 'haber' => {
    const day = new Date().getDay(); // 0: Pazar, 1: Pzt, ... 6: Cmt
    if (day === 6) return 'analiz';
    if (day === 0) return 'haber';
    return 'tahmin';
};

// Ana Fonksiyon: Sistemi başlat ve kontrol et
export const initializeBlogSystem = async (marketData: CoinData[]): Promise<BlogPost[]> => {
    let posts = getStoredPosts();

    // Eğer hiç veri yoksa (ilk açılış), geçmiş 3 gün için sahte veri üret (Seed)
    if (posts.length === 0 && marketData.length > 0) {
        posts = await seedInitialPosts(marketData);
        savePosts(posts);
    }

    // Bugünün yazısı var mı ve saat 12:00 oldu mu kontrolü
    const today = getTodayDateString();
    const hasPostForToday = posts.some(p => p.date === today);
    const currentHour = new Date().getHours();
    
    // Kural: Her gün saat 12:00'den sonra yeni yazı ekle
    if (!hasPostForToday && currentHour >= 12 && marketData.length > 0) {
        console.log("Saat 12:00'yi geçti, günlük yazı oluşturuluyor...");
        const newPost = await generateDailyPost(marketData);
        if (newPost) {
            // Yeni yazıyı en başa ekle
            posts = [newPost, ...posts];
            savePosts(posts);
        }
    }

    return posts;
};

// İlk kullanıcılar için başlangıç verisi oluştur
const seedInitialPosts = async (marketData: CoinData[]): Promise<BlogPost[]> => {
    const posts: BlogPost[] = [];
    const seedPost = await generateSinglePost(marketData, 'analiz', "KriptoPusula'ya Hoşgeldiniz: Piyasa Genel Bakış");
    if (seedPost) {
        seedPost.date = getTodayDateString(); // Bugünün tarihiyle başlat
        posts.push(seedPost);
    }
    return posts;
};

// Günlük zamanlanmış yazı oluşturucu
const generateDailyPost = async (marketData: CoinData[]): Promise<BlogPost | null> => {
    const type = getDailyPostType();
    return await generateSinglePost(marketData, type);
};

// Gemini ile tekil yazı üretme motoru
const generateSinglePost = async (
    marketData: CoinData[], 
    category: 'tahmin' | 'analiz' | 'haber',
    overrideTitle?: string
): Promise<BlogPost | null> => {
    
    const topMovers = marketData
        .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
        .slice(0, 5)
        .map(c => `${c.name} (${c.price_change_percentage_24h.toFixed(2)}%)`)
        .join(', ');

    let systemPrompt = "";
    
    if (category === 'tahmin') {
        systemPrompt = `
            Sen bir SEO uzmanı ve kıdemli kripto analistisin. GÜNLÜK FİYAT TAHMİNİ makalesi yaz.
            Odak: Önümüzdeki 24-48 saat içinde yükseliş veya düşüş beklediğin 2 coini seç.
            Yapı: Başlık H1, Alt başlıklar H2 kullan. Paragraflar kısa ve okunaklı olsun.
            Ton: Profesyonel ama spekülatif (Yatırım tavsiyesi değildir uyarısı ekle).
        `;
    } else if (category === 'analiz') {
        systemPrompt = `
            Sen bir SEO uzmanı ve kripto araştırmacısısın. Haftalık detaylı TEKNİK ANALİZ makalesi yaz.
            Odak: Piyasayı domine eden ana trendi (Bitcoin dominansı, Makro ekonomi) incele.
            Yapı: Semantik HTML etiketleri kullan (h2, p, ul, li).
            Ton: Akademik ve eğitici.
        `;
    } else {
        systemPrompt = `
            Sen bir kripto haber editörüsün. Haftalık özet ve GENEL HABER makalesi yaz.
            Odak: Hafta sonu hareketleri ve gelecek haftanın takvimi.
            Yapı: Madde işaretleri ve net başlıklar.
        `;
    }

    const prompt = `
        ${systemPrompt}
        
        Piyasa Verileri: ${topMovers}
        Tarih: ${getTodayDateString()}
        ${overrideTitle ? `Konu Başlığı: ${overrideTitle}` : ''}

        ÇOK ÖNEMLİ: 
        1. Çıktıyı SADECE geçerli bir JSON objesi olarak ver. 
        2. "htmlContent" alanı HTML formatında (h2, p, ul, li, strong etiketleri ile) olmalı, ancak ASLA tırnak işaretlerini (") escape etmeyi unutma (\").
        3. "content" alanı düz metin olmalı.
        4. "slug" alanı URL dostu olmalı (örn: kripto-piyasa-analizi-2024).
        5. "metaDescription" alanı 160 karakteri geçmemeli.

        JSON Şeması:
        {
             "title": "String (Başlık)",
             "slug": "String (kebab-case)",
             "metaDescription": "String (SEO açıklaması)",
             "summary": "String (Kısa özet)",
             "htmlContent": "String (HTML etiketli içerik, tırnaklara dikkat et)",
             "content": "String (Düz metin)",
             "author": "KriptoPusula AI",
             "readTime": "String (örn: 5 dk)",
             "tags": ["String", "String"],
             "keywords": ["String", "String"]
        }
    `;

    try {
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
        if (!text) return null;
        
        const data = JSON.parse(text);
        
        return {
            id: crypto.randomUUID(),
            title: data.title,
            slug: data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
            metaDescription: data.metaDescription || data.summary,
            summary: data.summary,
            htmlContent: data.htmlContent || `<p>${data.content}</p>`,
            content: data.content,
            author: data.author,
            date: getTodayDateString(),
            readTime: data.readTime,
            imageUrl: IMAGE_POOL[Math.floor(Math.random() * IMAGE_POOL.length)],
            tags: data.tags || [],
            keywords: data.keywords || [],
            category: category
        };

    } catch (error) {
        console.error("Yazı üretilemedi:", error);
        return null;
    }
};
