// Sanity CMS Service for blog posts
// This service allows manual blog post management alongside AI-generated content

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

// Mock data for demonstration purposes
// In a real implementation, this would connect to Sanity CMS
export const fetchSanityBlogPosts = async (): Promise<SanityBlogPost[]> => {
  // This is placeholder data - in reality, you would connect to Sanity CMS
  return [
    {
      _id: "manual-post-1",
      _createdAt: new Date().toISOString(),
      title: "Manuel Blog Yazısı Örneği",
      slug: {
        current: "manuel-blog-yazisi-ornek"
      },
      excerpt: "Bu bir manuel olarak eklenen blog yazısıdır.",
      body: "Bu içerik manuel olarak CMS üzerinden eklenmiştir. AI tarafından değil, kullanıcı tarafından oluşturulmuştur.",
      mainImage: {
        asset: {
          url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop"
        }
      },
      publishedAt: new Date().toISOString(),
      author: {
        name: "Yönetici"
      },
      categories: [
        {
          title: "haber"
        }
      ]
    }
  ];
};

// Function to combine Sanity posts with AI-generated posts
export const mergeBlogPosts = (aiPosts: any[], sanityPosts: SanityBlogPost[]) => {
  // Convert Sanity posts to match BlogPost interface
  const convertedSanityPosts = sanityPosts.map(post => ({
    id: post._id,
    title: post.title,
    slug: post.slug.current,
    metaDescription: post.excerpt,
    summary: post.excerpt,
    content: typeof post.body === 'string' ? post.body : JSON.stringify(post.body),
    htmlContent: typeof post.body === 'string' ? `<p>${post.body}</p>` : '<p>Manuel içerik</p>',
    author: post.author.name,
    date: post.publishedAt.split('T')[0],
    readTime: "5 dk",
    imageUrl: post.mainImage?.asset.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop",
    tags: post.categories.map(cat => cat.title),
    keywords: [post.title.split(' ')[0]],
    category: post.categories[0]?.title || "haber"
  }));

  // Combine and sort by date
  return [...aiPosts, ...convertedSanityPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};