// Sanity CMS Service for blog posts
// This service connects to Sanity CMS for manual blog post management

import { createClient } from '@sanity/client';

// Types for Sanity blog posts
export interface SanityBlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  body: any; // Portable Text
  mainImage?: {
    asset: {
      url: string;
    };
  };
  publishedAt: string;
  author: {
    name: string;
  };
  categories: Array<{
    title: string;
  }>;
}

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', // Use current date (YYYY-MM-DD)
  useCdn: process.env.NODE_ENV === 'production', // `false` if you want to ensure fresh data
});

// Fetch blog posts from Sanity CMS
export const fetchSanityBlogPosts = async (): Promise<SanityBlogPost[]> => {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      _createdAt,
      title,
      slug,
      excerpt,
      body,
      mainImage{
        asset->{
          url
        }
      },
      publishedAt,
      author->{
        name
      },
      categories[]->{
        title
      }
    }`;
    
    const posts = await client.fetch(query);
    return posts;
  } catch (error) {
    console.error("Sanity CMS veri çekme hatası:", error);
    return [];
  }
};

// Function to combine Sanity posts with AI-generated posts
export const mergeBlogPosts = (aiPosts: any[], sanityPosts: SanityBlogPost[]) => {
  // Convert Sanity posts to match BlogPost interface
  const convertedSanityPosts = sanityPosts.map(post => ({
    id: `sanity-${post._id}`,
    title: post.title,
    slug: post.slug.current,
    metaDescription: post.excerpt,
    summary: post.excerpt,
    content: typeof post.body === 'string' ? post.body : JSON.stringify(post.body),
    htmlContent: typeof post.body === 'string' ? `<p>${post.body}</p>` : '<p>Manuel içerik</p>',
    author: post.author.name,
    date: post.publishedAt.split('T')[0],
    readTime: "5 dk",
    imageUrl: post.mainImage?.asset?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop",
    tags: post.categories.map(cat => cat.title),
    keywords: [post.title.split(' ')[0]],
    category: post.categories[0]?.title || "haber"
  }));

  // Combine and sort by date
  return [...aiPosts, ...convertedSanityPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};