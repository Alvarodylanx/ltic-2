import { Metadata } from 'next';
import ContactContent from './ContactContent';

const SITE_URL = 'https://www.lticsarl.com';

export const metadata: Metadata = {
  title: 'Contact LTIC SARL — Douala, Cameroon | Logistics & Trade Inquiries',
  description: 'Contact LTIC SARL for freight forwarding, industrial supply and international trade inquiries. Our team in Douala, Cameroon responds within 24 hours in English and French.',
  keywords: [
    'contact ltic sarl', 'logistics contact cameroon', 'freight forwarder contact douala',
    'industrial supply contact', 'trade inquiry cameroon', 'ltic sarl email',
    'logistics company douala contact',
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact LTIC SARL — Douala, Cameroon | Logistics & Trade Inquiries',
    description: 'Reach our logistics and trade team in Douala, Cameroon. We respond within 24 hours in English and French.',
    type: 'website',
    url: `${SITE_URL}/contact`,
    siteName: 'LTIC SARL',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Contact LTIC SARL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact LTIC SARL — Douala, Cameroon | Logistics & Trade Inquiries',
    description: 'Reach our logistics and trade team in Douala, Cameroon. We respond within 24 hours.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
  ],
};

const contactPageLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${SITE_URL}/contact`,
  url: `${SITE_URL}/contact`,
  name: 'Contact LTIC SARL',
  description: 'Contact page for LTIC SARL logistics and industrial supply company based in Douala, Cameroon.',
  inLanguage: ['en', 'fr'],
  isPartOf: { '@id': `${SITE_URL}/#website` },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'FreightForwarder'],
  '@id': `${SITE_URL}/#localbusiness`,
  name: 'LTIC SARL',
  alternateName: 'Logistics and Transit International SARL',
  description: 'Freight forwarding, customs clearance, industrial supply and international trade services from Douala, Cameroon.',
  url: SITE_URL,
  telephone: '+237000000000',
  email: 'contact@lticsarl.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Douala',
    addressRegion: 'Littoral',
    addressCountry: 'CM',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 4.0511,
    longitude: 9.7679,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
  ],
  priceRange: '$$',
  currenciesAccepted: 'XAF, EUR, USD',
  areaServed: 'Worldwide',
  hasMap: 'https://maps.google.com/?q=Douala,Cameroon',
  sameAs: [`${SITE_URL}/#organization`],
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <ContactContent />
    </>
  );
}
