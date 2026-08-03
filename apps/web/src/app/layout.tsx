import type { Metadata } from 'next';
import localFont from 'next/font/local';
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

export const metadata: Metadata = {
  title: 'LTIC SARL — Global Logistics & Industrial Solutions',
  description: 'LTIC SARL (Logistics and Transit International) is a Cameroonian multinational company specializing in logistics, transit, industrial supply, import/export facilitation, and international trade services across 30+ countries.',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'LTIC SARL — Global Logistics & Industrial Solutions',
    description: 'Reliable logistics, transit, industrial supply, and international trade services for modern businesses and global markets.',
    type: 'website',
    url: SITE_URL,
    siteName: 'LTIC SARL',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LTIC SARL — Global Logistics' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LTIC SARL — Global Logistics & Industrial Solutions',
    description: 'Reliable logistics, transit, industrial supply, and international trade services for modern businesses and global markets.',
    images: ['/og-image.png'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LTIC SARL',
  url: 'https://www.lticsarl.com',
  logo: 'https://www.lticsarl.com/logo.png',
  description: 'Logistics and Transit International SARL — based in Cameroon, providing logistics, transit, industrial supply, import/export, and international trade solutions across 30+ countries.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Douala',
    addressCountry: 'CM',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@lticsarl.com',
    availableLanguage: ['English', 'French'],
  },
  sameAs: [],
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
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${barlow.variable} ${jakarta.variable}`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
