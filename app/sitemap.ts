import { getTopCoins } from '../services/cryptoApi';

export default async function sitemap() {
  const baseUrl = 'https://kriptosavasi.com';
  
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
    // Limit to top 200 coins to provide better coverage for SEO
    const topCoins = coins.slice(0, 200);
    
    for (const [index, coin] of topCoins.entries()) {
      // Calculate priority based on market cap rank (higher rank = higher priority)
      // Top 10 coins get priority 0.9, next 40 get 0.8, rest get 0.7
      let priority = 0.7;
      if (index < 10) priority = 0.9;
      else if (index < 50) priority = 0.8;
      
      // Main coin detail page
      coinPages.push({
        url: `${baseUrl}/piyasa/${coin.id}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: priority,
      });
      
      // Chart page for the coin
      coinPages.push({
        url: `${baseUrl}/grafik/${coin.symbol.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: priority - 0.2, // Charts are slightly less important
      });
    }
  } catch (error) {
    console.error("Failed to generate coin pages for sitemap:", error);
    
    // Fallback: Add some popular coins manually
    const fallbackCoins = [
      { id: 'bitcoin', symbol: 'btc' },
      { id: 'ethereum', symbol: 'eth' },
      { id: 'binance-coin', symbol: 'bnb' },
      { id: 'solana', symbol: 'sol' },
      { id: 'ripple', symbol: 'xrp' },
      { id: 'cardano', symbol: 'ada' },
      { id: 'dogecoin', symbol: 'doge' },
      { id: 'polygon', symbol: 'matic' },
      { id: 'chainlink', symbol: 'link' },
      { id: 'litecoin', symbol: 'ltc' }
    ];
    
    for (const coin of fallbackCoins) {
      coinPages.push({
        url: `${baseUrl}/piyasa/${coin.id}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
      });
      
      coinPages.push({
        url: `${baseUrl}/grafik/${coin.symbol}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.7,
      });
    }
  }
  
  // Dynamic blog pages
  const blogPages = [];
  try {
    const response = await fetch(`${baseUrl}/api/blogs?limit=100`);
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