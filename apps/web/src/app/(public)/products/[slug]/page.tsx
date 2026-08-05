import { Metadata } from 'next';
import ProductDetailContent from './ProductDetailContent';

const SITE_URL = 'https://www.lticsarl.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

function absoluteImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${SITE_URL}${url}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await fetchProduct(params.slug);
  if (!product) return { title: 'Product | LTIC SARL' };

  const name = product.nameEn;
  const description = product.descriptionEn
    ? product.descriptionEn.slice(0, 160)
    : `${name} — available from LTIC SARL, your global logistics and industrial supply partner based in Douala, Cameroon.`;
  const imageUrl = absoluteImageUrl(product.imageUrl);
  const category = product.categoryName ?? 'Industrial Supply';

  return {
    title: `${name} — ${category} | LTIC SARL`,
    description,
    keywords: [
      name.toLowerCase(), category.toLowerCase(),
      'industrial supply cameroon', 'export cameroon', 'ltic sarl products',
      'buy africa', 'bulk supply',
    ],
    alternates: { canonical: `${SITE_URL}/products/${params.slug}` },
    openGraph: {
      title: `${name} — ${category} | LTIC SARL`,
      description,
      type: 'website',
      url: `${SITE_URL}/products/${params.slug}`,
      siteName: 'LTIC SARL',
      locale: 'en_US',
      images: imageUrl
        ? [{ url: imageUrl, width: 800, height: 800, alt: name }]
        : [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — ${category} | LTIC SARL`,
      description,
      images: [imageUrl ?? `${SITE_URL}/og-image.png`],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  const imageUrl = absoluteImageUrl(product?.imageUrl);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: product?.nameEn ?? 'Product', item: `${SITE_URL}/products/${params.slug}` },
    ],
  };

  const productLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameEn,
    description: product.descriptionEn ?? '',
    image: imageUrl ? [imageUrl] : [],
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'LTIC SARL' },
    category: product.categoryName ?? 'Industrial Supply',
    url: `${SITE_URL}/products/${params.slug}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/quote`,
    },
    manufacturer: { '@id': `${SITE_URL}/#organization` },
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {productLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      )}
      <ProductDetailContent initialProduct={product} />
    </>
  );
}
