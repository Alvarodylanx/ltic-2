'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const navLinks = [
  { href: '/about',    en: 'About',    fr: 'À Propos' },
  { href: '/services', en: 'Services', fr: 'Services' },
  { href: '/products', en: 'Products', fr: 'Produits' },
  { href: '/tracking', en: 'Tracking', fr: 'Suivi' },
  { href: '/news',     en: 'News',     fr: 'Actualités' },
  { href: '/contact',  en: 'Contact',  fr: 'Contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, L } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* ── Main sticky bar ── */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'sticky top-0 z-50 h-16 flex items-center transition-all duration-300',
          scrolled
            ? 'bg-white/98 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-sidebar border-b border-sidebar-border/30',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="LTIC SARL — Home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm select-none">LT</span>
            </div>
            <span className={cn(
              'font-bold text-lg transition-colors duration-300',
              scrolled ? 'text-foreground' : 'text-sidebar-foreground',
            )}>
              LTIC <span className="text-primary">SARL</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-sm',
                  scrolled
                    ? isActive(link.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    : isActive(link.href) ? 'text-sidebar-foreground' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground',
                )}
              >
                {L(link)}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-medium transition-colors',
                scrolled
                  ? 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  : 'border-sidebar-foreground/30 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:border-sidebar-foreground/60',
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              {language.toUpperCase()}
            </button>
            <Button asChild size="sm" className="font-semibold text-xs px-4 rounded-sm">
              <Link href="/quote">{L({ en: 'Request Quote', fr: 'Demander un Devis' })}</Link>
            </Button>
          </div>

          {/* Mobile hamburger — 44×44 touch target */}
          <button
            className={cn(
              'lg:hidden flex items-center justify-center w-11 h-11 rounded-sm transition-colors',
              scrolled
                ? 'text-foreground hover:bg-muted'
                : 'text-sidebar-foreground hover:bg-sidebar-foreground/10',
            )}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile drawer (fixed overlay, z above everything) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 bg-sidebar/80 backdrop-blur-sm z-[55]"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel — slides in from right */}
            <motion.div
              key="drawer"
              id="mobile-drawer"
              role="dialog"
              aria-label="Navigation menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[min(300px,88vw)] bg-sidebar z-[60] flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border/40 flex-shrink-0">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs select-none">LT</span>
                  </div>
                  <span className="font-bold text-sidebar-foreground">
                    LTIC <span className="text-primary">SARL</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex-1 overflow-y-auto py-3 px-3" aria-label="Mobile navigation">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045 + 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center justify-between px-4 py-3.5 rounded-sm text-sm font-medium transition-colors mb-0.5',
                        isActive(link.href)
                          ? 'bg-primary/15 text-primary border-l-2 border-primary pl-3.5'
                          : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-foreground/8',
                      )}
                    >
                      {L(link)}
                      {isActive(link.href) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer — lang + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="px-4 pb-6 pt-3 border-t border-sidebar-border/40 space-y-3 flex-shrink-0"
              >
                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
                  className="flex items-center gap-2.5 px-4 py-3 w-full rounded-sm border border-sidebar-foreground/20 text-sidebar-foreground/70 text-sm font-medium hover:bg-sidebar-foreground/8 hover:text-sidebar-foreground transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  {language === 'en' ? 'Passer en Français' : 'Switch to English'}
                </button>
                <Button asChild className="w-full font-display font-semibold text-sm rounded-sm">
                  <Link href="/quote" onClick={() => setMobileOpen(false)}>
                    {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
