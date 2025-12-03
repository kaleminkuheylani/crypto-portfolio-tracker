import { BlogPost, CoinData } from "../types";

const STORAGE_KEY = 'kriptopusula_blog_db';

const IMAGE_POOL = [
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622630998477-20aa696fab05?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop"
];

const getStoredPosts = (): BlogPost[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const savePosts = (posts: BlogPost[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

const getDailyPostType = (): 'tahmin' | 'analiz' | 'haber' => {
    const day = new Date().getDay();
    if (day === 6) return 'analiz';
    if (day === 0) return 'haber';
    return 'tahmin';
};

const generateSinglePost = async (
    marketData: CoinData[], 
    category: 'tahmin' | 'analiz' | 'haber',
    overrideTitle?: string
): Promise<BlogPost | null> => {
    try {
        const response = await fetch('/api/blog/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ marketData, category, overrideTitle }),
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json() as BlogPost;
    } catch (error) {
        console.error("Yazı üretilemedi:", error);
        return null;
    }
};

const seedInitialPosts = async (marketData: CoinData[]): Promise<BlogPost[]> => {
    const posts: BlogPost[] = [];
    const seedPost = await generateSinglePost(marketData, 'analiz', "KriptoPusula'ya Hoşgeldiniz: Piyasa Genel Bakış");
    if (seedPost) {
        seedPost.date = getTodayDateString();
        posts.push(seedPost);
    }
    return posts;
};

const generateDailyPost = async (marketData: CoinData[]): Promise<BlogPost | null> => {
    const type = getDailyPostType();
    return await generateSinglePost(marketData, type);
};

export const initializeBlogSystem = async (marketData: CoinData[]): Promise<BlogPost[]> => {
    let posts = getStoredPosts();

    if (posts.length === 0 && marketData.length > 0) {
        posts = await seedInitialPosts(marketData);
        savePosts(posts);
    }

    const today = getTodayDateString();
    const hasPostForToday = posts.some(p => p.date === today);
    const currentHour = new Date().getHours();
    
    if (!hasPostForToday && currentHour >= 12 && marketData.length > 0) {
        console.log("Saat 12:00'yi geçti, günlük yazı oluşturuluyor...");
        const newPost = await generateDailyPost(marketData);
        if (newPost) {
            posts = [newPost, ...posts];
            savePosts(posts);
        }
    }

    return posts;
};
