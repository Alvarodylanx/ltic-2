import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

// Only the two heaviest Barlow weights are preloaded — they appear above-the-fold
// in the hero headline. Lighter weights load on demand via browser font matching.
const barlow = localFont({
  src: [
    { path: '../../public/fonts/barlow-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/barlow-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/barlow-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/barlow-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/barlow-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  preload: false,
});

// Same for Jakarta: 400 + 500 are manually preloaded below; rest load on demand.
const jakarta = localFont({
  src: [
    { path: '../../public/fonts/jakarta-300.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/jakarta-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/jakarta-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/jakarta-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/jakarta-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/jakarta-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  preload: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lticsarl.com';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'LTIC SARL — Logistics, Transit & Industrial Supply | Cameroon',
    template: '%s | LTIC SARL',
  },
  description: 'LTIC SARL delivers end-to-end freight forwarding, customs clearance, industrial equipment supply and international trade solutions across 30+ countries from Douala, Cameroon.',
  keywords: [
    'logistics cameroon', 'freight forwarding africa', 'industrial supply douala',
    'transit cameroon', 'import export africa', 'timber export cameroon',
    'customs clearance cameroon', 'supply chain africa', 'industrial equipment africa',
    'offshore logistics guinea', 'LTIC SARL', 'freight forwarder douala',
  ],
  authors: [{ name: 'LTIC SARL', url: SITE_URL }],
  creator: 'LTIC SARL',
  publisher: 'LTIC SARL',
  applicationName: 'LTIC SARL',
  category: 'logistics',
  alternates: { canonical: '/' },
  icons: {
    icon: '/ltic-logo.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'LTIC SARL — Logistics, Transit & Industrial Supply | Cameroon',
    description: 'End-to-end freight forwarding, customs clearance, industrial supply and international trade across 30+ countries — based in Douala, Cameroon.',
    type: 'website',
    url: SITE_URL,
    siteName: 'LTIC SARL',
    locale: 'en_US',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'LTIC SARL — Global Logistics & Industrial Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lticsarl',
    title: 'LTIC SARL — Logistics, Transit & Industrial Supply | Cameroon',
    description: 'End-to-end freight forwarding, customs clearance, industrial supply and international trade across 30+ countries — based in Douala, Cameroon.',
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? undefined,
  },
};

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'Corporation'],
      '@id': `${SITE_URL}/#organization`,
      name: 'LTIC SARL',
      alternateName: ['Logistics and Transit International', 'LTIC Cameroon'],
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: `${SITE_URL}/ltic-logo.png`,
        width: 512,
        height: 512,
        caption: 'LTIC SARL',
      },
      image: { '@id': `${SITE_URL}/#logo` },
      description: 'LTIC SARL (Logistics and Transit International) is a Cameroonian multinational providing freight forwarding, customs clearance, industrial supply, import/export, and international trade services across 30+ countries.',
      foundingDate: '2019',
      foundingLocation: 'Douala, Cameroon',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Douala',
        addressRegion: 'Littoral',
        addressCountry: 'CM',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@lticsarl.com',
        availableLanguage: ['English', 'French'],
      },
      areaServed: [
        { '@type': 'Country', 'name': 'Cameroon' },
        { '@type': 'Country', 'name': 'Nigeria' },
        { '@type': 'Country', 'name': 'Ghana' },
        { '@type': 'Country', 'name': 'Côte d\'Ivoire' },
        { '@type': 'Country', 'name': 'France' },
        { '@type': 'Country', 'name': 'China' },
        { '@type': 'Country', 'name': 'United States' },
      ],
      knowsAbout: [
        'Freight Forwarding', 'International Logistics', 'Customs Clearance',
        'Industrial Supply', 'Timber Export', 'Import Export Africa',
        'Supply Chain Management', 'Offshore Logistics', 'Gulf of Guinea',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'LTIC SARL Industrial Products & Logistics Services',
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'LTIC SARL',
      description: 'Global Logistics & Industrial Solutions from Cameroon',
      inLanguage: ['en', 'fr'],
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Manually preload the 4 above-the-fold critical fonts only */}
        <link rel="preload" href="/fonts/barlow-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/barlow-800.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/jakarta-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/jakarta-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Warm up connections used at load time */}
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className={`${barlow.variable} ${jakarta.variable}`} suppressHydrationWarning>
        <Providers>{children}</Providers>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
