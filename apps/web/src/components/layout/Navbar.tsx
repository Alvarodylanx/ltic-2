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
  { href: '/about',    en: 'About',    fr: 'À Propos',    icon: Info },
  { href: '/services', en: 'Services', fr: 'Services',    icon: Briefcase },
  { href: '/products', en: 'Products', fr: 'Produits',    icon: Package },
  { href: '/tracking', en: 'Tracking', fr: 'Suivi',       icon: Navigation },
  { href: '/news',     en: 'News',     fr: 'Actualités',  icon: Newspaper },
  { href: '/contact',  en: 'Contact',  fr: 'Contact',     icon: Phone },
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

  const isActive  = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isHome    = pathname === '/';
  const transparent = isHome && !scrolled;

  return (
    /* Outer — provides sticky anchor + top gap only */
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        transparent ? 'pt-0' : 'pt-3',
      )}
    >
      {/* ── Floating pill — constrained width, centered ─────────────── */}
      <div
        className={cn(
          'relative flex items-center h-[60px] transition-all duration-500',
          /* Centre the pill and cap its width */
          transparent
            ? 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'
            : 'max-w-5xl mx-auto px-4 sm:px-5',
          transparent
            ? 'bg-transparent border-transparent shadow-none rounded-none'
            : cn(
                'bg-white/70 backdrop-blur-xl border border-white/60 rounded-full',
                scrolled
                  ? 'shadow-2xl shadow-black/[0.12]'
                  : 'shadow-lg shadow-black/[0.07]',
              ),
        )}
      >
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 pl-3"
          aria-label="LTIC SARL — Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ltic-logo.png"
            alt="LTIC SARL"
            className={cn(
              'h-7 w-auto object-contain transition-all duration-500',
              transparent ? 'brightness-0 invert' : '',
            )}
          />
          <span className={cn(
            'font-bold text-sm leading-none transition-colors duration-500',
            transparent ? 'text-white' : '',
          )}>
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
                transparent
                  ? isActive(link.href)
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                  : isActive(link.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
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
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
            className={cn(
              'flex items-center gap-1.5 px-3 h-7 border rounded-full text-[11px] font-semibold transition-all duration-200',
              transparent
                ? 'border-white/30 text-white/80 hover:text-white hover:border-white/60 hover:bg-white/10'
                : 'border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5',
            )}
          >
            <Globe className="h-3 w-3" />
            {language.toUpperCase()}
          </button>

          {/* Request Quote — rounded-full comes from Button base class */}
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
          className={cn(
            'lg:hidden ml-auto p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full transition-colors',
            transparent ? 'text-white hover:bg-white/10' : 'hover:bg-muted',
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

      {/* ── Mobile dropdown — compact 2-col grid ────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl mx-auto mt-2 bg-white/85 backdrop-blur-xl rounded-[24px] border border-white/60 shadow-2xl shadow-black/10 overflow-hidden"
          >
            <div className="px-3 pt-3 pb-3">
              {/* 2-column grid of nav items */}
              <div className="grid grid-cols-2 gap-1.5">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.18 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-150',
                          active
                            ? 'bg-primary text-white shadow-sm shadow-primary/30'
                            : 'text-foreground/70 hover:text-foreground hover:bg-muted/70',
                        )}
                      >
                        <Icon className={cn('h-3.5 w-3.5 flex-shrink-0', active ? 'text-white' : 'text-primary')} />
                        {L(link)}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom row: lang + CTA */}
              <div className="flex items-center gap-2 pt-2.5 mt-2 border-t border-black/[0.06]">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  aria-label={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
                  className="flex items-center gap-1.5 px-3.5 h-8 border border-border rounded-full text-[11px] font-semibold text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <Globe className="h-3 w-3" />
                  {language.toUpperCase()}
                </button>
                <Button
                  asChild
                  size="sm"
                  className="flex-1 font-semibold text-[11px] h-8 shadow-sm shadow-primary/20 rounded-full"
                >
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
