'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, Globe2, Ship, Factory, BarChart3, Handshake, TreePine,
  Shield, Zap, TrendingUp, Package, FileText, Clock, Truck,
  ChevronLeft, ChevronRight, MapPin, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, stagger, staggerFast, viewportOnce } from '@/components/motion/variants';

// ─── Data ─────────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=80',
    alt:      { en: 'Cargo logistics at port',               fr: 'Logistique cargo au port' },
    eyebrow:  { en: 'Global Logistics & Transit',            fr: 'Logistique & Transit Mondial' },
    headline: { en: 'Global Logistics & Industrial Trade',   fr: 'Logistique Mondiale & Commerce Industriel' },
    accent:   { en: 'Built for Africa.',                      fr: "Conçu pour l'Afrique." },
    body:     { en: 'End-to-end freight, customs clearance, and transit across 30+ countries.', fr: 'Fret complet, dédouanement et transit dans 30+ pays.' },
    cta:      { en: 'Request a Quote', fr: 'Demander un Devis', href: '/quote' },
  },
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1800&auto=format&fit=crop&q=80',
    alt:      { en: 'Industrial supply equipment',           fr: 'Équipements fourniture industrielle' },
    eyebrow:  { en: 'Industrial Supply',                     fr: 'Fourniture Industrielle' },
    headline: { en: 'Premium Industrial Equipment',          fr: 'Équipements Industriels Premium' },
    accent:   { en: 'Delivered to Spec.',                    fr: 'Livré selon Spécifications.' },
    body:     { en: 'Generators, lubricants, filters — Total, Shell and leading OEM brands.', fr: 'Générateurs, lubrifiants, filtres — Total, Shell et grandes marques OEM.' },
    cta:      { en: 'Browse Products', fr: 'Voir les Produits', href: '/products' },
  },
  {
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1800&auto=format&fit=crop&q=80',
    alt:      { en: 'International shipping and freight',    fr: 'Fret et transport maritime' },
    eyebrow:  { en: 'Import & Export',                       fr: 'Import & Export' },
    headline: { en: 'Seamless Cross-Border Trade',          fr: 'Commerce Transfrontalier Fluide' },
    accent:   { en: 'Compliance. Speed. Precision.',         fr: 'Conformité. Vitesse. Précision.' },
    body:     { en: 'Expert customs, documentation and sourcing by air, sea and road.', fr: 'Douane, documentation et sourcing aérien, maritime et routier.' },
    cta:      { en: 'Our Services', fr: 'Nos Services', href: '/services' },
  },
  {
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&auto=format&fit=crop&q=80',
    alt:      { en: 'Business partnership',                  fr: 'Partenariat commercial' },
    eyebrow:  { en: 'Commercial Representation',             fr: 'Représentation Commerciale' },
    headline: { en: 'Your Gateway to New Markets',          fr: "Votre Porte d'Entrée vers de Nouveaux Marchés" },
    accent:   { en: 'Africa. Europe. Middle East.',          fr: 'Afrique. Europe. Moyen-Orient.' },
    body:     { en: 'Brand representation, joint ventures and distribution across emerging markets.', fr: 'Représentation, coentreprises et distribution sur marchés émergents.' },
    cta:      { en: 'Partner With Us', fr: 'Devenez Partenaire', href: '/contact' },
  },
  {
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1800&auto=format&fit=crop&q=80',
    alt:      { en: 'Warehouse and supply chain',            fr: 'Entrepôt et chaîne logistique' },
    eyebrow:  { en: 'Supply Chain Consulting',               fr: "Conseil Chaîne d'Approvisionnement" },
    headline: { en: 'Optimize Your Supply Chain',           fr: "Optimisez Votre Chaîne Logistique" },
    accent:   { en: 'Cut Cost. Gain Speed.',                 fr: 'Réduisez les Coûts. Gagnez en Vitesse.' },
    body:     { en: 'Strategic logistics consulting for enterprises in complex international markets.', fr: 'Conseil logistique stratégique pour marchés internationaux complexes.' },
    cta:      { en: 'Get a Quote', fr: 'Obtenir un Devis', href: '/quote' },
  },
];

const statDefs = [
  { key: 'stat_countries', fallback: '30+',  en: 'Countries',         fr: 'Pays' },
  { key: 'stat_clients',   fallback: '500+', en: 'Clients',           fr: 'Clients' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years Active',      fr: "Années d'Activité" },
  { key: 'stat_shipments', fallback: '10K+', en: 'Shipments Done',    fr: 'Expéditions Réalisées' },
];

const services = [
  { icon: Ship,      en: 'Logistics & Transit',           fr: 'Logistique & Transit',               descEn: 'End-to-end freight forwarding, customs and international transit — air, sea, road.',          descFr: 'Freight forwarding complet, douane et transit international — air, mer, route.' },
  { icon: Globe2,    en: 'Import & Export',                fr: 'Import & Export',                    descEn: 'Cross-border trade facilitation with compliance, documentation and sourcing.',                  descFr: 'Facilitation du commerce avec conformité, documentation et sourcing.' },
  { icon: Factory,   en: 'Industrial Supply',              fr: 'Fourniture Industrielle',            descEn: 'Generators, lubricants, filters and heavy materials — certified OEM brands.',                  descFr: 'Générateurs, lubrifiants, filtres et matériaux lourds — marques OEM certifiées.' },
  { icon: TreePine,  en: 'Timber & Trade',                 fr: 'Bois & Commerce',                   descEn: 'Certified tropical timber and logs for international construction markets.',                     descFr: 'Bois tropicaux certifiés pour la construction internationale.' },
  { icon: BarChart3, en: 'Supply Chain Consulting',        fr: "Conseil Chaîne d'Approvisionnement", descEn: 'Strategic procurement and logistics optimization for complex global markets.',                  descFr: 'Optimisation stratégique des achats et logistique pour marchés complexes.' },
  { icon: Handshake, en: 'Commercial Representation',      fr: 'Représentation Commerciale',         descEn: 'Brand representation, joint ventures and strategic distribution partnerships.',                  descFr: 'Représentation de marque, coentreprises et partenariats de distribution.' },
];

const regions = [
  { icon: MapPin, en: 'West & Central Africa',   fr: 'Afrique de l\'Ouest & Centrale' },
  { icon: MapPin, en: 'Europe',                   fr: 'Europe' },
  { icon: MapPin, en: 'Middle East',              fr: 'Moyen-Orient' },
  { icon: MapPin, en: 'Americas',                 fr: 'Amériques' },
];

const orderSteps = [
  { icon: Package,  title: { en: 'Browse Catalog',     fr: 'Parcourez le Catalogue' },    desc: { en: 'Explore our industrial products and services online.', fr: 'Explorez nos produits et services industriels.' },              action: { en: 'View Catalog',   fr: 'Voir le Catalogue' },   href: '/products' },
  { icon: FileText, title: { en: 'Request a Quote',    fr: 'Demandez un Devis' },         desc: { en: 'Submit your requirements — takes under 2 minutes.', fr: 'Soumettez vos besoins — moins de 2 minutes.' },                   action: { en: 'Get a Quote',    fr: 'Obtenir un Devis' },    href: '/quote' },
  { icon: Clock,    title: { en: 'Receive an Offer',   fr: 'Recevez une Offre' },         desc: { en: 'Custom pricing with freight costs within 24–48 h.', fr: 'Offre personnalisée avec frais de transport sous 24–48h.' },       action: null, href: null },
  { icon: Truck,    title: { en: 'We Handle the Rest', fr: 'Nous Gérons le Reste' },      desc: { en: 'Customs, freight, logistics — tracked in real time.', fr: 'Douanes, fret, logistique — suivi en temps réel.' },             action: { en: 'Track Shipment', fr: 'Suivre la Livraison' }, href: '/tracking' },
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
    const id = setInterval(() => advance(1), 5500);
    return () => clearInterval(id);
  }, [advance, paused, shouldReduce]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative min-h-[58vh] sm:min-h-[66vh] lg:min-h-[76vh] bg-sidebar flex items-center overflow-hidden"
      aria-label={L({ en: 'Hero slideshow', fr: 'Diaporama principal' })}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background — higher opacity + gradient that clears on the right */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85 }}
        >
          <Image
            src={slide.image}
            alt={L(slide.alt)}
            fill
            className="object-cover opacity-50"
            priority={current === 0}
            sizes="100vw"
          />
          {/* Left: solid dark for text legibility. Right: fades out to show image */}
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar/96 via-sidebar/70 to-sidebar/15" />
        </motion.div>
      </AnimatePresence>

      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:pl-12 w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`c-${current}`}
            className="max-w-2xl"
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              initial={shouldReduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.38, delay: 0.07 }}
              className="flex items-center gap-2 text-blue-400 font-display font-semibold text-xs sm:text-sm uppercase tracking-[0.18em] mb-4"
            >
              <span className="w-5 h-px bg-blue-400 flex-shrink-0" />
              {L(slide.eyebrow)}
            </motion.p>

            <motion.h1
              initial={shouldReduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.12 }}
              className="font-display font-bold text-sidebar-foreground leading-[1.06] tracking-tight mb-2
                         text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3.2rem] [text-wrap:balance]"
            >
              {L(slide.headline)}
            </motion.h1>

            <motion.p
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="text-primary font-display font-bold tracking-tight mb-4
                         text-lg sm:text-xl lg:text-2xl"
            >
              {L(slide.accent)}
            </motion.p>

            <motion.p
              initial={shouldReduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.24 }}
              className="text-sidebar-foreground/65 text-sm sm:text-base leading-relaxed mb-7 max-w-lg"
            >
              {L(slide.body)}
            </motion.p>

            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="font-display font-semibold rounded-sm shadow-none text-sm">
                <Link href={slide.cta.href}>
                  {L({ en: slide.cta.en, fr: slide.cta.fr })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="font-display font-semibold rounded-sm text-sm bg-transparent border-sidebar-foreground/25 text-sidebar-foreground hover:bg-white/8 hover:border-sidebar-foreground/45 hover:text-sidebar-foreground">
                <Link href="/services">{L({ en: 'Our Services', fr: 'Nos Services' })}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-3 z-10">
        <button onClick={() => advance(-1)}
          aria-label={L({ en: 'Previous', fr: 'Précédent' })}
          className="w-8 h-8 rounded-full border border-sidebar-foreground/20 bg-sidebar/50 hover:bg-sidebar-foreground/10 flex items-center justify-center transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary">
          <ChevronLeft className="h-3.5 w-3.5 text-sidebar-foreground" />
        </button>
        <div className="flex items-center gap-1.5" role="tablist">
          {heroSlides.map((_, i) => (
            <button key={i} role="tab" aria-selected={i === current}
              aria-label={`${L({ en: 'Slide', fr: 'Diapositive' })} ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary
                ${i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-sidebar-foreground/25 hover:bg-sidebar-foreground/50'}`}
            />
          ))}
        </div>
        <button onClick={() => advance(1)}
          aria-label={L({ en: 'Next', fr: 'Suivant' })}
          className="w-8 h-8 rounded-full border border-sidebar-foreground/20 bg-sidebar/50 hover:bg-sidebar-foreground/10 flex items-center justify-center transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary">
          <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-sidebar-foreground/10">
        {!shouldReduce && (
          <AnimatePresence mode="wait">
            {!paused && (
              <motion.div key={`bar-${current}`}
                className="h-full bg-primary origin-left"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 5.5, ease: 'linear' }}
              />
            )}
          </AnimatePresence>
        )}
      </div>
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
    const duration = 1500;
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

interface Partner {
  id: number; name: string; logoUrl?: string;
  sectorEn: string; sectorFr: string;
  productsEn?: string; productsFr?: string; website?: string;
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

      {/* ── 2. Stats strip — compact dark band, continues hero palette ── */}
      <section className="bg-sidebar border-t border-sidebar-border">
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                     grid grid-cols-2 md:grid-cols-4 divide-y-0 md:divide-x divide-sidebar-border"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex items-center gap-4 px-6 py-5 sm:py-6 group"
            >
              <span className="font-display font-bold tabular-nums leading-none text-3xl sm:text-4xl text-primary flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                <StatCounter value={stat.value} />
              </span>
              <span className="text-sidebar-foreground/45 text-xs uppercase tracking-widest font-medium leading-snug">
                {L(stat)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 3. Services — bento grid ── */}
      <section className="bg-background py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                {L({ en: 'Six Ways We Move Business Forward', fr: 'Six Façons d\'Accélérer Votre Business' })}
              </h2>
            </motion.div>
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce} className="flex-shrink-0">
              <Button asChild variant="outline" className="rounded-sm font-display font-semibold text-sm">
                <Link href="/services">
                  {L({ en: 'All Services', fr: 'Tous les Services' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Bento grid — first card is featured (2 cols wide on lg) */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {services.map(({ icon: Icon, ...svc }, i) => (
              <motion.div
                key={svc.en}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
                className={`group relative rounded-sm border overflow-hidden transition-colors duration-200
                  ${i === 0
                    ? 'lg:col-span-2 bg-sidebar border-sidebar-border hover:border-primary/60'
                    : 'bg-card border-border hover:border-primary/40'
                  }`}
              >
                {/* Hover accent line at top */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

                <div className="p-7 sm:p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-sm flex items-center justify-center
                      ${i === 0 ? 'bg-primary/20' : 'bg-foreground'}`}>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className={`font-display font-bold text-4xl leading-none tabular-nums
                      ${i === 0 ? 'text-primary/20' : 'text-border'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className={`font-display font-bold text-xl mb-3
                    ${i === 0 ? 'text-sidebar-foreground' : 'text-foreground'}`}>
                    {L({ en: svc.en, fr: svc.fr })}
                  </h3>
                  <p className={`text-sm leading-relaxed flex-1
                    ${i === 0 ? 'text-sidebar-foreground/55' : 'text-muted-foreground'}`}>
                    {L({ en: svc.descEn, fr: svc.descFr })}
                  </p>

                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-primary text-xs font-display font-semibold mt-5 hover:gap-3 transition-all duration-200"
                  >
                    {L({ en: 'Learn more', fr: 'En savoir plus' })} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. Partners ── */}
      <section className="bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header row — label left, partner count right */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 border-b border-border"
          >
            <motion.div variants={fadeInLeft} className="flex items-center gap-4">
              <span className="w-8 h-px bg-primary flex-shrink-0" />
              <div>
                <p className="font-display font-bold text-lg sm:text-xl tracking-tight leading-tight">
                  {L({ en: 'Trusted by Leading Brands', fr: 'La Confiance des Grandes Marques' })}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {L({ en: 'Official distributors & certified supply partners', fr: 'Distributeurs officiels & partenaires certifiés' })}
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeInRight} className="flex items-center gap-2 flex-shrink-0">
              <span className="font-display font-bold text-2xl text-primary tabular-nums">
                {partners.length > 0 ? `${partners.length}+` : '12+'}
              </span>
              <span className="text-muted-foreground text-xs uppercase tracking-widest font-medium leading-tight max-w-[5rem]">
                {L({ en: 'Global Partners', fr: 'Partenaires Mondiaux' })}
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Marquee rows */}
        <div className="relative overflow-hidden py-6">
          <div className="marquee-wrap space-y-3 select-none">

            {/* Row 1 — scrolls left */}
            <div className="flex w-max marquee-left">
              {[...brandsRow1, ...brandsRow1].map((b, i) => (
                <div key={i}
                  className="flex items-center gap-3 mx-2 px-4 py-3 bg-card border border-border rounded-sm
                             hover:border-primary/50 hover:shadow-sm transition-all duration-200 cursor-default flex-shrink-0 group">
                  {/* Logo */}
                  <div className="w-10 h-10 rounded-sm bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {b.logoUrl
                      ? <img src={b.logoUrl} alt={b.name} className="w-full h-full object-contain p-1" />
                      : <span className="text-sm font-display font-bold text-primary">{b.name.charAt(0)}</span>}
                  </div>
                  {/* Name + sector */}
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-foreground leading-none whitespace-nowrap group-hover:text-primary transition-colors duration-150">
                      {b.name}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5 whitespace-nowrap">
                      {L({ en: b.sectorEn, fr: b.sectorFr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 — scrolls right */}
            <div className="flex w-max marquee-right">
              {[...brandsRow2, ...brandsRow2].map((b, i) => (
                <div key={i}
                  className="flex items-center gap-3 mx-2 px-4 py-3 bg-card border border-border rounded-sm
                             hover:border-primary/50 hover:shadow-sm transition-all duration-200 cursor-default flex-shrink-0 group">
                  <div className="w-10 h-10 rounded-sm bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {b.logoUrl
                      ? <img src={b.logoUrl} alt={b.name} className="w-full h-full object-contain p-1" />
                      : <span className="text-sm font-display font-bold text-primary">{b.name.charAt(0)}</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-foreground leading-none whitespace-nowrap group-hover:text-primary transition-colors duration-150">
                      {b.name}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5 whitespace-nowrap">
                      {L({ en: b.sectorEn, fr: b.sectorFr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10" />
        </div>
      </section>

      {/* ── 5. Global reach + Featured products — asymmetric two-col ── */}
      <section className="bg-background py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16 items-start">

            {/* Left — network summary (replaces redundant "Why Us" bullet wall) */}
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce} className="lg:sticky lg:top-24">
              <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-4">
                {L({ en: 'Our Reach', fr: 'Notre Portée' })}
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-5 leading-tight">
                {L({ en: 'One Partner. Four Continents.', fr: 'Un Partenaire. Quatre Continents.' })}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
                {L({
                  en: 'LTIC SARL operates across Africa, Europe, the Middle East and the Americas — freight, supply, consulting and trade under one roof.',
                  fr: 'LTIC SARL opère en Afrique, Europe, Moyen-Orient et Amériques — fret, fourniture, conseil et commerce sous un même toit.',
                })}
              </p>

              {/* Region list */}
              <ul className="space-y-3 mb-8">
                {regions.map(({ icon: Icon, en, fr }) => (
                  <li key={en} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-foreground font-display font-medium text-sm">{L({ en, fr })}</span>
                  </li>
                ))}
              </ul>

              {/* Compact trust pillars */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield,     en: 'Reliable',       fr: 'Fiable' },
                  { icon: Globe2,     en: '30+ Countries',  fr: '30+ Pays' },
                  { icon: Zap,        en: 'Fast Customs',   fr: 'Douane Rapide' },
                  { icon: TrendingUp, en: 'Growth Partner', fr: 'Partenaire Croissance' },
                ].map(({ icon: Icon, en, fr }) => (
                  <div key={en} className="flex items-center gap-2.5 bg-muted/60 rounded-sm px-3 py-2.5">
                    <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-foreground text-xs font-display font-semibold">{L({ en, fr })}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — featured products */}
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em]">
                  {L({ en: 'Featured Products', fr: 'Produits en Vedette' })}
                </p>
                <Link href="/products"
                  className="inline-flex items-center gap-1 text-xs font-display font-semibold text-muted-foreground hover:text-primary transition-colors duration-150">
                  {L({ en: 'Browse all', fr: 'Voir tout' })} <ArrowRight className="h-3 w-3" />
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
                      <motion.div key={product.id} variants={scaleIn}
                        whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}>
                        <Link href={`/products/${product.slug}`}
                          className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-colors duration-200 block">
                          <div className="aspect-square relative bg-muted overflow-hidden">
                            {product.imageUrl && (
                              <Image src={product.imageUrl}
                                alt={L({ en: product.nameEn, fr: product.nameFr })}
                                fill className="object-cover transition-transform duration-500 group-hover:scale-106"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-3">
                            {product.categoryName && (
                              <span className="inline-block bg-primary/10 text-primary text-[10px] rounded-sm px-1.5 py-0.5 mb-1.5 font-medium">
                                {product.categoryName}
                              </span>
                            )}
                            <h3 className="font-display font-semibold text-xs leading-snug group-hover:text-primary transition-colors duration-150">
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

      {/* ── 6. Process — numbered horizontal timeline ── */}
      <section className="bg-sidebar py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-12">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-12">
            <p className="text-blue-400 font-display font-semibold text-xs uppercase tracking-[0.2em] mb-3">
              {L({ en: 'How It Works', fr: 'Comment Ça Marche' })}
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-sidebar-foreground tracking-tight">
              {L({ en: 'From Request to Delivery', fr: 'De la Demande à la Livraison' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-sidebar-border"
          >
            {orderSteps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp}
                className="bg-sidebar p-6 sm:p-8 hover:bg-sidebar-accent/30 transition-colors duration-200 group">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-display font-bold text-5xl text-primary/15 leading-none tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-base text-sidebar-foreground mb-2">{L(step.title)}</h3>
                <p className="text-sidebar-foreground/45 text-sm leading-relaxed mb-4">{L(step.desc)}</p>
                {step.href && step.action && (
                  <Link href={step.href}
                    className="inline-flex items-center gap-1.5 text-primary text-xs font-display font-semibold hover:gap-3 transition-all duration-200">
                    {L(step.action)} <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7. CTA — full-bleed with image overlay ── */}
      <section className="relative bg-sidebar py-24 sm:py-32 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&auto=format&fit=crop&q=60"
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar/90 via-sidebar/70 to-sidebar/85" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={fadeInUp}
              className="text-blue-400 font-display font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
            </motion.p>
            <motion.h2 variants={fadeInUp}
              className="font-display font-bold text-sidebar-foreground tracking-tight leading-tight mb-6
                         text-3xl sm:text-4xl lg:text-5xl [text-wrap:balance]">
              {L({ en: 'Let\'s Move Your Business Forward.', fr: 'Faisons Avancer Votre Business.' })}
            </motion.h2>
            <motion.p variants={fadeInUp}
              className="text-sidebar-foreground/55 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              {L({
                en: 'From a single shipment to a full supply chain partnership — contact our team for a tailored quote.',
                fr: 'D\'une seule expédition à un partenariat logistique complet — contactez notre équipe pour un devis personnalisé.',
              })}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="font-display font-semibold rounded-sm">
                <Link href="/contact">
                  {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="font-display font-semibold rounded-sm bg-transparent border-sidebar-foreground/25 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:border-sidebar-foreground/40 hover:text-sidebar-foreground">
                <Link href="/quote">{L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
