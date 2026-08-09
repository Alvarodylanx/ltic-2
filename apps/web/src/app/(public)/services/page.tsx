import { Metadata } from 'next';
import ServicesContent from './ServicesContent';

const SITE_URL = 'https://www.lticsarl.com';

export const metadata: Metadata = {
  title: 'Logistics, Transit & Industrial Supply Services | LTIC SARL',
  description: 'LTIC SARL provides land transport, chemical manufacturing (ECOKLIN), lubricant distribution, offshore marine services, logistics training, commercial representation and vessel maintenance across Central Africa and beyond.',
  keywords: [
    'logistics services cameroon', 'freight forwarding africa', 'customs clearance cameroon',
    'import export services africa', 'industrial supply services', 'supply chain consulting africa',
    'offshore logistics gulf of guinea', 'commercial representation africa',
  ],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'Logistics, Transit & Industrial Supply Services | LTIC SARL',
    description: 'Seven services from LTIC SARL: land transport, ECOKLIN chemical manufacturing, lubricant distribution, offshore marine, logistics training, commercial representation, and vessel maintenance.',
    type: 'website',
    url: `${SITE_URL}/services`,
    siteName: 'LTIC SARL',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'LTIC SARL Services — Central Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seven Services, One Company | LTIC SARL',
    description: 'Seven services from LTIC SARL: land transport, ECOKLIN chemical manufacturing, lubricant distribution, offshore marine, logistics training, commercial representation, and vessel maintenance.',
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
  name: 'LTIC SARL — Seven Services',
  description: 'Seven core services from LTIC SARL based in Douala, Cameroon',
  url: `${SITE_URL}/services`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Land Transport', description: 'Reliable road freight transportation across Central Africa and neighboring countries.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Central Africa' } },
    { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Chemical Product Manufacturing', description: 'ECOKLIN brand — eco-friendly cleaning, hygiene and industrial sanitation products made at PK13, Douala.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Cameroon' } },
    { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'Lubricant Sales & Distribution', description: 'Authorized distributor of Total, Shell and leading lubricant brands for motors, vessels and industrial equipment.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Central Africa' } },
    { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'Offshore Marine Services', description: 'General ship chandling, maritime supply, sludging and spare parts procurement across Gulf of Guinea ports.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Gulf of Guinea' } },
    { '@type': 'ListItem', position: 5, item: { '@type': 'Service', name: 'Logistics Staff Training', description: 'Professional logistics training for personnel in maritime, customs, transit and supply chain sectors.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Cameroon' } },
    { '@type': 'ListItem', position: 6, item: { '@type': 'Service', name: 'Commercial Representation', description: 'Gateway services for international brands entering the Cameroonian and Central African markets.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Central Africa' } },
    { '@type': 'ListItem', position: 7, item: { '@type': 'Service', name: 'Vessel Maintenance at Sea', description: 'On-site technical support, inspections and emergency maintenance for vessels in African waters.', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: 'Gulf of Guinea' } },
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
