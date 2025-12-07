'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BlogPost } from '../../../types';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

export default function AdminPage() {
  const params = useParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'haber' | 'analiz' | 'tahmin'>('haber');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [geminiPrompt, setGeminiPrompt] = useState('');

  useEffect(() => {
    // Check if secret URL is correct
    if (!ADMIN_SECRET || params.secret !== ADMIN_SECRET) {
      router.push('/');
    }
  }, [params.secret, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          secret: params.secret,
        }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Yanlış şifre!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş sırasında bir hata oluştu');
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const postData = {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        metaDescription: content.substring(0, 160),
        summary: content.substring(0, 100) + '...',
        content,
        htmlContent: `<p>${content.replace(/\n/g, '</p><p>')}</p>`,
        author: 'Admin',
        date: new Date().toISOString().split('T')[0],
        readTime: `${Math.ceil(content.length / 500)} dk`,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop',
        tags: [category],
        keywords: [title.split(' ')[0]],
        category
      };

      const response = await fetch('/api/blog/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Blog yazısı oluşturulamadı');
      }

      // Reset form
      setTitle('');
      setContent('');
      setImageUrl('');
      setCategory('haber');
      
      // Reload posts
      await loadPosts();
      
      alert('Blog yazısı başarıyla oluşturuldu!');
    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateWithGemini = async () => {
    if (!geminiPrompt.trim()) {
      setError('Lütfen bir açıklama girin');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: geminiPrompt,
          context: 'Blog yazısı oluştur. Cevap başlık ve içerik olarak döndür. JSON formatında: {"title": "...", "content": "..."}'  
        }),
      });

      if (!response.ok) {
        throw new Error('Gemini AI isteği başarısız oldu');
      }

      const data = await response.json();
      
      // Parse the response
      let generatedData;
      try {
        // Try to extract JSON from the response
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        generatedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: geminiPrompt, content: data.response };
      } catch (e) {
        generatedData = { title: geminiPrompt, content: data.response };
      }

      setTitle(generatedData.title || geminiPrompt);
      setContent(generatedData.content || data.response);
      setGeminiPrompt('');
      
      alert('İçerik başarıyla oluşturuldu!');
    } catch (error: any) {
      setError(error.message || 'İçerik oluşturulamadı');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Yazı silinemedi');
      }

      await loadPosts();
      alert('Yazı başarıyla silindi!');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setError(error.message || 'Silme işlemi başarısız oldu');
    }
  };

  if (params.secret !== ADMIN_SECRET) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Panel</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Admin şifresini girin"
                required
              />
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin Panel - Blog Yönetimi</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Post */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Yeni Blog Yazısı</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Gemini AI Generator */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h3 className="text-sm font-bold text-blue-400 mb-3">Gemini AI ile Oluştur</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={geminiPrompt}
                  onChange={(e) => setGeminiPrompt(e.target.value)}
                  placeholder="örn: Bitcoin fiyatı hakkında bir yazı yaz"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isGenerating}
                />
                <button
                  type="button"
                  onClick={handleGenerateWithGemini}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {isGenerating ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'haber' | 'analiz' | 'tahmin')}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="haber">Haber</option>
                  <option value="analiz">Analiz</option>
                  <option value="tahmin">Tahmin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Görsel URL (isteğe bağlı)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  İçerik
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isGenerating}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Kaydediliyor...' : 'Yayınla'}
              </button>
            </form>
          </div>

          {/* Posts List */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Mevcut Yazılar ({posts.length})</h2>
            
            {loading ? (
              <div className="text-center py-8 text-gray-400">Yükleniyor...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Henüz yazı yok</div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{post.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            {post.category}
                          </span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-400 hover:text-red-300 transition-colors text-sm px-3 py-1 hover:bg-red-500/20 rounded"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
