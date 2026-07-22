import type { Metadata } from 'next';
import { Barlow_Condensed, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${barlow.variable} ${plusJakarta.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
