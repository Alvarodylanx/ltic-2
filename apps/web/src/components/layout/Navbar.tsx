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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    /* Outer wrapper — transparent, sticky, provides the top gap + side padding */
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 px-3 sm:px-5 lg:px-8 pt-3"
    >
      {/* Floating pill — the visible navbar */}
      <div
        className={cn(
          'relative flex items-center h-[60px] px-4 sm:px-5',
          'bg-white rounded-2xl border border-border/70',
          'transition-shadow duration-300',
          scrolled
            ? 'shadow-xl shadow-black/[0.09]'
            : 'shadow-md shadow-black/[0.05]',
        )}
      >
        {/* Thin primary accent line on the left rounded edge */}
        <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-full" />

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 pl-3"
          aria-label="LTIC SARL — Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ltic-logo.png"
            alt="LTIC SARL"
            className="h-8 w-auto object-contain"
          />
          <span className="font-bold text-base leading-none">
            LTIC <span className="text-primary">SARL</span>
          </span>
        </Link>

        {/* Desktop nav links — centered */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg',
                isActive(link.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
              )}
            >
              {L(link)}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden lg:flex items-center gap-2 ml-auto">
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
            className="flex items-center gap-1.5 px-3.5 h-8 border border-border rounded-full
                       text-xs font-semibold text-muted-foreground
                       hover:text-primary hover:border-primary/50 hover:bg-primary/5
                       transition-all duration-200"
          >
            <Globe className="h-3.5 w-3.5" />
            {language.toUpperCase()}
          </button>
          <Button
            asChild
            size="sm"
            className="font-semibold text-xs px-5 h-8 rounded-xl shadow-sm shadow-primary/20"
          >
            <Link href="/quote">{L({ en: 'Request Quote', fr: 'Demander un Devis' })}</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden ml-auto p-2 min-h-[40px] min-w-[40px] flex items-center
                     justify-center rounded-xl hover:bg-muted transition-colors"
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

      {/* Mobile dropdown — floats below the pill, same horizontal inset */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 bg-white rounded-2xl border border-border shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-foreground bg-muted border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  )}
                >
                  {L(link)}
                </Link>
              ))}
              <div className="flex items-center gap-2.5 pt-3 mt-2 border-t border-border">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
                  className="flex items-center gap-1.5 px-4 h-9 border border-border rounded-full
                             text-xs font-semibold text-muted-foreground
                             hover:text-primary hover:border-primary/50 hover:bg-primary/5
                             transition-all duration-200"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {language.toUpperCase()}
                </button>
                <Button asChild size="sm" className="font-semibold text-xs px-5 h-9 shadow-sm shadow-primary/20 rounded-xl">
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
