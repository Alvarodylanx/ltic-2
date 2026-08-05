import { Metadata } from 'next';
import ServicesContent from './ServicesContent';

const SITE_URL = 'https://www.lticsarl.com';

export const metadata: Metadata = {
  title: 'Logistics, Transit & Industrial Supply Services | LTIC SARL',
  description: 'LTIC SARL provides freight forwarding, customs clearance, import/export facilitation, industrial supply, supply chain consulting and offshore logistics across 30+ countries.',
  keywords: [
    'logistics services cameroon', 'freight forwarding africa', 'customs clearance cameroon',
    'import export services africa', 'industrial supply services', 'supply chain consulting africa',
    'offshore logistics gulf of guinea', 'commercial representation africa',
  ],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'Logistics, Transit & Industrial Supply Services | LTIC SARL',
    description: 'End-to-end freight forwarding, customs clearance, industrial supply and international trade services across 30+ countries.',
    type: 'website',
    url: `${SITE_URL}/services`,
    siteName: 'LTIC SARL',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'LTIC SARL Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logistics, Transit & Industrial Supply Services | LTIC SARL',
    description: 'End-to-end freight forwarding, customs clearance, industrial supply and international trade services across 30+ countries.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
  ],
};

const servicesLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'LTIC SARL Services',
  description: 'Full range of logistics, transit and industrial services from LTIC SARL',
  url: `${SITE_URL}/services`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Logistics & Transit', description: 'End-to-end freight forwarding, customs clearance and international transit by air, sea and road.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Worldwide' } },
    { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Import & Export', description: 'Cross-border trade facilitation with expert compliance management and full documentation support.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Worldwide' } },
    { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'Industrial Supply', description: 'Generators, lubricants, filters and heavy materials — Total, Shell and certified OEM brands.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Africa' } },
    { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'Timber & Trade', description: 'Certified tropical timber and logs for international construction and general trade markets.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Worldwide' } },
    { '@type': 'ListItem', position: 5, item: { '@type': 'Service', name: 'Supply Chain Consulting', description: 'Strategic logistics optimization, procurement consulting and risk management for global markets.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Africa' } },
    { '@type': 'ListItem', position: 6, item: { '@type': 'Service', name: 'Commercial Representation', description: 'Brand representation, joint ventures and distribution partnerships across emerging markets.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Africa' } },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesLd) }} />
      <ServicesContent />
    </>
  );
}
