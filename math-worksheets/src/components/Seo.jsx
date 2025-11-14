import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Scotch Egg Math Worksheets';
const DEFAULT_DESCRIPTION =
  'Download free SAT and classroom-ready math worksheets covering algebra, geometry, statistics, and more with teacher-friendly guidance.';

const ensureMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.setAttribute(key, value);
    }
  });
};

const ensureLink = (rel, href) => {
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

export default function Seo({ title, description = DEFAULT_DESCRIPTION, keywords = [], canonicalPath = '', structuredData }) {
  const location = useLocation();
  const canonicalUrl =
    canonicalPath ||
    (typeof window !== 'undefined' ? `${window.location.origin}${location?.pathname ?? ''}` : canonicalPath);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = pageTitle;

    ensureMeta('meta[name="description"]', { name: 'description', content: description });
    ensureMeta('meta[name="keywords"]', {
      name: 'keywords',
      content: keywords.length ? keywords.join(', ') : 'math worksheets, SAT math practice, algebra worksheets',
    });

    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    ensureMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });

    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });

    if (canonicalUrl) {
      ensureLink('canonical', canonicalUrl);
    }
  }, [title, description, keywords, canonicalUrl]);

  const data = typeof structuredData === 'function' ? structuredData({ canonicalUrl }) : structuredData;

  if (!data) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
