import { Metadata } from 'next';
import QuoteContent from './QuoteContent';

const SITE_URL = 'https://www.lticsarl.com';

export const metadata: Metadata = {
  title: 'Request a Free Logistics & Supply Quote | LTIC SARL',
  description: 'Get a free customized quote from LTIC SARL for freight forwarding, customs clearance, industrial supply and international trade. Our team responds within 24 hours.',
  keywords: [
    'logistics quote cameroon', 'freight quote africa', 'industrial supply quote',
    'customs clearance quote', 'shipping quote africa', 'free trade quote cameroon',
    'ltic sarl quote', 'freight forwarder quote douala',
  ],
  alternates: { canonical: `${SITE_URL}/quote` },
  openGraph: {
    title: 'Request a Free Logistics & Supply Quote | LTIC SARL',
    description: 'Free quote for freight forwarding, customs clearance and industrial supply — response within 24 hours from our Douala team.',
    type: 'website',
    url: `${SITE_URL}/quote`,
    siteName: 'LTIC SARL',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Request a Quote — LTIC SARL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request a Free Logistics & Supply Quote | LTIC SARL',
    description: 'Free quote for freight forwarding, customs clearance and industrial supply — response within 24 hours.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Request a Quote', item: `${SITE_URL}/quote` },
  ],
};

const quoteServiceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Free Logistics & Industrial Supply Quote',
  description: 'Request a free customized quote for freight forwarding, customs clearance, industrial supply and international trade from LTIC SARL.',
  url: `${SITE_URL}/quote`,
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: 'Worldwide',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free quote — no commitment required',
  },
};

export default function QuotePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quoteServiceLd) }} />
      <QuoteContent />
    </>
  );
}
