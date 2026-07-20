'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, ArrowUpRight, Globe2, Ship, Factory, BarChart3,
  Handshake, TreePine, Shield, Zap, TrendingUp, Package,
  FileText, Clock, Truck, ChevronLeft, ChevronRight, MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import {
  fadeInUp, fadeInLeft, fadeInRight, scaleIn,
  stagger, staggerFast, viewportOnce,
} from '@/components/motion/variants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=80',
    alt:   { en: 'Cargo logistics at port', fr: 'Logistique cargo au port' },
    tag:   { en: 'Global Logistics', fr: 'Logistique Mondiale' },
    line1: { en: 'Moving Cargo', fr: 'Transport de Fret' },
    line2: { en: 'Across Continents.', fr: 'Sur Tous les Continents.' },
    cta:   { en: 'Request a Quote', fr: 'Demander un Devis', href: '/quote' },
  },
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1800&auto=format&fit=crop&q=80',
    alt:   { en: 'Industrial supply equipment', fr: 'Équipements industriels' },
    tag:   { en: 'Industrial Supply', fr: 'Fourniture Industrielle' },
    line1: { en: 'Premium Equipment.', fr: 'Équipements Premium.' },
    line2: { en: 'Delivered to Spec.', fr: 'Livrés selon Spec.' },
    cta:   { en: 'Browse Products', fr: 'Voir les Produits', href: '/products' },
  },
  {
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1800&auto=format&fit=crop&q=80',
    alt:   { en: 'Shipping containers at sea', fr: 'Conteneurs maritimes' },
    tag:   { en: 'Import & Export', fr: 'Import & Export' },
    line1: { en: 'Seamless Trade.', fr: 'Commerce Fluide.' },
    line2: { en: 'Zero Borders.', fr: 'Sans Frontières.' },
    cta:   { en: 'Our Services', fr: 'Nos Services', href: '/services' },
  },
  {
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&auto=format&fit=crop&q=80',
    alt:   { en: 'Business partnership', fr: 'Partenariat commercial' },
    tag:   { en: 'Strategic Partnerships', fr: 'Partenariats Stratégiques' },
    line1: { en: 'Your Gateway', fr: 'Votre Porte d\'Entrée' },
    line2: { en: 'to New Markets.', fr: 'vers de Nouveaux Marchés.' },
    cta:   { en: 'Partner With Us', fr: 'Devenez Partenaire', href: '/contact' },
  },
  {
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1800&auto=format&fit=crop&q=80',
    alt:   { en: 'Warehouse operations', fr: 'Opérations en entrepôt' },
    tag:   { en: 'Supply Chain', fr: 'Chaîne Logistique' },
    line1: { en: 'Cut Cost.', fr: 'Réduisez les Coûts.' },
    line2: { en: 'Gain Speed.', fr: 'Gagnez en Vitesse.' },
    cta:   { en: 'Get a Quote', fr: 'Obtenir un Devis', href: '/quote' },
  },
];

const statDefs = [
  { key: 'stat_countries', fallback: '30+',  en: 'Countries Served',  fr: 'Pays Couverts' },
  { key: 'stat_clients',   fallback: '500+', en: 'Active Clients',    fr: 'Clients Actifs' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years of Operation',fr: "Années d'Activité" },
  { key: 'stat_shipments', fallback: '10K+', en: 'Shipments Complete',fr: 'Expéditions Réalisées' },
];

const services = [
  { icon: Ship,      en: 'Logistics & Transit',           fr: 'Logistique & Transit',               descEn: 'End-to-end freight forwarding, customs clearance and international transit — air, sea, road.',  descFr: 'Freight forwarding complet, dédouanement et transit international — air, mer, route.' },
  { icon: Globe2,    en: 'Import & Export',                fr: 'Import & Export',                    descEn: 'Cross-border trade facilitation with expert compliance, documentation and sourcing.',            descFr: 'Facilitation du commerce avec conformité experte, documentation et sourcing.' },
  { icon: Factory,   en: 'Industrial Supply',              fr: 'Fourniture Industrielle',            descEn: 'Generators, lubricants, filters and heavy materials — certified Total, Shell and OEM brands.',   descFr: 'Générateurs, lubrifiants, filtres et matériaux lourds — marques OEM certifiées.' },
  { icon: TreePine,  en: 'Timber & Trade',                 fr: 'Bois & Commerce',                   descEn: 'Certified tropical timber and logs sourced for international construction markets.',              descFr: 'Bois tropicaux certifiés pour la construction internationale.' },
  { icon: BarChart3, en: 'Supply Chain Consulting',        fr: "Conseil Chaîne d'Approvisionnement", descEn: 'Strategic procurement and logistics optimization for enterprises in complex global markets.',     descFr: 'Optimisation stratégique des achats et logistique pour marchés complexes.' },
  { icon: Handshake, en: 'Commercial Representation',      fr: 'Représentation Commerciale',         descEn: 'Brand representation, joint ventures and strategic distribution partnerships worldwide.',         descFr: 'Représentation de marque, coentreprises et partenariats de distribution.' },
];

const regions = [
  { en: 'West & Central Africa', fr: 'Afrique de l\'Ouest & Centrale' },
  { en: 'Europe',                fr: 'Europe' },
  { en: 'Middle East',           fr: 'Moyen-Orient' },
  { en: 'Americas',              fr: 'Amériques' },
];

const orderSteps = [
  { icon: Package,  title: { en: 'Browse Catalog',     fr: 'Parcourez le Catalogue' },  desc: { en: 'Explore our full range of industrial products and services.', fr: 'Explorez notre gamme complète de produits et services.' },               action: { en: 'View Catalog',   fr: 'Voir le Catalogue' },   href: '/products' },
  { icon: FileText, title: { en: 'Request a Quote',    fr: 'Demandez un Devis' },        desc: { en: 'Submit your requirements — takes under 2 minutes.', fr: 'Soumettez vos besoins — moins de 2 minutes.' },                                     action: { en: 'Get a Quote',    fr: 'Obtenir un Devis' },    href: '/quote' },
  { icon: Clock,    title: { en: 'Receive an Offer',   fr: 'Recevez une Offre' },        desc: { en: 'Custom pricing with full freight costs within 24–48 h.', fr: 'Offre personnalisée avec frais de transport sous 24–48h.' },                   action: null, href: null },
  { icon: Truck,    title: { en: 'We Handle the Rest', fr: 'Nous Gérons le Reste' },     desc: { en: 'Customs, freight, logistics — tracked in real time.', fr: 'Douanes, fret, logistique — suivi en temps réel.' },                             action: { en: 'Track Shipment', fr: 'Suivre la Livraison' }, href: '/tracking' },
];

// ─── HeroCarousel ─────────────────────────────────────────────────────────────

function HeroCarousel() {
  const { L } = useLanguage();
  const shouldReduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback((dir: 1 | -1) => {
    setCurrent(prev => (prev + dir + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (shouldReduce || paused) return;
    const id = setInterval(() => advance(1), 6000);
    return () => clearInterval(id);
  }, [advance, paused, shouldReduce]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative min-h-dvh bg-sidebar flex flex-col justify-end overflow-hidden"
      aria-label={L({ en: 'Hero slideshow', fr: 'Diaporama principal' })}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-bleed background — Ken Burns entrance on slide change */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={shouldReduce ? false : { opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={slide.image}
            alt={L(slide.alt)}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
          {/* Bottom-heavy gradient — text always readable, top shows the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/85 to-sidebar/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar/90 via-sidebar/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Dot grid atmosphere */}
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

      {/* Slide counter — top right */}
      <div className="absolute top-6 right-6 sm:right-10 hidden sm:flex items-center gap-2 z-10 select-none">
        <span className="font-display font-bold text-[10px] tabular-nums tracking-[0.2em] text-sidebar-foreground/25">
          {String(current + 1).padStart(2, '0')}
        </span>
        <span className="w-6 h-px bg-sidebar-foreground/15" />
        <span className="font-display font-bold text-[10px] tabular-nums tracking-[0.2em] text-sidebar-foreground/15">
          {String(heroSlides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Vertical nav — right rail, desktop only */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className="flex items-center justify-center w-6 h-6 focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          >
            <span
              className={`block rounded-full transition-all duration-500
                ${i === current
                  ? 'w-1 h-8 bg-primary'
                  : 'w-0.5 h-3 bg-sidebar-foreground/30 hover:bg-sidebar-foreground/60'}`}
            />
          </button>
        ))}
      </div>

      {/* ── Main content — bottom-pinned, enormous typography ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24 lg:pb-28 pt-32 w-full">

        {/* Tag line */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`tag-${current}`}
            initial={shouldReduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="w-8 h-px bg-primary flex-shrink-0" />
            <span className="font-display font-semibold text-[11px] sm:text-xs uppercase tracking-[0.25em] text-blue-400">
              {L(slide.tag)}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Headline — two staggered lines, massive */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`h-${current}`} className="mb-8 overflow-hidden">
            <motion.h1
              initial={shouldReduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.18 } }}
              transition={{ duration: 0.58, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-extrabold text-sidebar-foreground leading-[0.98] tracking-tight
                         text-[2.6rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
            >
              <span className="block">{L(slide.line1)}</span>
              <motion.span
                className="block text-sidebar-foreground/70"
                initial={shouldReduce ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.52, delay: 0.13, ease: [0.22, 1, 0.36, 1] }}
              >
                {L(slide.line2)}
              </motion.span>
            </motion.h1>
          </motion.div>
        </AnimatePresence>

        {/* CTA row */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`cta-${current}`}
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.42, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button asChild size="lg"
              className="font-display font-bold rounded-sm text-sm h-12 px-8 shadow-none">
              <Link href={slide.cta.href}>
                {L({ en: slide.cta.en, fr: slide.cta.fr })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="font-display font-semibold rounded-sm text-sm h-12 px-8 bg-transparent
                         border-sidebar-foreground/20 text-sidebar-foreground
                         hover:bg-sidebar-foreground/8 hover:border-sidebar-foreground/45">
              <Link href="/services">{L({ en: 'Our Services', fr: 'Nos Services' })}</Link>
            </Button>

            {/* Mobile dot nav */}
            <div className="flex items-center gap-2 ml-auto lg:hidden">
              <button onClick={() => advance(-1)} aria-label={L({ en: 'Previous', fr: 'Précédent' })}
                className="w-9 h-9 rounded-full border border-sidebar-foreground/20 bg-sidebar/60
                           hover:bg-sidebar-foreground/10 flex items-center justify-center
                           focus-visible:ring-2 focus-visible:ring-primary transition-colors">
                <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
              </button>
              <div className="flex gap-1.5">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary
                      ${i === current ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-sidebar-foreground/30'}`}
                  />
                ))}
              </div>
              <button onClick={() => advance(1)} aria-label={L({ en: 'Next', fr: 'Suivant' })}
                className="w-9 h-9 rounded-full border border-sidebar-foreground/20 bg-sidebar/60
                           hover:bg-sidebar-foreground/10 flex items-center justify-center
                           focus-visible:ring-2 focus-visible:ring-primary transition-colors">
                <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      {!shouldReduce && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-sidebar-foreground/10 z-10">
          <AnimatePresence mode="wait">
            {!paused && (
              <motion.div key={`bar-${current}`}
                className="h-full bg-primary origin-left"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 6, ease: 'linear' }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

// ─── StatCounter ──────────────────────────────────────────────────────────────

function StatCounter({ value }: { value: string }) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(() => {
    const m = value.match(/^(\d+)(.*)/);
    return m ? `0${m[2]}` : value;
  });

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^(\d+)(.*)/);
    if (!match) { setDisplay(value); return; }
    if (shouldReduce) { setDisplay(value); return; }
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1800;
    let raf = 0; let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${Math.round(eased * target)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, shouldReduce]);

  return <span ref={ref}>{display}</span>;
}

// ─── ServiceRow ───────────────────────────────────────────────────────────────

interface ServiceRowProps {
  icon: React.ElementType;
  index: number;
  en: string;
  fr: string;
  descEn: string;
  descFr: string;
}

function ServiceRow({ icon: Icon, index, en, fr, descEn, descFr }: ServiceRowProps) {
  const { L } = useLanguage();

  return (
    <motion.div variants={fadeInUp} className="group relative border-b border-border last:border-b-0">
      {/* Animated left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100
                      origin-top transition-transform duration-300 ease-out" />

      <Link
        href="/services"
        className="flex items-center gap-5 sm:gap-8 lg:gap-10 py-6 sm:py-7 lg:py-8
                   pl-0 group-hover:pl-3 transition-all duration-300 cursor-pointer"
      >
        {/* Large step number */}
        <span className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl tabular-nums
                         text-border group-hover:text-primary/25 transition-colors duration-300
                         flex-shrink-0 w-9 sm:w-12 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon pill */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-sm bg-foreground flex items-center justify-center
                        flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
          <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-extrabold text-lg sm:text-xl lg:text-2xl text-foreground
                         group-hover:text-primary transition-colors duration-300 leading-tight mb-1">
            {L({ en, fr })}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed hidden sm:block max-w-2xl">
            {L({ en: descEn, fr: descFr })}
          </p>
        </div>

        {/* Arrow — slides in on hover */}
        <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted-foreground/30
                                  group-hover:text-primary opacity-0 group-hover:opacity-100
                                  -translate-x-3 group-hover:translate-x-0
                                  transition-all duration-300" />
      </Link>
    </motion.div>
  );
}

// ─── PartnerCard ──────────────────────────────────────────────────────────────

interface Partner {
  id: number; name: string; logoUrl?: string;
  sectorEn: string; sectorFr: string;
}

function PartnerCard({ b }: { b: Partner }) {
  return (
    <div className="flex items-center gap-2.5 mx-3 px-4 py-3 bg-sidebar-accent/50 border border-sidebar-border
                    rounded-sm hover:border-primary/50 hover:bg-sidebar-accent/80
                    transition-colors duration-200 cursor-default flex-shrink-0">
      <div className="w-8 h-8 rounded-sm bg-sidebar border border-sidebar-border flex items-center justify-center
                      flex-shrink-0 overflow-hidden">
        {b.logoUrl
          ? <img src={b.logoUrl} alt={b.name} className="w-full h-full object-contain p-0.5" />
          : <span className="text-xs font-display font-extrabold text-primary">{b.name.charAt(0)}</span>}
      </div>
      <span className="font-display font-semibold text-xs text-sidebar-foreground/75 whitespace-nowrap">
        {b.name}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { L } = useLanguage();

  const { data: featuredProducts, isLoading } = useQuery<any[]>({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/api/products/featured'),
  });
  const { data: siteSettings } = useQuery<Record<string, string>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
    staleTime: 5 * 60 * 1000,
  });
  const { data: partners = [] } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: () => api.get('/api/partners'),
    staleTime: 5 * 60 * 1000,
  });

  const brandsRow1 = partners.filter((_, i) => i % 2 === 0);
  const brandsRow2 = partners.filter((_, i) => i % 2 === 1);

  const stats = statDefs.map(s => ({
    value: siteSettings?.[s.key] || s.fallback,
    en: s.en, fr: s.fr,
  }));

  return (
    <>
      {/* ── 1. Hero carousel ── */}
      <HeroCarousel />

      {/* ── 2. Stats — colossal numbers ── */}
      <section className="bg-sidebar border-t border-sidebar-border relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/40" />

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                     grid grid-cols-2 lg:grid-cols-4 gap-px bg-sidebar-border"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="relative flex flex-col items-center justify-center px-6 py-14 sm:py-16 text-center
                         bg-sidebar group hover:bg-sidebar-accent/25 transition-colors duration-300"
            >
              {/* Top accent bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0
                              group-hover:scale-x-100 origin-left transition-transform duration-400" />

              <span className="font-display font-extrabold tabular-nums leading-none
                               text-5xl sm:text-6xl lg:text-7xl text-sidebar-foreground mb-3
                               group-hover:text-primary transition-colors duration-300">
                <StatCounter value={stat.value} />
              </span>
              <span className="text-sidebar-foreground/35 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold">
                {L(stat)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 3. Services — editorial numbered list ── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-3">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-primary font-display font-semibold text-[11px] uppercase tracking-[0.22em] mb-4">
                {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
              </p>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight
                             leading-[1.0] text-foreground [text-wrap:balance] max-w-lg">
                {L({ en: 'Six Ways We Move Business Forward', fr: 'Six Façons d\'Accélérer Votre Business' })}
              </h2>
            </motion.div>
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="flex-shrink-0">
              <Button asChild variant="outline" className="rounded-sm font-display font-bold text-sm">
                <Link href="/services">
                  {L({ en: 'All Services', fr: 'Tous les Services' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="h-px bg-border mb-2" />

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            {services.map((svc, i) => (
              <ServiceRow
                key={svc.en}
                icon={svc.icon}
                index={i}
                en={svc.en}
                fr={svc.fr}
                descEn={svc.descEn}
                descFr={svc.descFr}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. Partners marquee — dark band ── */}
      <section className="bg-sidebar border-y border-sidebar-border py-12 overflow-hidden relative">
        <p className="text-center text-sidebar-foreground/30 text-[10px] uppercase tracking-[0.25em] font-semibold mb-8">
          {L({ en: 'Trusted by leading brands worldwide', fr: 'Reconnu par les grandes marques mondiales' })}
        </p>

        <div className="marquee-wrap space-y-2.5 select-none">
          <div className="flex w-max marquee-left">
            {[...brandsRow1, ...brandsRow1].map((b, i) => <PartnerCard key={i} b={b} />)}
          </div>
          <div className="flex w-max marquee-right">
            {[...brandsRow2, ...brandsRow2].map((b, i) => <PartnerCard key={i} b={b} />)}
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 top-0 h-full w-20
                        bg-gradient-to-r from-sidebar to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20
                        bg-gradient-to-l from-sidebar to-transparent z-10" />
      </section>

      {/* ── 5. Global Reach + Featured Products — asymmetric ── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">

            {/* Left — sticky network summary */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="lg:sticky lg:top-24 space-y-7"
            >
              <div>
                <p className="text-primary font-display font-semibold text-[11px] uppercase tracking-[0.22em] mb-4">
                  {L({ en: 'Our Reach', fr: 'Notre Portée' })}
                </p>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-5
                               leading-[1.05] text-foreground">
                  {L({ en: 'One Partner.\nFour Continents.', fr: 'Un Partenaire.\nQuatre Continents.' })}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {L({
                    en: 'LTIC SARL operates across Africa, Europe, the Middle East and the Americas — freight, supply, consulting and trade under one roof.',
                    fr: 'LTIC SARL opère en Afrique, Europe, Moyen-Orient et Amériques — fret, fourniture, conseil et commerce sous un même toit.',
                  })}
                </p>
              </div>

              {/* Numbered region list */}
              <ul className="border border-border rounded-sm overflow-hidden">
                {regions.map(({ en, fr }, i) => (
                  <li key={en}
                    className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0
                               bg-card hover:bg-muted/50 transition-colors duration-150">
                    <span className="font-display font-extrabold text-[10px] tabular-nums text-primary/40 w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="font-display font-bold text-sm text-foreground">{L({ en, fr })}</span>
                  </li>
                ))}
              </ul>

              {/* Trust pillars */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Shield,     en: 'Reliable',       fr: 'Fiable' },
                  { icon: Globe2,     en: '30+ Countries',  fr: '30+ Pays' },
                  { icon: Zap,        en: 'Fast Customs',   fr: 'Douane Rapide' },
                  { icon: TrendingUp, en: 'Growth Partner', fr: 'Partenaire Croissance' },
                ].map(({ icon: Icon, en, fr }) => (
                  <div key={en}
                    className="flex items-center gap-2.5 bg-foreground rounded-sm px-3.5 py-3
                               hover:bg-sidebar-accent transition-colors duration-200">
                    <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-sidebar-foreground text-xs font-display font-bold">
                      {L({ en, fr })}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — featured products */}
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-primary font-display font-semibold text-[11px] uppercase tracking-[0.22em]">
                  {L({ en: 'Featured Products', fr: 'Produits en Vedette' })}
                </p>
                <Link href="/products"
                  className="inline-flex items-center gap-1 text-xs font-display font-bold
                             text-muted-foreground hover:text-primary transition-colors duration-150">
                  {L({ en: 'Browse all', fr: 'Voir tout' })}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {isLoading
                  ? Array(6).fill(0).map((_, i) => (
                      <div key={i} className="bg-card border border-border rounded-sm overflow-hidden">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-3 space-y-1.5">
                          <Skeleton className="h-2.5 w-12" />
                          <Skeleton className="h-3.5 w-full" />
                        </div>
                      </div>
                    ))
                  : featuredProducts?.slice(0, 6).map((product) => (
                      <motion.div
                        key={product.id}
                        variants={scaleIn}
                        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="group bg-card border border-border rounded-sm overflow-hidden
                                     hover:border-primary/50 transition-colors duration-200 block"
                        >
                          <div className="aspect-square relative bg-muted overflow-hidden">
                            {product.imageUrl && (
                              <Image
                                src={product.imageUrl}
                                alt={L({ en: product.nameEn, fr: product.nameFr })}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-3">
                            {product.categoryName && (
                              <span className="inline-block bg-primary/10 text-primary text-[10px] rounded-sm
                                               px-1.5 py-0.5 mb-1.5 font-semibold">
                                {product.categoryName}
                              </span>
                            )}
                            <h3 className="font-display font-bold text-xs leading-snug
                                           group-hover:text-primary transition-colors duration-150">
                              {L({ en: product.nameEn, fr: product.nameFr })}
                            </h3>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 6. Process — dark, overlapping border cards ── */}
      <section className="bg-foreground py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14"
          >
            <div>
              <p className="text-blue-400 font-display font-semibold text-[11px] uppercase tracking-[0.22em] mb-3">
                {L({ en: 'How It Works', fr: 'Comment Ça Marche' })}
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl
                             text-sidebar-foreground tracking-tight leading-tight">
                {L({ en: 'From Request\nto Delivery', fr: 'De la Demande\nà la Livraison' })}
              </h2>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-sidebar-border"
          >
            {orderSteps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative bg-sidebar p-7 sm:p-8 group
                           hover:bg-sidebar-accent/40 transition-colors duration-300"
              >
                {/* Giant watermark number */}
                <div className="font-display font-extrabold text-[5.5rem] leading-none tabular-nums
                                text-primary/8 group-hover:text-primary/18 transition-colors duration-400
                                mb-1 select-none -ml-1">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="w-11 h-11 rounded-sm bg-primary/10 flex items-center justify-center mb-5
                                group-hover:bg-primary transition-colors duration-300">
                  <step.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground
                                        transition-colors duration-300" />
                </div>

                <h3 className="font-display font-extrabold text-base text-sidebar-foreground mb-2 leading-tight">
                  {L(step.title)}
                </h3>
                <p className="text-sidebar-foreground/40 text-sm leading-relaxed mb-5">
                  {L(step.desc)}
                </p>

                {step.href && step.action && (
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1.5 text-primary text-xs font-display font-bold
                               hover:gap-3 transition-all duration-200"
                  >
                    {L(step.action)} <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7. CTA — cinematic full-bleed ── */}
      <section className="relative bg-sidebar py-28 sm:py-36 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&auto=format&fit=crop&q=60"
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar/95 via-sidebar/75 to-sidebar/90" />
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/70" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={fadeInUp}
              className="text-blue-400 font-display font-semibold text-[11px] uppercase tracking-[0.25em] mb-5">
              {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
            </motion.p>

            <motion.h2 variants={fadeInUp}
              className="font-display font-extrabold text-sidebar-foreground tracking-tight
                         leading-[1.0] mb-7 [text-wrap:balance]
                         text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              {L({ en: "Let's Move Your\nBusiness Forward.", fr: 'Faisons Avancer\nVotre Business.' })}
            </motion.h2>

            <motion.p variants={fadeInUp}
              className="text-sidebar-foreground/45 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              {L({
                en: 'From a single shipment to a full supply chain partnership — contact our team for a tailored quote.',
                fr: 'D\'une seule expédition à un partenariat logistique complet — contactez notre équipe.',
              })}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg"
                className="font-display font-bold rounded-sm h-12 px-8 text-sm shadow-none">
                <Link href="/contact">
                  {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="font-display font-bold rounded-sm h-12 px-8 text-sm bg-transparent
                           border-sidebar-foreground/25 text-sidebar-foreground
                           hover:bg-sidebar-foreground/10 hover:border-sidebar-foreground/45">
                <Link href="/quote">{L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
