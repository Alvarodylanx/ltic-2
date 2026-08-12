import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsContent from './ProductsContent';

// Force dynamic rendering — page filters by URL search params so static
// generation doesn't apply, and avoids the useSearchParams() SSR edge case.
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://www.lticsarl.com';

export const metadata: Metadata = {
  title: 'Industrial Products Catalog — Timber, Equipment & Materials | LTIC SARL',
  description: 'Browse LTIC SARL\'s industrial product catalog — certified timber species, power generators, lubricants, filtration systems, charcoal and more. Available for bulk export and import.',
  keywords: [
    'industrial products cameroon', 'timber export africa', 'generators cameroon',
    'lubricants africa', 'filtration systems africa', 'charcoal cameroon export',
    'industrial equipment douala', 'tropical timber export', 'hay export cameroon',
    'industrial catalog africa', 'ltic sarl products',
  ],
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: {
    title: 'Industrial Products Catalog — Timber, Equipment & Materials | LTIC SARL',
    description: 'Certified timber, generators, lubricants, filtration systems and more — available for bulk export and import worldwide.',
    type: 'website',
    url: `${SITE_URL}/products`,
    siteName: 'LTIC SARL',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'LTIC SARL Product Catalog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industrial Products Catalog — Timber, Equipment & Materials | LTIC SARL',
    description: 'Certified timber, generators, lubricants, filtration systems and more — available for bulk export and import worldwide.',
    images: [`${SITE_URL}/og-image.png`],
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
  ],
};

const collectionPageLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}/products`,
  url: `${SITE_URL}/products`,
  name: 'LTIC SARL Industrial Products Catalog',
  description: 'Industrial and commercial products — timber, generators, lubricants, filtration, charcoal — available for global trade.',
  inLanguage: ['en', 'fr'],
  isPartOf: { '@id': `${SITE_URL}/#website` },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export default function ProductsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }} />
      <Suspense fallback={null}>
        <ProductsContent />
      </Suspense>
    </>
  );
}
