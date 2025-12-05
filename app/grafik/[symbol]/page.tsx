import { Metadata } from 'next';
import ChartPageClient from './ChartPageClient';

type Props = {
  params: Promise<{ symbol: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();
  
  return {
    title: `${upperSymbol} Canli Grafik | KriptoPusula`,
    description: `${upperSymbol}/USDT canli fiyat grafigi, teknik analiz araclari ve gercek zamanli piyasa verileri. Profesyonel kripto grafik platformu.`,
    keywords: [`${upperSymbol}`, 'kripto grafik', 'canli fiyat', 'teknik analiz', 'binance', 'trading'],
    openGraph: {
      title: `${upperSymbol} Canli Grafik | KriptoPusula`,
      description: `${upperSymbol}/USDT canli fiyat grafigi ve teknik analiz araclari.`,
      type: 'website',
      siteName: 'KriptoPusula',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${upperSymbol} Canli Grafik | KriptoPusula`,
    },
    robots: 'index, follow',
  };
}

export default async function ChartPage({ params }: Props) {
  const { symbol } = await params;
  return <ChartPageClient symbol={symbol} />;
}
