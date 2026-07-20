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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
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
            <span className="text-white font-bold text-sm">LT</span>
          </div>
          <span className={cn(
            'font-bold text-lg transition-colors duration-300',
            scrolled ? 'text-foreground' : 'text-sidebar-foreground',
          )}>
            LTIC <span className="text-primary">SARL</span>
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
                scrolled
                  ? isActive(link.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  : isActive(link.href)
                  ? 'text-sidebar-foreground'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground',
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

        {/* Mobile hamburger */}
        <button
          className={cn(
            'lg:hidden p-2 rounded-sm transition-colors',
            scrolled
              ? 'text-foreground hover:bg-muted'
              : 'text-sidebar-foreground hover:bg-sidebar-foreground/10',
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

      {/* Mobile menu — always opaque white */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg z-50"
          >
            <div className="px-4 py-4 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 rounded-sm text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-foreground bg-muted border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  {L(link)}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-3 mt-2 border-t border-border">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {language.toUpperCase()}
                </button>
                <Button asChild size="sm" className="font-semibold text-xs rounded-sm">
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
