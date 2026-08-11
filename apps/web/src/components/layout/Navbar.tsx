'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';
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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Transparent glass only on the homepage hero — goes solid on scroll or other pages
  const isHome = pathname === '/';
  const glass = isHome && !scrolled;

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'sticky top-0 z-50 h-16 flex items-center transition-all duration-500',
        glass
          ? 'bg-white/[0.06] backdrop-blur-2xl border-b border-white/[0.12] shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : scrolled
            ? 'bg-white/92 backdrop-blur-xl border-b border-border/60 shadow-[0_4px_24px_rgba(0,0,0,0.07)]'
            : 'bg-white border-b border-border',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group"
          style={{ paddingTop: '4px', paddingBottom: '4px' }}
          aria-label="LTIC SARL — Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ltic-logo.png"
            alt="LTIC SARL"
            className={cn(
              'h-9 w-auto object-contain translate-x-2 transition-all duration-300',
              glass ? 'brightness-0 invert' : '',
            )}
          />
          <span className={cn('font-bold text-lg transition-colors duration-300', glass ? 'text-white' : '')}>
            LTIC{' '}
            <span className="text-primary">SARL</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-sm',
                glass
                  ? isActive(link.href)
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                  : isActive(link.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {L(link)}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-1 left-3.5 right-3.5 h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
            className={cn(
              'flex items-center gap-1.5 px-4 h-9 border rounded-full text-xs font-semibold transition-all duration-200',
              glass
                ? 'border-white/30 text-white/80 hover:text-white hover:border-white/60 hover:bg-white/10'
                : 'border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5',
            )}
          >
            <Globe className="h-3.5 w-3.5" />
            {language.toUpperCase()}
          </button>

          <Button asChild size="sm" className="font-semibold text-xs px-5 h-9 shadow-md shadow-primary/25">
            <Link href="/quote">{L({ en: 'Request Quote', fr: 'Demander un Devis' })}</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            'lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-sm transition-colors',
            glass ? 'text-white hover:bg-white/10' : 'hover:bg-muted',
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mobileOpen ? 'x' : 'menu'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'lg:hidden absolute top-16 left-0 right-0 border-b z-50',
              glass
                ? 'bg-black/70 backdrop-blur-xl border-white/10'
                : 'bg-white border-border shadow-lg',
            )}
          >
            <div className="px-4 py-4 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 rounded-sm text-sm font-medium transition-colors',
                    glass
                      ? isActive(link.href)
                        ? 'text-white bg-white/10 border-l-2 border-primary'
                        : 'text-white/75 hover:text-white hover:bg-white/10'
                      : isActive(link.href)
                        ? 'text-foreground bg-muted border-l-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  {L(link)}
                </Link>
              ))}
              <div className={cn(
                'flex items-center gap-2.5 pt-3 mt-2 border-t',
                glass ? 'border-white/10' : 'border-border',
              )}>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
                  className={cn(
                    'flex items-center gap-1.5 px-4 h-9 border rounded-full text-xs font-semibold transition-all duration-200',
                    glass
                      ? 'border-white/30 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/10'
                      : 'border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5',
                  )}
                >
                  <Globe className="h-3.5 w-3.5" />
                  {language.toUpperCase()}
                </button>
                <Button asChild size="sm" className="font-semibold text-xs px-5 h-9 shadow-sm shadow-primary/20">
                  <Link href="/quote">{L({ en: 'Request Quote', fr: 'Demander un Devis' })}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
