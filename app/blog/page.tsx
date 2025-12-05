'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopCoins } from '../../services/cryptoApi';
import { CoinData, BlogPost } from '../../types';
import { initializeBlogSystem } from '../../services/blogService';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [marketData, setMarketData] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchData = async () => {
      setIsLoading(true);
      const coins = await getTopCoins();
      setMarketData(coins);
      
      if (coins.length > 0) {
        const currentPosts = await initializeBlogSystem(coins);
        setPosts(currentPosts);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    if (selectedPost) {
      document.title = `${selectedPost.title} | KriptoPusula Blog`;
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', selectedPost.metaDescription);
    } else {
      document.title = "Blog & Haberler | KriptoPusula";
      let metaDesc = document.querySelector("meta[name='description']");
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Yapay zeka tarafından hazırlanan günlük kripto tahminleri, teknik analizler ve piyasa haberleri.');
      }
    }
  }, [selectedPost, isMounted]);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'tahmin': return 'bg-yellow-600/90 text-yellow-100';
      case 'analiz': return 'bg-purple-600/90 text-purple-100';
      case 'haber': return 'bg-blue-600/90 text-blue-100';
      default: return 'bg-gray-600/90 text-gray-100';
    }
  };

  const renderSchema = (post: BlogPost) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": post.imageUrl,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.date,
      "description": post.metaDescription,
      "articleBody": post.content
    };
    return JSON.stringify(schema);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-500 hover:text-blue-400 transition-colors">
            <img src="/logo.png" alt="KriptoPusula Logo" className="w-10 h-10 object-contain" />
            KriptoPusula
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              Ana Sayfa
            </Link>
            <span className="text-blue-400 font-medium text-sm">Blog</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Kripto Gündemi</h1>
          <p className="text-gray-400 text-lg">
            Yapay zeka tarafından hazırlanan günlük kripto tahminleri, teknik analizler ve piyasa haberleri.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-gray-400">Pazartesi-Cuma: Tahminler</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-gray-400">Cumartesi: Analiz</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-gray-400">Pazar: Haberler</span>
            </span>
          </div>
        </div>

        {isLoading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Günlük veriler kontrol ediliyor ve içerik hazırlanıyor...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
            Henüz blog yazısı bulunmuyor. Piyasa verileri bekleniyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`${getCategoryColor(post.category)} text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm uppercase`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <header>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <time dateTime={post.date} className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {post.date}
                      </time>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>{post.readTime} okuma</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </header>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {post.summary}
                  </p>
                  <footer className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
                    <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white">
                        AI
                      </div>
                      {post.author}
                    </span>
                    <span className="text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Devamını Oku
                    </span>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          <p>KriptoPusula - Yapay Zeka Destekli Kripto Takibi</p>
          <p className="mt-2 text-xs">Bu içerikler yapay zeka tarafından oluşturulmuştur ve yatırım tavsiyesi niteliği taşımaz.</p>
        </div>
      </footer>

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
          <div 
            className="bg-gray-900 w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-y-auto border border-gray-700 shadow-2xl relative animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: renderSchema(selectedPost) }}
            />

            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-gray-800 text-gray-400 hover:text-white p-2 rounded-full z-10 hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div className="h-64 relative">
              <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
              <div className="absolute bottom-4 left-8">
                <span className={`${getCategoryColor(selectedPost.category)} text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm uppercase mb-2 inline-block`}>
                  {selectedPost.category}
                </span>
              </div>
            </div>
            
            <article className="p-8 -mt-6 relative">
              <div className="flex gap-2 mb-6 flex-wrap">
                {selectedPost.tags?.map(tag => (
                  <span key={tag} className="bg-gray-800 border border-gray-600 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{selectedPost.title}</h1>
              
              <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    AI
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedPost.author}</div>
                    <div className="text-gray-400 text-xs">Yapay Zeka Editörü</div>
                  </div>
                </div>
                <div className="text-right text-gray-400 text-sm">
                  <time dateTime={selectedPost.date} className="font-medium text-gray-300">{selectedPost.date}</time>
                  <div>{selectedPost.readTime}</div>
                </div>
              </div>

              <div 
                className="prose prose-invert prose-lg max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ 
                  __html: selectedPost.htmlContent || selectedPost.content.split('\n').map(p => `<p>${p}</p>`).join('') 
                }}
              />

              <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center italic">
                Bu içerik yapay zeka tarafından oluşturulmuştur ve yatırım tavsiyesi niteliği taşımaz.
              </div>
            </article>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
