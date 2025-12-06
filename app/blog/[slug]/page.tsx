import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  // Try to fetch actual blog post data for better SEO
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}/api/blogs?slug=${decodedSlug}`);
    
    if (response.ok) {
      const blogPost = await response.json();
      
      if (blogPost) {
        return {
          title: `${blogPost.title} | KriptoPusula Blog`,
          description: blogPost.metaDescription || blogPost.summary || `KriptoPusula - ${blogPost.title} hakkında detaylı kripto analizi ve piyasa değerlendirmesi.`,
          keywords: blogPost.keywords || ['kripto', 'bitcoin', 'ethereum', 'analiz', 'tahmin', 'piyasa', 'blog'],
          openGraph: {
            title: `${blogPost.title} | KriptoPusula Blog`,
            description: blogPost.metaDescription || blogPost.summary,
            type: 'article',
            siteName: 'KriptoPusula',
            url: `https://kriptopusula.com/blog/${decodedSlug}`,
            ...(blogPost.imageUrl && { images: [blogPost.imageUrl] }),
          },
          twitter: {
            card: 'summary_large_image',
            title: `${blogPost.title} | KriptoPusula Blog`,
            description: blogPost.metaDescription || blogPost.summary,
            ...(blogPost.imageUrl && { images: [blogPost.imageUrl] }),
          },
          robots: {
            index: true,
            follow: true,
          },
        };
      }
    }
  } catch (error) {
    console.error("Blog post metadata generation error:", error);
  }
  
  // Fallback metadata
  return {
    title: `${decodedSlug.replace(/-/g, ' ')} | KriptoPusula Blog`,
    description: `KriptoPusula - ${decodedSlug.replace(/-/g, ' ')} hakkında detaylı kripto analizi ve piyasa değerlendirmesi.`,
    keywords: ['kripto', 'bitcoin', 'ethereum', 'analiz', 'tahmin', 'piyasa', 'blog'],
    openGraph: {
      title: `${decodedSlug.replace(/-/g, ' ')} | KriptoPusula Blog`,
      description: `KriptoPusula - ${decodedSlug.replace(/-/g, ' ')} hakkında detaylı kripto analizi.`,
      type: 'article',
      siteName: 'KriptoPusula',
      url: `https://kriptopusula.com/blog/${decodedSlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedSlug.replace(/-/g, ' ')} | KriptoPusula Blog`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}