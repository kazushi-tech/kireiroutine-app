import { useEffect } from 'react';

type SEOProps = {
  title?: string;
  description?: string;
};

const defaultTitle = 'Kazushi | Digital Reality for One';
const defaultDescription = 'Webマーケティング × AIツール × フロントエンド開発で、「めんどうだけど大事なこと」を仕組み化するクリエイター。';

/**
 * Custom hook to dynamically update document head for SEO
 */
export const useDocumentHead = ({ title, description }: SEOProps = {}) => {
  useEffect(() => {
    // Update title
    const fullTitle = title ? `${title} | Kazushi` : defaultTitle;
    document.title = fullTitle;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || defaultDescription);
    }

    // Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    // Update OG description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description || defaultDescription);
    }

    // Update Twitter title
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', fullTitle);
    }

    // Update Twitter description
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description || defaultDescription);
    }

    // Cleanup: reset to defaults when component unmounts
    return () => {
      document.title = defaultTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDescription);
      }
    };
  }, [title, description]);
};

export default useDocumentHead;
