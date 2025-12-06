import { Metadata } from 'next';
import CoinPageClient from './CoinPageClient';
import { getTopCoins } from '../../../services/cryptoApi';

type Props = {
  params: Promise<{ coin: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { coin } = await params;
  const coins = await getTopCoins();
  const coinData = coins.find(c => 
    c.id === coin || 
    c.symbol.toLowerCase() === coin.toLowerCase() ||
    c.name.toLowerCase() === coin.toLowerCase()
  );

  if (!coinData) {
    return {
      title: `${coin} - Kripto Para Detayı | KriptoPusula`,
      description: `${coin} hakkında canlı fiyat, piyasa değeri, işlem hacmi ve detaylı istatistikler.`,
      keywords: [coin, 'kripto para', 'canlı fiyat', 'piyasa değeri', 'kripto analiz'],
    };
  }

  const coinName = coinData.name;
  const coinSymbol = coinData.symbol.toUpperCase();
  const price = coinData.current_price.toLocaleString('tr-TR', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: coinData.current_price < 1 ? 4 : 2
  });
  const marketCap = (coinData.market_cap / 1000000).toFixed(2);

  return {
    title: `${coinName} (${coinSymbol}) Fiyatı ve Analizi | KriptoPusula`,
    description: `${coinName} (${coinSymbol}) fiyatı: ${price}. Piyasa değeri: $${marketCap}M. Canlı kripto para verileri, grafikler ve teknik analiz.`,
    keywords: [coinSymbol, coinName, 'kripto fiyat', 'canlı fiyat', 'piyasa değeri', 'kripto para', 'BTC', 'ETH', 'SOL'],
    openGraph: {
      title: `${coinName} (${coinSymbol}) Fiyatı | KriptoPusula`,
      description: `${coinName} (${coinSymbol}) fiyatı: ${price}. Piyasa değeri: $${marketCap}M. Canlı kripto verileri ve teknik analiz.`,
      type: 'website',
      siteName: 'KriptoPusula',
      url: `https://kriptopusula.com/piyasa/${coin}`,
    },
    twitter: {
      card: 'summary',
      title: `${coinName} (${coinSymbol}) Fiyatı | KriptoPusula`,
      description: `${coinName} (${coinSymbol}) fiyatı: ${price}. Piyasa değeri: $${marketCap}M.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CoinPage({ params }: Props) {
  const { coin } = await params;
  return <CoinPageClient coinId={coin} />;
}