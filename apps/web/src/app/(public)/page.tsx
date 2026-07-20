'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, Globe2, Ship, Factory, BarChart3, Handshake, TreePine,
  Shield, Zap, TrendingUp, CheckCircle2, Package, FileText, Clock, Truck,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, stagger, staggerFast, viewportOnce } from '@/components/motion/variants';

// ── Module-level data ──────────────────────────────────────────────────────────

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=70',
    alt:      { en: 'Cargo logistics operations at port',        fr: 'Opérations logistiques cargo au port' },
    eyebrow:  { en: 'Global Logistics & Transit',                fr: 'Logistique & Transit Mondial' },
    headline: { en: 'Global Logistics & Industrial Trade',       fr: 'Logistique Mondiale & Commerce Industriel' },
    accent:   { en: 'Built for Africa.',                          fr: "Conçu pour l'Afrique." },
    body:     { en: 'Reliable freight forwarding and transit across 30+ countries with precision and accountability.', fr: 'Freight forwarding et transit fiables dans 30+ pays avec précision et responsabilité.' },
    cta:      { en: 'Request a Quote', fr: 'Demander un Devis', href: '/quote' },
  },
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1800&auto=format&fit=crop&q=70',
    alt:      { en: 'Industrial equipment and factory supply',   fr: 'Équipements industriels et fournitures usine' },
    eyebrow:  { en: 'Industrial Supply',                         fr: 'Fourniture Industrielle' },
    headline: { en: 'Premium Industrial Equipment & Materials',  fr: 'Équipements & Matériaux Industriels Premium' },
    accent:   { en: 'Delivered to Spec.',                        fr: 'Livré selon Spécifications.' },
    body:     { en: 'Generators, lubricants, filters and heavy materials — Total, Shell and leading OEM brands.', fr: 'Générateurs, lubrifiants, filtres et matériaux lourds — Total, Shell et grandes marques OEM.' },
    cta:      { en: 'Browse Products', fr: 'Voir les Produits', href: '/products' },
  },
  {
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1800&auto=format&fit=crop&q=70',
    alt:      { en: 'International shipping and freight',        fr: 'Transport maritime et fret international' },
    eyebrow:  { en: 'Import & Export',                           fr: 'Import & Export' },
    headline: { en: 'Seamless Cross-Border Trade',              fr: 'Commerce Transfrontalier Fluide' },
    accent:   { en: 'Compliance. Speed. Precision.',             fr: 'Conformité. Vitesse. Précision.' },
    body:     { en: 'Expert customs clearance, documentation and strategic sourcing by air, sea and road.', fr: 'Dédouanement expert, documentation et sourcing stratégique aérien, maritime et routier.' },
    cta:      { en: 'Our Services', fr: 'Nos Services', href: '/services' },
  },
  {
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&auto=format&fit=crop&q=70',
    alt:      { en: 'Business partnership handshake',            fr: 'Poignée de main partenariat commercial' },
    eyebrow:  { en: 'Commercial Representation',                 fr: 'Représentation Commerciale' },
    headline: { en: 'Your Gateway to New Markets',              fr: "Votre Porte d'Entrée vers de Nouveaux Marchés" },
    accent:   { en: 'Africa. Europe. Middle East.',              fr: 'Afrique. Europe. Moyen-Orient.' },
    body:     { en: 'Strategic brand representation, joint ventures and distribution partnerships across emerging markets.', fr: 'Représentation de marques, coentreprises et partenariats sur marchés émergents.' },
    cta:      { en: 'Partner With Us', fr: 'Devenez Partenaire', href: '/contact' },
  },
  {
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1800&auto=format&fit=crop&q=70',
    alt:      { en: 'Warehouse and supply chain operations',     fr: 'Entrepôt et opérations chaîne logistique' },
    eyebrow:  { en: 'Supply Chain Consulting',                   fr: "Conseil Chaîne d'Approvisionnement" },
    headline: { en: 'Optimize Your Supply Chain',               fr: "Optimisez Votre Chaîne Logistique" },
    accent:   { en: 'Cut Cost. Gain Speed.',                     fr: 'Réduisez les Coûts. Gagnez en Vitesse.' },
    body:     { en: 'Strategic logistics consulting for enterprises operating in complex international markets.', fr: 'Conseil logistique stratégique pour entreprises sur marchés internationaux complexes.' },
    cta:      { en: 'Get a Quote', fr: 'Obtenir un Devis', href: '/quote' },
  },
];

const statDefs = [
  { key: 'stat_countries', fallback: '30+',  en: 'Countries Served',   fr: 'Pays Desservis' },
  { key: 'stat_clients',   fallback: '500+', en: 'Clients Worldwide',   fr: 'Clients Mondiaux' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years Experience',    fr: "Années d'Expérience" },
  { key: 'stat_shipments', fallback: '10K+', en: 'Shipments Completed', fr: 'Expéditions Réalisées' },
];

const services = [
  { icon: Ship,      en: 'Logistics & Transit',              fr: 'Logistique & Transit',               descEn: 'End-to-end freight forwarding, customs clearance, and international transit across air, sea and road.',  descFr: 'Freight forwarding complet, dédouanement et transit international aérien, maritime et routier.' },
  { icon: Globe2,    en: 'Import & Export',                   fr: 'Import & Export',                    descEn: 'Seamless global trade facilitation with compliance, documentation and strategic sourcing expertise.',     descFr: 'Facilitation du commerce mondial avec conformité, documentation et expertise en sourcing stratégique.' },
  { icon: Factory,   en: 'Industrial Supply',                 fr: 'Fourniture Industrielle',            descEn: 'Generators, lubricants, filters, and heavy industrial materials delivered to specification.',            descFr: 'Générateurs, lubrifiants, filtres et matériaux industriels lourds livrés selon spécifications.' },
  { icon: TreePine,  en: 'Timber & Trade',                    fr: 'Bois & Commerce',                   descEn: 'Premium certified tropical timber and logs for international construction and woodworking markets.',      descFr: "Bois tropicaux certifiés premium pour la construction internationale et les marchés du bois." },
  { icon: BarChart3, en: 'Supply Chain Consulting',           fr: "Conseil Chaîne d'Approvisionnement", descEn: 'Strategic procurement and logistics optimization for enterprises operating in complex markets.',          descFr: "Optimisation stratégique des achats et de la logistique pour entreprises sur marchés complexes." },
  { icon: Handshake, en: 'Commercial Representation',         fr: 'Représentation Commerciale',         descEn: 'Brand and market representation, joint ventures, and strategic business partnerships.',                   descFr: "Représentation de marque, coentreprises et partenariats commerciaux stratégiques." },
];

const industries = [
  { en: 'Oil & Gas',            fr: 'Pétrole & Gaz' },
  { en: 'Mining & Extraction',  fr: 'Mines & Extraction' },
  { en: 'Construction',         fr: 'Construction' },
  { en: 'Agriculture',          fr: 'Agriculture' },
  { en: 'Manufacturing',        fr: 'Industrie Manufacturière' },
  { en: 'Forestry',             fr: 'Foresterie' },
  { en: 'Energy',               fr: 'Énergie' },
  { en: 'Public Works',         fr: 'Travaux Publics' },
];

const orderSteps = [
  {
    icon: Package,
    title:  { en: 'Browse Our Catalog',  fr: 'Parcourez Notre Catalogue' },
    desc:   { en: 'Explore industrial products — timber, generators, lubricants, and more.', fr: 'Explorez nos produits industriels — bois, générateurs, lubrifiants et plus encore.' },
    action: { en: 'View Catalog',        fr: 'Voir le Catalogue' },
    href: '/products',
  },
  {
    icon: FileText,
    title:  { en: 'Request a Quote',     fr: 'Demandez un Devis' },
    desc:   { en: 'Fill our quote form with product, quantity, destination. Takes under 2 minutes.', fr: 'Remplissez notre formulaire avec produit, quantité, destination. Moins de 2 minutes.' },
    action: { en: 'Get a Quote',         fr: 'Obtenir un Devis' },
    href: '/quote',
  },
  {
    icon: Clock,
    title:  { en: 'Receive Your Offer',  fr: 'Recevez Votre Offre' },
    desc:   { en: 'Custom price with freight costs, customs fees, and delivery timeline within 24–48 hours.', fr: 'Offre personnalisée avec frais de transport et délais sous 24–48h.' },
    action: null,
    href: null,
  },
  {
    icon: Truck,
    title:  { en: 'Track Your Shipment', fr: 'Suivez Votre Livraison' },
    desc:   { en: 'We handle customs, freight, logistics. Track your order in real time.', fr: 'Nous gérons tout — douanes, fret, logistique. Suivez votre commande en temps réel.' },
    action: { en: 'Track a Shipment',    fr: 'Suivre une Livraison' },
    href: '/tracking',
  },
];

// ── HeroCarousel ──────────────────────────────────────────────────────────────
// Auto-advances every 5 s, pauses on hover, respects prefers-reduced-motion.
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
    const id = setInterval(() => advance(1), 5000);
    return () => clearInterval(id);
  }, [advance, paused, shouldReduce]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative min-h-[60vh] sm:min-h-[68vh] lg:min-h-[78vh] bg-sidebar flex items-center overflow-hidden"
      aria-label={L({ en: 'Hero slideshow', fr: 'Diaporama principal' })}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background cross-fade ── */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={slide.image}
            alt={L(slide.alt)}
            fill
            className="object-cover opacity-20"
            priority={current === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar/97 via-sidebar/88 to-sidebar/55" />
        </motion.div>
      </AnimatePresence>

      {/* Left blue accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

      {/* ── Slide content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:pl-12 w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`content-${current}`}
            className="max-w-3xl"
            initial={shouldReduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <motion.p
              initial={shouldReduce ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.06 }}
              className="flex items-center gap-2.5 text-blue-400 font-display font-semibold text-sm uppercase tracking-[0.16em] mb-5"
            >
              <span className="w-6 h-px bg-blue-400 flex-shrink-0" />
              {L(slide.eyebrow)}
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={shouldReduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="font-display font-bold text-sidebar-foreground leading-[1.05] tracking-tight mb-3
                         text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] [text-wrap:balance]"
            >
              {L(slide.headline)}
            </motion.h1>

            {/* Accent line */}
            <motion.p
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.19 }}
              className="text-primary font-display font-bold mb-5 text-xl sm:text-2xl lg:text-3xl tracking-tight"
            >
              {L(slide.accent)}
            </motion.p>

            {/* Body */}
            <motion.p
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-sidebar-foreground/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
            >
              {L(slide.body)}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.31 }}
              className="flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="font-display font-semibold rounded-sm shadow-none">
                <Link href={slide.cta.href}>
                  {L({ en: slide.cta.en, fr: slide.cta.fr })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="font-display font-semibold rounded-sm bg-transparent border-sidebar-foreground/30 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground hover:border-sidebar-foreground/50">
                <Link href="/services">{L({ en: 'Our Services', fr: 'Nos Services' })}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Prev / Dots / Next ── */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3 z-10">
        <button
          onClick={() => advance(-1)}
          aria-label={L({ en: 'Previous slide', fr: 'Diapositive précédente' })}
          className="w-9 h-9 rounded-full border border-sidebar-foreground/20 bg-sidebar/60 hover:bg-sidebar-foreground/10 flex items-center justify-center transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
        </button>

        <div className="flex items-center gap-2" role="tablist">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`${L({ en: 'Slide', fr: 'Diapositive' })} ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary
                ${i === current
                  ? 'w-7 h-2.5 bg-primary'
                  : 'w-2.5 h-2.5 bg-sidebar-foreground/25 hover:bg-sidebar-foreground/50'}`}
            />
          ))}
        </div>

        <button
          onClick={() => advance(1)}
          aria-label={L({ en: 'Next slide', fr: 'Diapositive suivante' })}
          className="w-9 h-9 rounded-full border border-sidebar-foreground/20 bg-sidebar/60 hover:bg-sidebar-foreground/10 flex items-center justify-center transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
        </button>
      </div>

      {/* ── Auto-progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sidebar-foreground/10">
        {!shouldReduce && (
          <AnimatePresence mode="wait">
            {!paused && (
              <motion.div
                key={`bar-${current}`}
                className="h-full bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

// ── StatCounter ───────────────────────────────────────────────────────────────
// Counts 0 → target with easeOutCubic when scrolled into view.
function StatCounter({ value }: { value: string }) {
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^(\d+)(.*)/);
    if (!match) { setDisplay(value); return; }
    if (shouldReduce) { setDisplay(value); return; }
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1600;
    let raf = 0;
    let start = 0;
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

// ── Partner type ──────────────────────────────────────────────────────────────
interface Partner {
  id: number;
  name: string;
  logoUrl?: string;
  sectorEn: string;
  sectorFr: string;
  productsEn?: string;
  productsFr?: string;
  website?: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────
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

  const stats = statDefs.map((s) => ({
    value: siteSettings?.[s.key] || s.fallback,
    en: s.en,
    fr: s.fr,
  }));

  return (
    <>
      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Stats ── */}
      <section className="bg-foreground py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn} className="flex flex-col items-center">
                <span className="font-display font-bold text-5xl sm:text-6xl text-primary leading-none mb-3 tabular-nums">
                  <StatCounter value={stat.value} />
                </span>
                <span className="text-sidebar-foreground/60 text-sm uppercase tracking-widest font-medium">
                  {L(stat)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Partners marquee ── */}
      <section className="relative bg-background py-16 sm:py-20 overflow-hidden">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="text-center mb-10 px-4"
        >
          <span className="amber-rule mx-auto mb-4" />
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.18em] mb-2">
            {L({ en: 'Trusted Partners & Brands', fr: 'Partenaires & Marques de Confiance' })}
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
            {L({ en: 'Brands We Work With', fr: 'Marques Avec Lesquelles Nous Travaillons' })}
          </h2>
        </motion.div>

        <div className="marquee-wrap space-y-3 select-none">
          <div className="flex w-max marquee-left">
            {[...brandsRow1, ...brandsRow1].map((b, i) => (
              <div key={i}
                className="flex items-center gap-3 mx-3 px-5 py-3.5 bg-card border border-border rounded-sm hover:border-primary/40 transition-all duration-300 cursor-default flex-shrink-0">
                <div className="w-10 h-10 rounded-sm bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {b.logoUrl
                    ? <img src={b.logoUrl} alt={b.name} className="w-full h-full object-contain p-0.5" />
                    : <span className="text-sm font-display font-bold text-primary">{b.name.charAt(0)}</span>
                  }
                </div>
                <div>
                  <p className="font-display font-bold text-base text-foreground leading-none">{b.name}</p>
                  <p className="text-sm text-primary mt-0.5">{L({ en: b.sectorEn, fr: b.sectorFr })}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-max marquee-right">
            {[...brandsRow2, ...brandsRow2].map((b, i) => (
              <div key={i}
                className="flex items-center gap-3 mx-3 px-5 py-3.5 bg-card border border-border rounded-sm hover:border-primary/40 transition-all duration-300 cursor-default flex-shrink-0">
                <div className="w-10 h-10 rounded-sm bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {b.logoUrl
                    ? <img src={b.logoUrl} alt={b.name} className="w-full h-full object-contain p-0.5" />
                    : <span className="text-sm font-display font-bold text-primary">{b.name.charAt(0)}</span>
                  }
                </div>
                <div>
                  <p className="font-display font-bold text-base text-foreground leading-none">{b.name}</p>
                  <p className="text-sm text-primary mt-0.5">{L({ en: b.sectorEn, fr: b.sectorFr })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10" />
      </section>

      {/* ── Services ── */}
      <section className="bg-card py-24 sm:py-28 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-16"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.18em] mb-3">
              {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground mb-5">
              {L({ en: 'Comprehensive Business Solutions', fr: "Solutions d'Affaires Complètes" })}
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed text-base sm:text-lg">
              {L({
                en: 'From freight forwarding to industrial supply and strategic partnerships — covering the full spectrum of global business operations.',
                fr: "Du freight forwarding à la fourniture industrielle et aux partenariats stratégiques — couvrant tout le spectre des opérations mondiales.",
              })}
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
          >
            {services.map(({ icon: Icon, ...svc }) => (
              <motion.div
                key={svc.en}
                variants={fadeInUp}
                className="group bg-card p-8 sm:p-10 hover:bg-muted/40 transition-colors duration-300 cursor-default relative"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-14 h-14 rounded-sm bg-foreground flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{L({ en: svc.en, fr: svc.fr })}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{L({ en: svc.descEn, fr: svc.descFr })}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-10"
          >
            <Button asChild variant="outline" className="rounded-sm font-display font-semibold">
              <Link href="/services">
                {L({ en: 'View All Services', fr: 'Voir Tous les Services' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-background py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <span className="amber-rule mb-4" />
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.18em] mb-3">
                {L({ en: 'Why LTIC SARL', fr: 'Pourquoi LTIC SARL' })}
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-6">
                {L({ en: 'Your Strategic Partner for Global Operations', fr: 'Votre Partenaire Stratégique pour les Opérations Mondiales' })}
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed text-base sm:text-lg">
                {L({
                  en: 'LTIC SARL is more than a logistics company — we are a multinational business solutions provider with the networks, expertise, and operational capacity to handle your most complex international requirements.',
                  fr: "LTIC SARL est plus qu'une société de logistique — nous sommes un fournisseur de solutions d'affaires multinationales avec les réseaux, l'expertise et la capacité opérationnelle nécessaires.",
                })}
              </p>
              <ul className="space-y-4">
                {[
                  { en: 'Multinational trade network across Africa, Europe, Middle East & Americas', fr: "Réseau commercial multinational en Afrique, Europe, Moyen-Orient & Amériques" },
                  { en: 'Full-spectrum logistics: freight, customs, warehousing, last-mile delivery',  fr: "Logistique complète: fret, douane, entreposage, livraison dernier kilomètre" },
                  { en: 'Certified industrial supply partners — Total, Shell and leading OEM brands',   fr: "Partenaires certifiés — Total, Shell et grandes marques OEM" },
                  { en: 'Dedicated account management and 24/7 shipment tracking',                     fr: "Gestion de compte dédiée et suivi d'expédition 24h/7j" },
                  { en: 'Phytosanitary treatment and regulatory compliance services',                   fr: "Services de traitement phytosanitaire et conformité réglementaire" },
                  { en: 'Transparent pricing, structured documentation, on-time delivery',             fr: "Tarification transparente, documentation structurée, livraison à temps" },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    variants={fadeInLeft}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewportOnce}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-base">{L(item)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Shield,     en: 'Reliability',    fr: 'Fiabilité',      descEn: 'On-time delivery backed by structured documentation and tracking.',       descFr: 'Livraison à temps avec documentation structurée et suivi.' },
                { icon: Globe2,     en: 'Global Network', fr: 'Réseau Mondial',  descEn: 'Established connections across 30+ countries and key trade corridors.',   descFr: 'Connexions établies dans 30+ pays et corridors commerciaux clés.' },
                { icon: Zap,        en: 'Efficiency',     fr: 'Efficacité',      descEn: 'Optimized supply chains reducing cost and transit time.',                  descFr: "Chaînes d'approvisionnement optimisées réduisant coûts et délais." },
                { icon: TrendingUp, en: 'Growth',         fr: 'Croissance',      descEn: 'Strategic partnerships that open new markets and opportunities.',           descFr: "Partenariats stratégiques ouvrant de nouveaux marchés et opportunités." },
              ].map(({ icon: Icon, ...card }) => (
                <motion.div
                  key={card.en}
                  variants={scaleIn}
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  className="bg-card border border-border rounded-sm p-6 sm:p-7 hover:border-primary/40 transition-colors duration-200"
                >
                  <div className="w-12 h-12 rounded-sm bg-foreground flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-display font-bold text-lg mb-2">{L({ en: card.en, fr: card.fr })}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{L({ en: card.descEn, fr: card.descFr })}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-muted/50 py-24 sm:py-28 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-16"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.18em] mb-3">
              {L({ en: 'Industrial Catalog', fr: 'Catalogue Industriel' })}
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
              {L({ en: 'Featured Products', fr: 'Produits en Vedette' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          >
            {isLoading
              ? Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-sm overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              : featuredProducts?.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={fadeInUp}
                    whileHover={{ y: -6, transition: { type: 'spring', stiffness: 280, damping: 18 } }}
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-300 block"
                    >
                      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={L({ en: product.nameEn, fr: product.nameFr })}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-5">
                        {product.categoryName && (
                          <span className="inline-block bg-primary/15 text-primary text-xs rounded-sm px-2 py-0.5 mb-2 font-medium">
                            {product.categoryName}
                          </span>
                        )}
                        <h3 className="font-display font-semibold text-base leading-tight group-hover:text-primary transition-colors duration-200">
                          {L({ en: product.nameEn, fr: product.nameFr })}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <Button asChild variant="outline" className="rounded-sm font-display font-semibold">
              <Link href="/products">
                {L({ en: 'Browse Full Catalog', fr: 'Parcourir le Catalogue' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section className="bg-background py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-14 text-center"
          >
            <span className="amber-rule mx-auto mb-4" />
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
              {L({ en: 'Industries We Serve', fr: 'Secteurs que Nous Servons' })}
            </h2>
          </motion.div>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-wrap justify-center gap-3"
          >
            {industries.map((ind) => (
              <motion.span
                key={ind.en}
                variants={scaleIn}
                whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
                className="bg-card border border-border text-foreground rounded-sm px-6 py-3 text-base font-display font-medium cursor-default hover:border-primary/50 hover:text-primary transition-colors duration-200"
              >
                {L(ind)}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How to Order ── */}
      <section className="bg-muted/50 py-24 sm:py-28 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-16"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.18em] mb-3">
              {L({ en: 'Simple Process', fr: 'Processus Simple' })}
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-5">
              {L({ en: 'How to Place an Order', fr: 'Comment Passer une Commande' })}
            </h2>
            <p className="text-muted-foreground max-w-md text-base sm:text-lg">
              {L({ en: 'From catalog to delivery — four straightforward steps.', fr: 'Du catalogue à la livraison — quatre étapes claires.' })}
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >
            {orderSteps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="relative"
              >
                {i < orderSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(100%-0.5rem)] w-full h-px bg-border z-0" />
                )}
                <div className="relative z-10 bg-card border border-border rounded-sm p-7 h-full hover:border-primary/40 transition-colors duration-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-sm bg-foreground flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-display font-bold text-3xl text-primary/30 leading-none">0{i + 1}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{L(step.title)}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5">{L(step.desc)}</p>
                  {step.href && step.action && (
                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-1.5 text-primary text-sm font-display font-semibold hover:gap-3 transition-all duration-200"
                    >
                      {L(step.action)} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-foreground py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.18em] mb-4">
                {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
              </p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-sidebar-foreground tracking-tight leading-tight">
                {L({ en: 'Optimize Your Global Operations Today.', fr: "Optimisez Vos Opérations Mondiales Aujourd'hui." })}
              </h2>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="flex flex-col sm:flex-row gap-4"
            >
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
          </div>
        </div>
      </section>
    </>
  );
}
