import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
}

export function SEOHead({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url,
  type = 'website'
}: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Set basic meta tags
    setMetaTag('description', description);
    if (keywords) {
      setMetaTag('keywords', keywords);
    }

    // Set Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:site_name', 'إلكتروفاي - Electrofy Store', true);
    setMetaTag('og:locale', 'ar_LY', true);
    
    if (url) {
      setMetaTag('og:url', url, true);
    }

    // Set Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Set additional meta tags
    setMetaTag('robots', 'index, follow');
    setMetaTag('author', 'Electrofy Store');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Set canonical URL if provided
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }

  }, [title, description, keywords, image, url, type]);

  return null;
}