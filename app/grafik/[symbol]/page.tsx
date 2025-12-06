import { Metadata } from 'next';
import ChartPageClient from './ChartPageClient';
import { getTopCoins } from '../../../services/cryptoApi';

type Props = {
  params: Promise<{ symbol: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();
  
  // Try to get real coin data for better SEO
  try {
    const coins = await getTopCoins();
    const coinData = coins.find(c => 
      c.symbol.toLowerCase() === symbol.toLowerCase() ||
      c.id.toLowerCase() === symbol.toLowerCase()
    );
    
    if (coinData) {
      const coinName = coinData.name;
      const price = coinData.current_price.toLocaleString('tr-TR', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: coinData.current_price < 1 ? 4 : 2
      });
      
      return {
        title: `${coinName} (${upperSymbol}) Canlı Grafik ve Teknik Analiz | KriptoSavası`,
        description: `${coinName} (${upperSymbol})/${upperSymbol}USDT canlı fiyat grafiği, teknik analiz araçları ve gerçek zamanlı piyasa verileri. ${price} güncel fiyatı ile profesyonel kripto grafik platformu.`,
        keywords: [`${upperSymbol}`, `${coinName}`, 'kripto grafik', 'canlı fiyat', 'teknik analiz', 'BTC', 'ETH', 'SOL', 'grafik', 'kripto para'],
        openGraph: {
          title: `${coinName} (${upperSymbol}) Canlı Grafik | KriptoSavası`,
          description: `${coinName} (${upperSymbol})/${upperSymbol}USDT canlı fiyat grafiği ve teknik analiz araçları. ${price} güncel fiyatı.`,
          type: 'website',
          siteName: 'KriptoSavası',
          url: `https://kriptosavasi.com/grafik/${symbol}`,
        },
        twitter: {
          card: 'summary_large_image',
          title: `${coinName} (${upperSymbol}) Canlı Grafik | KriptoSavası`,
          description: `${coinName} (${upperSymbol})/${upperSymbol}USDT canlı fiyat grafiği. ${price} güncel fiyatı.`,
        },
        robots: {
          index: true,
          follow: true,
        },
      };
    }
  } catch (error) {
    console.error("SEO metadata generation error:", error);
  }
  
  // Fallback metadata
  return {
    title: `${upperSymbol} Canlı Grafik | KriptoSavası`,
    description: `${upperSymbol}/USDT canlı fiyat grafiği, teknik analiz araçları ve gerçek zamanlı piyasa verileri. Profesyonel kripto grafik platformu.`,
    keywords: [`${upperSymbol}`, 'kripto grafik', 'canlı fiyat', 'teknik analiz', 'binance', 'trading'],
    openGraph: {
      title: `${upperSymbol} Canlı Grafik | KriptoSavası`,
      description: `${upperSymbol}/USDT canlı fiyat grafiği ve teknik analiz araçları.`,
      type: 'website',
      siteName: 'KriptoSavası',
      url: `https://kriptosavasi.com/grafik/${symbol}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${upperSymbol} Canlı Grafik | KriptoSavası`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ChartPage({ params }: Props) {
  const { symbol } = await params;
  return <ChartPageClient symbol={symbol} />;
}