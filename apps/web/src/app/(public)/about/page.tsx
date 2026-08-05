import { Metadata } from 'next';
import AboutContent from './AboutContent';

const SITE_URL = 'https://www.lticsarl.com';

export const metadata: Metadata = {
  title: 'About LTIC SARL — Logistics Company Based in Douala, Cameroon',
  description: 'LTIC SARL is a Cameroonian multinational founded in 2019, specializing in freight forwarding, customs clearance, industrial supply and international trade across Africa, Europe and Asia from Douala.',
  keywords: [
    'about ltic sarl', 'logistics company cameroon', 'freight forwarder douala',
    'industrial supply africa', 'multinational cameroon', 'offshore logistics douala',
    'ltic sarl history', 'logistics company douala cameroon',
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About LTIC SARL — Logistics Company Based in Douala, Cameroon',
    description: 'Cameroonian multinational specializing in freight forwarding, industrial supply and international trade across 30+ countries from Douala.',
    type: 'website',
    url: `${SITE_URL}/about`,
    siteName: 'LTIC SARL',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'About LTIC SARL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About LTIC SARL — Logistics Company Based in Douala, Cameroon',
    description: 'Cameroonian multinational specializing in freight forwarding, industrial supply and international trade across 30+ countries.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: `${SITE_URL}/about` },
  ],
};

const aboutPageLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${SITE_URL}/about`,
  url: `${SITE_URL}/about`,
  name: 'About LTIC SARL',
  description: 'LTIC SARL is a Cameroonian multinational company providing freight forwarding, industrial supply and international trade services across 30+ countries.',
  inLanguage: ['en', 'fr'],
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }} />
      <AboutContent />
    </>
  );
}
