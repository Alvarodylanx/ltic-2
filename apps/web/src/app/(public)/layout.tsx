import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { CookieConsent } from '@/components/CookieConsent';
import { BackToTop } from '@/components/BackToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Minimal placeholder that preserves navbar height so the page doesn't jump
function NavbarFallback() {
  return <div className="h-16 w-full bg-white border-b border-border" aria-hidden="true" />;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Navbar isolated — a crash here keeps the rest of the page alive */}
      <ErrorBoundary fallback={<NavbarFallback />}>
        <Navbar />
      </ErrorBoundary>

      {/* Page content isolated — a crash here keeps Navbar/Footer alive */}
      <ErrorBoundary>
        <main id="main-content">{children}</main>
      </ErrorBoundary>

      {/* Footer isolated */}
      <ErrorBoundary fallback={null}>
        <Footer />
      </ErrorBoundary>

      {/* Non-critical UI — silently hidden on failure, never breaks the page */}
      <ErrorBoundary fallback={null}>
        <WhatsAppButton />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <BackToTop />
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <CookieConsent />
      </ErrorBoundary>
    </>
  );
}
