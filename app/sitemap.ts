import { getTopCoins } from '../services/cryptoApi';

export default async function sitemap() {
  const baseUrl = 'https://kriptopusula.com';
  
  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/hakkimizda',
  ].map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: page === '' ? 1 : 0.8,
  }));
  
  // Dynamic coin pages
  const coinPages = [];
  try {
    const coins = await getTopCoins();
    // Limit to top 100 coins to avoid huge sitemap
    const topCoins = coins.slice(0, 100);
    
    for (const coin of topCoins) {
      coinPages.push({
        url: `${baseUrl}/piyasa/${coin.id}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
      });
      
      coinPages.push({
        url: `${baseUrl}/grafik/${coin.symbol.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Failed to generate coin pages for sitemap:", error);
  }
  
  // Dynamic blog pages
  const blogPages = [];
  try {
    const response = await fetch(`${baseUrl}/api/blogs?limit=50`);
    if (response.ok) {
      const blogs = await response.json();
      for (const blog of blogs) {
        blogPages.push({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: new Date(blog.date),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error("Failed to generate blog pages for sitemap:", error);
  }
  
  return [
    ...staticPages,
    ...coinPages,
    ...blogPages,
  ];
}