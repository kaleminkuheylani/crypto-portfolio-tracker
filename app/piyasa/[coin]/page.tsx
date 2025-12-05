import { Metadata } from 'next';
import CoinPageClient from './CoinPageClient';

type Props = {
  params: Promise<{ coin: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { coin } = await params;
  const coinName = coin.charAt(0).toUpperCase() + coin.slice(1);
  
  return {
    title: `${coinName} Fiyati ve Detaylari | KriptoPusula`,
    description: `${coinName} canli fiyati, piyasa degeri, islem hacmi ve detayli istatistikler. Guncel kripto para verileri.`,
    keywords: [coin, 'kripto fiyat', 'canli fiyat', 'piyasa degeri', 'kripto para'],
    openGraph: {
      title: `${coinName} Fiyati | KriptoPusula`,
      description: `${coinName} canli fiyati ve piyasa verileri.`,
      type: 'website',
      siteName: 'KriptoPusula',
    },
    twitter: {
      card: 'summary',
      title: `${coinName} Fiyati | KriptoPusula`,
    },
    robots: 'index, follow',
  };
}

export default async function CoinPage({ params }: Props) {
  const { coin } = await params;
  return <CoinPageClient coinId={coin} />;
}
