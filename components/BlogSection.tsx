import React, { useState, useEffect } from 'react';
import { BlogPost, CoinData } from '../types';
import { initializeBlogSystem } from '../services/blogService';

interface BlogSectionProps {
  marketData: CoinData[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ marketData }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      if (marketData.length > 0) {
        setIsLoading(true);
        const currentPosts = await initializeBlogSystem(marketData);
        setPosts(currentPosts);
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [marketData]);

  useEffect(() => {
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
      }

      return () => {
          if (!selectedPost) {
             document.title = "KriptoPusula | Akilli Kripto Takibi";
          }
      }
  }, [selectedPost]);

  const getCategoryColor = (category: string) => {
      switch(category) {
          case 'tahmin': return 'bg-yellow-500 text-white';
          case 'analiz': return 'bg-purple-500 text-white';
          case 'haber': return 'bg-blue-500 text-white';
          default: return 'bg-gray-500 text-white';
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

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-lg">Gunluk veriler kontrol ediliyor ve icerik hazirlaniyor...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">KriptoPusula Blog</h1>
            <p className="text-gray-500">
                Pazartesi-Cuma: <span className="text-yellow-600">Tahminler</span> • 
                Cumartesi: <span className="text-purple-600">Analiz</span> • 
                Pazar: <span className="text-blue-600">Haberler</span>
            </p>
        </div>
        <div className="text-xs text-gray-400 hidden md:block">
            Her gun 12:00'de guncellenir.
        </div>
      </div>

      {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
              Henuz blog yazisi bulunmuyor. Piyasa verileri bekleniyor.
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {posts.map((post) => (
            <article 
                key={post.id} 
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() => setSelectedPost(post)}
            >
                <div className="relative h-48 overflow-hidden">
                <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`${getCategoryColor(post.category)} text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                        {post.category}
                    </span>
                </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                <header>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <time dateTime={post.date} className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {post.date}
                        </time>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{post.readTime} okuma</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                    </h2>
                </header>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
                    {post.summary}
                </p>
                <footer className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white">
                        AI
                    </div>
                    {post.author}
                    </span>
                    <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Devamini Oku
                    </span>
                </footer>
                </div>
            </article>
            ))}
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-y-auto border border-gray-200 shadow-2xl relative animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: renderSchema(selectedPost) }}
            />

            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 bg-white text-gray-400 hover:text-gray-900 p-2 rounded-full z-10 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="h-64 relative">
                <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"></div>
                <div className="absolute bottom-4 left-8">
                    <span className={`${getCategoryColor(selectedPost.category)} text-xs font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block`}>
                        {selectedPost.category}
                    </span>
                </div>
            </div>
            
            <article className="p-8 -mt-6 relative">
               <div className="flex gap-2 mb-6 flex-wrap">
                  {selectedPost.tags?.map(tag => (
                      <span key={tag} className="bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                  ))}
               </div>
               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{selectedPost.title}</h1>
               
               <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        AI
                     </div>
                     <div>
                        <div className="text-gray-900 font-medium">{selectedPost.author}</div>
                        <div className="text-gray-400 text-xs">Yapay Zeka Editoru</div>
                     </div>
                  </div>
                  <div className="text-right text-gray-500 text-sm">
                     <time dateTime={selectedPost.date} className="font-medium text-gray-700">{selectedPost.date}</time>
                     <div>{selectedPost.readTime}</div>
                  </div>
               </div>

               <div 
                   className="prose prose-lg max-w-none text-gray-700"
                   dangerouslySetInnerHTML={{ 
                       __html: selectedPost.htmlContent || selectedPost.content.split('\n').map(p => `<p>${p}</p>`).join('') 
                   }}
               />

               <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400 text-center italic">
                   Bu icerik yapay zeka tarafindan olusturulmustur ve yatirim tavsiyesi niteligi tasimaz.
               </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSection;
