import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  return {
    title: `${decodedSlug.replace(/-/g, ' ')} | KriptoPusula Blog`,
    description: `KriptoPusula - ${decodedSlug.replace(/-/g, ' ')} hakkinda detayli kripto analizi ve piyasa degerlendirmesi.`,
    keywords: 'kripto, bitcoin, ethereum, analiz, tahmin, piyasa, blog',
    openGraph: {
      title: `${decodedSlug.replace(/-/g, ' ')} | KriptoPusula Blog`,
      description: `KriptoPusula - ${decodedSlug.replace(/-/g, ' ')} hakkinda detayli kripto analizi.`,
      type: 'article',
      siteName: 'KriptoPusula',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedSlug.replace(/-/g, ' ')} | KriptoPusula Blog`,
    },
    robots: 'index, follow',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
