'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopCoins } from '../../../services/cryptoApi';
import { CoinData, BlogPost } from '../../../types';
import { initializeBlogSystem } from '../../../services/blogService';

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchData = async () => {
      setIsLoading(true);
      const coins = await getTopCoins();
      
      if (coins.length > 0) {
        const currentPosts = await initializeBlogSystem(coins);
        setAllPosts(currentPosts);
        
        const decodedSlug = decodeURIComponent(slug);
        const foundPost = currentPosts.find(p => 
          p.id === decodedSlug || 
          p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === decodedSlug.toLowerCase()
        );
        setPost(foundPost || null);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [isMounted, slug]);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'tahmin': return 'bg-yellow-600 text-white';
      case 'analiz': return 'bg-purple-600 text-white';
      case 'haber': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const renderSchema = (blogPost: BlogPost) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blogPost.title,
      "image": blogPost.imageUrl,
      "author": {
        "@type": "Person",
        "name": blogPost.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "KriptoPusula",
        "logo": {
          "@type": "ImageObject",
          "url": "/logo.png"
        }
      },
      "datePublished": blogPost.date,
      "dateModified": blogPost.date,
      "description": blogPost.metaDescription,
      "articleBody": blogPost.content,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `/blog/${slug}`
      }
    };
    return JSON.stringify(schema);
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-lg">Icerik yukleniyor...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-500 transition-colors">
              <img src="/logo.png" alt="KriptoPusula Logo" className="w-10 h-10 object-contain" />
              KriptoPusula
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Ana Sayfa
              </Link>
              <Link href="/blog" className="text-blue-600 font-medium text-sm">
                Blog
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Yazi Bulunamadi</h1>
          <p className="text-gray-500 mb-8">Aradiginiz blog yazisi bulunamadi veya henuz olusturulmadi.</p>
          <Link href="/blog" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Tum Yazilara Don
          </Link>
        </main>
      </div>
    );
  }

  const relatedPosts = allPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderSchema(post) }}
      />
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-500 transition-colors">
            <img src="/logo.png" alt="KriptoPusula Logo" className="w-10 h-10 object-contain" />
            KriptoPusula
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
              Ana Sayfa
            </Link>
            <Link href="/blog" className="text-blue-600 font-medium text-sm">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <article className="max-w-4xl mx-auto">
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        </div>

        <div className="px-4 md:px-8 -mt-20 relative">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`${getCategoryColor(post.category)} text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                {post.category}
              </span>
              {post.tags?.map(tag => (
                <span key={tag} className="bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  AI
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">{post.author}</div>
                  <div className="text-gray-400 text-sm">Yapay Zeka Editoru</div>
                </div>
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-4">
                <time dateTime={post.date} className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {post.date}
                </time>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {post.readTime}
                </span>
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ 
                __html: post.htmlContent || post.content.split('\n').map(p => `<p>${p}</p>`).join('') 
              }}
            />

            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400 text-center italic">
                Bu icerik yapay zeka tarafindan olusturulmustur ve yatirim tavsiyesi niteligi tasimaz.
              </p>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="mt-12 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Benzer Yazilar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={relatedPost.imageUrl} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{relatedPost.summary}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          <p>KriptoPusula - Yapay Zeka Destekli Kripto Takibi</p>
          <p className="mt-2 text-xs">Bu icerikler yapay zeka tarafindan olusturulmustur ve yatirim tavsiyesi niteligi tasimaz.</p>
        </div>
      </footer>
    </div>
  );
}
