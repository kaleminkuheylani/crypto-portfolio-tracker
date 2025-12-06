import { CoinData } from "../types";

/**
 * Generate structured data for coin pages
 */
export function generateCoinStructuredData(coin: CoinData) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${coin.name} (${coin.symbol.toUpperCase()})`,
    "image": coin.image,
    "description": `${coin.name} (${coin.symbol.toUpperCase()}) fiyatı ve piyasa verileri`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": coin.current_price,
      "availability": "InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": Math.min(5, Math.max(1, 5 - (coin.market_cap_rank / 100))),
      "bestRating": "5",
      "ratingCount": Math.max(1, 1000 - coin.market_cap_rank)
    }
  };
}

/**
 * Generate structured data for blog posts
 */
export function generateBlogStructuredData(blogPost: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kriptosavasi.com/blog/${blogPost.slug}`
    },
    "headline": blogPost.title,
    "description": blogPost.metaDescription || blogPost.summary,
    "image": blogPost.imageUrl,
    "author": {
      "@type": "Person",
      "name": blogPost.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "KriptoSavasi",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kriptosavasi.com/logo.png"
      }
    },
    "datePublished": blogPost.date,
    "dateModified": blogPost.date
  };
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KriptoSavasi",
    "url": "https://kriptosavasi.com",
    "logo": "https://kriptosavasi.com/logo.png",
    "sameAs": [
      "https://twitter.com/kriptosavasi",
      "https://github.com/kriptosavasi"
    ]
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}