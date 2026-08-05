import { Metadata } from 'next';
import NewsContent from './NewsContent';

const SITE_URL = 'https://www.lticsarl.com';

export const metadata: Metadata = {
  title: 'News & Industry Insights — Logistics & Trade in Africa | LTIC SARL',
  description: 'Latest news, market insights and updates from LTIC SARL on African logistics, international trade, industrial supply and freight forwarding trends across 30+ countries.',
  keywords: [
    'logistics news africa', 'trade news cameroon', 'freight forwarding news',
    'industrial supply news', 'international trade africa insights', 'ltic sarl news',
    'logistics insights cameroon', 'supply chain news africa',
  ],
  alternates: { canonical: `${SITE_URL}/news` },
  openGraph: {
    title: 'News & Industry Insights — Logistics & Trade in Africa | LTIC SARL',
    description: 'Market insights and updates on African logistics, international trade and industrial supply from LTIC SARL.',
    type: 'website',
    url: `${SITE_URL}/news`,
    siteName: 'LTIC SARL',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'LTIC SARL News & Insights' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News & Industry Insights — Logistics & Trade in Africa | LTIC SARL',
    description: 'Market insights and updates on African logistics, international trade and industrial supply from LTIC SARL.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
  ],
};

const blogLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${SITE_URL}/news`,
  url: `${SITE_URL}/news`,
  name: 'LTIC SARL News & Industry Insights',
  description: 'Latest news and insights on African logistics, international trade, and industrial supply from LTIC SARL.',
  inLanguage: ['en', 'fr'],
  publisher: { '@id': `${SITE_URL}/#organization` },
  isPartOf: { '@id': `${SITE_URL}/#website` },
};

export default function NewsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
      <NewsContent />
    </>
  );
}
