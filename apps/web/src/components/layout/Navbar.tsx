'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, Info, Briefcase, Package, Navigation, Newspaper, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const navLinks = [
  { href: '/about',    en: 'About',    fr: 'À Propos',   icon: Info },
  { href: '/services', en: 'Services', fr: 'Services',   icon: Briefcase },
  { href: '/products', en: 'Products', fr: 'Produits',   icon: Package },
  { href: '/tracking', en: 'Tracking', fr: 'Suivi',      icon: Navigation },
  { href: '/news',     en: 'News',     fr: 'Actualités', icon: Newspaper },
  { href: '/contact',  en: 'Contact',  fr: 'Contact',    icon: Phone },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const pathname                     = usePathname();
  const { language, setLanguage, L } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full pt-3 transition-all duration-500"
    >
      {/* ── Floating glass pill ──────────────────────────────────────── */}
      <div
        className={cn(
          'relative flex items-center h-[60px] px-4 sm:px-5',
          'max-w-5xl mx-auto rounded-full transition-all duration-500',
          'bg-white/70 backdrop-blur-xl border border-white/60',
          scrolled
            ? 'shadow-2xl shadow-black/[0.12]'
            : 'shadow-lg shadow-black/[0.07]',
        )}
      >
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 pl-2"
          aria-label="LTIC SARL — Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ltic-logo.png"
            alt="LTIC SARL"
            className="h-7 w-auto object-contain"
          />
          <span className="font-bold text-sm leading-none">
            LTIC <span className="text-primary">SARL</span>
          </span>
        </Link>

        {/* ── Desktop nav links — centered ─────────────────────────── */}
        <nav
          className="hidden lg:flex flex-1 items-center justify-center gap-0.5"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 rounded-full',
                isActive(link.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-black/5',
              )}
            >
              {L(link)}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* ── Desktop right actions ─────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-2 ml-auto">
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
            className="flex items-center gap-1.5 px-3 h-7 border border-border rounded-full text-[11px] font-semibold text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            <Globe className="h-3 w-3" />
            {language.toUpperCase()}
          </button>

          <Button
            asChild
            size="sm"
            className="font-semibold text-[11px] px-4 h-7 shadow-sm shadow-primary/20"
          >
            <Link href="/quote">{L({ en: 'Request Quote', fr: 'Demander un Devis' })}</Link>
          </Button>
        </div>

        {/* ── Mobile hamburger ─────────────────────────────────────── */}
        <button
          className="lg:hidden ml-auto p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
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

      {/* ── Mobile dropdown ──────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto mt-2 bg-white/85 backdrop-blur-xl rounded-[28px] border border-white/60 shadow-2xl shadow-black/10 overflow-hidden"
          >
            <div className="px-3 pt-3 pb-3">
              <div className="grid grid-cols-2 gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors',
                        isActive(link.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-black/5',
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {L(link)}
                    </Link>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 pt-3 mt-2 border-t border-black/8">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
                  className="flex items-center gap-1.5 px-4 h-9 border border-border rounded-full text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {language.toUpperCase()}
                </button>
                <Button asChild size="sm" className="flex-1 font-semibold text-xs h-9 shadow-sm shadow-primary/20">
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
