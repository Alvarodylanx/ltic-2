'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, ArrowUpRight, Globe2, Ship, Factory, BarChart3,
  Handshake, TreePine, Shield, Zap, TrendingUp, Package,
  FileText, Clock, Truck, ChevronLeft, ChevronRight, MapPin, Boxes,
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

const heroBgs = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1800&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1800&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1800&auto=format&fit=crop&q=75',
];

const statDefs = [
  { key: 'stat_countries', fallback: '30+',  en: 'Countries', fr: 'Pays' },
  { key: 'stat_clients',   fallback: '500+', en: 'Clients',   fr: 'Clients' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years',     fr: 'Années' },
  { key: 'stat_shipments', fallback: '10K+', en: 'Shipments', fr: 'Expéditions' },
];

const services = [
  {
    icon: Ship,
    en: 'Logistics & Transit',
    fr: 'Logistique & Transit',
    descEn: 'End-to-end freight forwarding, customs clearance and international transit by air, sea and road.',
    descFr: 'Freight forwarding complet, dédouanement et transit international par air, mer et route.',
  },
  {
    icon: Globe2,
    en: 'Import & Export',
    fr: 'Import & Export',
    descEn: 'Cross-border trade facilitation with expert compliance management and documentation support.',
    descFr: 'Facilitation du commerce avec gestion experte de la conformité et support documentaire.',
  },
  {
    icon: Factory,
    en: 'Industrial Supply',
    fr: 'Fourniture Industrielle',
    descEn: 'Generators, lubricants, filters and heavy materials — Total, Shell and certified OEM brands.',
    descFr: 'Générateurs, lubrifiants, filtres — Total, Shell et marques OEM certifiées.',
  },
  {
    icon: TreePine,
    en: 'Timber & Trade',
    fr: 'Bois & Commerce',
    descEn: 'Certified tropical timber and logs for international construction and general trade markets.',
    descFr: 'Bois tropicaux certifiés pour la construction et le commerce international.',
  },
  {
    icon: BarChart3,
    en: 'Supply Chain Consulting',
    fr: "Conseil Chaîne d'Approvisionnement",
    descEn: 'Strategic logistics optimization, procurement consulting and risk management for global markets.',
    descFr: 'Optimisation logistique, conseil en approvisionnement et gestion des risques mondiaux.',
  },
  {
    icon: Handshake,
    en: 'Commercial Representation',
    fr: 'Représentation Commerciale',
    descEn: 'Brand representation, joint ventures and distribution partnerships across emerging markets.',
    descFr: 'Représentation de marque, coentreprises et partenariats de distribution.',
  },
];

const productCategories = [
  {
    en: 'Power Generators',
    fr: 'Groupes Électrogènes',
    descEn: 'Diesel, gas & standby power units for industrial sites',
    descFr: 'Groupes diesel, gaz et secours pour sites industriels',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&auto=format&fit=crop&q=70',
    tag: { en: 'Industrial', fr: 'Industriel' },
  },
  {
    en: 'Lubricants & Oils',
    fr: 'Lubrifiants & Huiles',
    descEn: 'Total, Shell and leading OEM-grade lubricants',
    descFr: 'Lubrifiants Total, Shell et marques OEM de premier plan',
    image: 'https://images.unsplash.com/photo-1635766003440-ebdef3df71e1?w=700&auto=format&fit=crop&q=70',
    tag: { en: 'Supply', fr: 'Fourniture' },
  },
  {
    en: 'Timber & Logs',
    fr: 'Bois & Grumes',
    descEn: 'Certified tropical species for construction and export',
    descFr: 'Essences tropicales certifiées pour construction et export',
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=700&auto=format&fit=crop&q=70',
    tag: { en: 'Trade', fr: 'Commerce' },
  },
  {
    en: 'Filters & Parts',
    fr: 'Filtres & Pièces',
    descEn: 'OEM-grade oil, air and fuel filters for all machinery',
    descFr: 'Filtres huile, air et carburant qualité OEM pour toutes machines',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=700&auto=format&fit=crop&q=70',
    tag: { en: 'Industrial', fr: 'Industriel' },
  },
  {
    en: 'Heavy Equipment',
    fr: 'Équipements Lourds',
    descEn: 'Industrial machinery, tools and structural materials',
    descFr: 'Machines industrielles, outils et matériaux structurels',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&auto=format&fit=crop&q=70',
    tag: { en: 'Supply', fr: 'Fourniture' },
  },
  {
    en: 'General Merchandise',
    fr: 'Marchandises Générales',
    descEn: 'Wide range of consumer and trade goods for any market',
    descFr: 'Large gamme de biens de consommation et commerciaux',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=700&auto=format&fit=crop&q=70',
    tag: { en: 'Commerce', fr: 'Commerce' },
  },
];

const orderSteps = [
  { icon: Package,  title: { en: 'Browse & Discover',  fr: 'Parcourez & Découvrez' },  desc: { en: 'Explore our full industrial catalog and service portfolio.', fr: 'Explorez notre catalogue industriel et notre portefeuille de services.' }, action: { en: 'View Catalog', fr: 'Voir le Catalogue' }, href: '/products' },
  { icon: FileText, title: { en: 'Request a Quote',    fr: 'Demandez un Devis' },        desc: { en: 'Submit your requirements — takes under 2 minutes.', fr: 'Soumettez vos besoins — moins de 2 minutes.' },                                   action: { en: 'Get a Quote',  fr: 'Obtenir un Devis' }, href: '/quote' },
  { icon: Clock,    title: { en: 'Receive an Offer',   fr: 'Recevez une Offre' },        desc: { en: 'Custom pricing and freight costs delivered within 24–48 h.', fr: 'Offre personnalisée avec frais de transport sous 24–48h.' },                action: null, href: null },
  { icon: Truck,    title: { en: 'We Handle the Rest', fr: 'Nous Gérons le Reste' },     desc: { en: 'Customs, freight and logistics — tracked in real time.', fr: 'Douanes, fret et logistique — suivi en temps réel.' },                        action: { en: 'Track Shipment', fr: 'Suivre la Livraison' }, href: '/tracking' },
];

const tickerItems = [
  { en: 'Power Generators', fr: 'Groupes Électrogènes' },
  { en: 'Lubricants', fr: 'Lubrifiants' },
  { en: 'Timber & Logs', fr: 'Bois & Grumes' },
  { en: 'Freight Forwarding', fr: 'Transit International' },
  { en: 'Industrial Filters', fr: 'Filtres Industriels' },
  { en: 'Import & Export', fr: 'Import & Export' },
  { en: 'Heavy Equipment', fr: 'Équipements Lourds' },
  { en: 'Supply Chain', fr: 'Chaîne Logistique' },
  { en: 'OEM Parts', fr: 'Pièces OEM' },
  { en: 'General Merchandise', fr: 'Marchandises Générales' },
];

// ─── HeroBg ───────────────────────────────────────────────────────────────────

function HeroBg({ idx }: { idx: number }) {
  const shouldReduce = useReducedMotion();
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={idx}
        className="absolute inset-0"
        initial={shouldReduce ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={heroBgs[idx % heroBgs.length]}
          alt=""
          fill
          className="object-cover"
          priority={idx === 0}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-sidebar/88" />
      </motion.div>
    </AnimatePresence>
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

// ─── ServiceCard ──────────────────────────────────────────────────────────────

interface ServiceCardProps {
  icon: React.ElementType;
  en: string; fr: string;
  descEn: string; descFr: string;
  index: number;
}

function ServiceCard({ icon: Icon, en, fr, descEn, descFr, index }: ServiceCardProps) {
  const { L } = useLanguage();
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 340, damping: 24 } }}
      className="group relative bg-sidebar border border-sidebar-border rounded-sm overflow-hidden
                 hover:border-primary/50 transition-colors duration-200 cursor-default"
    >
      {/* Top hover accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0
                      group-hover:scale-x-100 origin-left transition-transform duration-300" />

      <div className="p-6 sm:p-7 h-full flex flex-col gap-5">
        {/* Icon + number row */}
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-sm bg-primary/10 flex items-center justify-center
                          group-hover:bg-primary transition-colors duration-250">
            <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-250" />
          </div>
          <span className="font-display font-extrabold text-3xl tabular-nums text-sidebar-foreground/8
                           group-hover:text-primary/15 transition-colors duration-300 select-none leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <h3 className="font-display font-bold text-base sm:text-lg text-sidebar-foreground
                         group-hover:text-primary transition-colors duration-200 leading-tight">
            {L({ en, fr })}
          </h3>
          <p className="text-sidebar-foreground/50 text-sm leading-relaxed">
            {L({ en: descEn, fr: descFr })}
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-primary text-xs font-display font-bold
                     hover:gap-3 transition-all duration-200 w-fit"
        >
          {L({ en: 'Learn more', fr: 'En savoir plus' })}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── ProductCategoryCard ──────────────────────────────────────────────────────

interface ProductCategoryCardProps {
  en: string; fr: string;
  descEn: string; descFr: string;
  image: string;
  tag: { en: string; fr: string };
}

function ProductCategoryCard({ en, fr, descEn, descFr, image, tag }: ProductCategoryCardProps) {
  const { L } = useLanguage();
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
      className="group relative rounded-sm overflow-hidden border border-border
                 hover:border-primary/50 transition-colors duration-200 bg-card"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <Image
          src={image}
          alt={en}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />

        {/* Tag badge */}
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px]
                         font-display font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
          {L(tag)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-display font-bold text-base text-foreground mb-1
                       group-hover:text-primary transition-colors duration-200">
          {L({ en, fr })}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed mb-3">
          {L({ en: descEn, fr: descFr })}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-primary text-xs font-display font-bold
                     hover:gap-2.5 transition-all duration-200"
        >
          {L({ en: 'View products', fr: 'Voir les produits' })}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
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
    <div className="flex items-center gap-2.5 mx-3 px-4 py-3 bg-sidebar-accent/50
                    border border-sidebar-border rounded-sm hover:border-primary/50
                    hover:bg-sidebar-accent/80 transition-colors duration-200
                    cursor-default flex-shrink-0">
      <div className="w-8 h-8 rounded-sm bg-sidebar border border-sidebar-border
                      flex items-center justify-center flex-shrink-0 overflow-hidden">
        {b.logoUrl
          ? <img src={b.logoUrl} alt={b.name} className="w-full h-full object-contain p-0.5" />
          : <span className="text-xs font-display font-extrabold text-primary">{b.name.charAt(0)}</span>}
      </div>
      <span className="font-display font-semibold text-xs text-sidebar-foreground/70 whitespace-nowrap">
        {b.name}
      </span>
    </div>
  );
}

// ─── TickerItem ───────────────────────────────────────────────────────────────

function TickerItem({ en, fr }: { en: string; fr: string }) {
  const { L } = useLanguage();
  return (
    <span className="inline-flex items-center gap-3 mx-4 flex-shrink-0">
      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
      <span className="font-display font-bold text-xs uppercase tracking-[0.15em] text-sidebar-foreground/60
                       hover:text-sidebar-foreground/90 transition-colors duration-150 whitespace-nowrap">
        {L({ en, fr })}
      </span>
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { L } = useLanguage();
  const shouldReduce = useReducedMotion();
  const [bgIdx, setBgIdx] = useState(0);

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

  useEffect(() => {
    if (shouldReduce) return;
    const id = setInterval(() => setBgIdx(p => (p + 1) % heroBgs.length), 7000);
    return () => clearInterval(id);
  }, [shouldReduce]);

  const brandsRow1 = partners.filter((_, i) => i % 2 === 0);
  const brandsRow2 = partners.filter((_, i) => i % 2 === 1);

  const stats = statDefs.map(s => ({
    value: siteSettings?.[s.key] || s.fallback,
    en: s.en, fr: s.fr,
  }));

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <>
      {/* ── 1. Hero — centered, T3-inspired ── */}
      <section className="relative min-h-dvh bg-sidebar flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Cycling background */}
        <HeroBg idx={bgIdx} />

        {/* Radial glow behind headline */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-primary/15 blur-[140px] -translate-y-16" />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

        {/* Left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-7">
            <span className="w-6 h-px bg-primary" />
            <span className="font-display font-bold text-[11px] uppercase tracking-[0.3em] text-blue-400">
              {L({ en: 'Global Logistics & Commerce', fr: 'Logistique & Commerce Mondial' })}
            </span>
            <span className="w-6 h-px bg-primary" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="font-display font-extrabold text-sidebar-foreground leading-[1.0]
                       tracking-tight mb-5 [text-wrap:balance]
                       text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5rem]"
          >
            {L({ en: 'Trade. Ship.', fr: 'Commercez. Expédiez.' })}{' '}
            <span className="text-primary">
              {L({ en: 'Supply.', fr: 'Approvisionnez.' })}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-sidebar-foreground/60 text-base sm:text-lg lg:text-xl
                       max-w-2xl mx-auto mb-9 leading-relaxed"
          >
            {L({
              en: 'LTIC SARL delivers freight, industrial supply and general commerce across 30+ countries — from a single shipment to a full supply chain.',
              fr: 'LTIC SARL livre fret, fournitures industrielles et commerce général dans 30+ pays — d\'une expédition unique à une chaîne logistique complète.',
            })}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Button asChild size="lg"
              className="font-display font-bold rounded-sm h-12 px-8 shadow-none text-sm">
              <Link href="/quote">
                {L({ en: 'Get a Free Quote', fr: 'Obtenir un Devis Gratuit' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="font-display font-semibold rounded-sm h-12 px-8 text-sm bg-transparent
                         border-sidebar-foreground/25 text-sidebar-foreground
                         hover:bg-sidebar-foreground/8 hover:border-sidebar-foreground/50">
              <Link href="/products">{L({ en: 'Browse Products', fr: 'Voir les Produits' })}</Link>
            </Button>
          </motion.div>

          {/* Stat badges */}
          <motion.div
            variants={staggerFast}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex items-center gap-2 bg-sidebar-accent/60 border border-sidebar-border
                           rounded-sm px-3.5 py-2 backdrop-blur-sm"
              >
                <span className="font-display font-extrabold text-primary text-sm tabular-nums">
                  {s.value}
                </span>
                <span className="text-sidebar-foreground/50 text-xs font-medium tracking-wide">
                  {L(s)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        {!shouldReduce && (
          <motion.div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <motion.div
              className="w-px h-8 bg-gradient-to-b from-transparent to-primary/60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </section>

      {/* ── 2. Product ticker — dark kinetic strip ── */}
      <section className="bg-sidebar border-y border-sidebar-border py-4 overflow-hidden relative">
        <div className="flex w-max marquee-left select-none">
          {doubled.map((item, i) => (
            <TickerItem key={i} en={item.en} fr={item.fr} />
          ))}
        </div>
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16
                        bg-gradient-to-r from-sidebar to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16
                        bg-gradient-to-l from-sidebar to-transparent z-10" />
      </section>

      {/* ── 3. Services — equal T3-style card grid ── */}
      <section className="bg-sidebar py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="text-center mb-14"
          >
            <p className="text-primary font-display font-bold text-[11px] uppercase tracking-[0.25em] mb-4">
              {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl
                           text-sidebar-foreground tracking-tight [text-wrap:balance]">
              {L({ en: 'Everything Your Business Needs', fr: 'Tout Ce Dont Votre Entreprise a Besoin' })}
            </h2>
            <p className="text-sidebar-foreground/50 text-base mt-4 max-w-xl mx-auto leading-relaxed">
              {L({
                en: 'Six integrated capabilities — logistics, trade, supply, consulting and representation — under one roof.',
                fr: 'Six capacités intégrées — logistique, commerce, fourniture, conseil et représentation — sous un même toit.',
              })}
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {services.map((svc, i) => (
              <ServiceCard
                key={svc.en}
                icon={svc.icon}
                en={svc.en}
                fr={svc.fr}
                descEn={svc.descEn}
                descFr={svc.descFr}
                index={i}
              />
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-10 text-center"
          >
            <Button asChild variant="outline"
              className="font-display font-bold rounded-sm text-sm border-sidebar-border
                         text-sidebar-foreground bg-transparent hover:bg-sidebar-accent hover:border-primary/50">
              <Link href="/services">
                {L({ en: 'View All Services', fr: 'Voir Tous les Services' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── 4. Product categories — commerce showcase ── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-primary font-display font-bold text-[11px] uppercase tracking-[0.25em] mb-4">
                {L({ en: 'Products & Commerce', fr: 'Produits & Commerce' })}
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl
                             tracking-tight leading-tight [text-wrap:balance] max-w-lg">
                {L({ en: 'A Wide Range of Products, Delivered Anywhere', fr: 'Une Large Gamme de Produits, Livrée Partout' })}
              </h2>
            </motion.div>
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="flex-shrink-0">
              <Button asChild variant="outline" className="rounded-sm font-display font-bold text-sm">
                <Link href="/products">
                  {L({ en: 'Full Catalog', fr: 'Catalogue Complet' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {productCategories.map(cat => (
              <ProductCategoryCard key={cat.en} {...cat} />
            ))}
          </motion.div>

          {/* Featured products from API */}
          {(isLoading || (featuredProducts && featuredProducts.length > 0)) && (
            <div className="mt-12">
              <p className="font-display font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
                {L({ en: 'Featured This Week', fr: 'En Vedette Cette Semaine' })}
              </p>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
              >
                {isLoading
                  ? Array(6).fill(0).map((_, i) => (
                      <div key={i} className="bg-card border border-border rounded-sm overflow-hidden">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-2.5 space-y-1.5">
                          <Skeleton className="h-2.5 w-10" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    ))
                  : featuredProducts?.slice(0, 6).map(product => (
                      <motion.div key={product.id} variants={scaleIn}
                        whileHover={{ y: -3, transition: { type: 'spring', stiffness: 320, damping: 22 } }}>
                        <Link href={`/products/${product.slug}`}
                          className="group bg-card border border-border rounded-sm overflow-hidden
                                     hover:border-primary/50 transition-colors duration-200 block">
                          <div className="aspect-square relative bg-muted overflow-hidden">
                            {product.imageUrl && (
                              <Image src={product.imageUrl}
                                alt={L({ en: product.nameEn, fr: product.nameFr })}
                                fill className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                              />
                            )}
                          </div>
                          <div className="p-2.5">
                            {product.categoryName && (
                              <span className="inline-block bg-primary/10 text-primary text-[9px] rounded-sm
                                               px-1.5 py-0.5 mb-1 font-semibold uppercase tracking-wide">
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
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Partners marquee — dark ── */}
      <section className="bg-sidebar border-y border-sidebar-border py-12 overflow-hidden relative">
        <p className="text-center text-sidebar-foreground/30 text-[10px] uppercase tracking-[0.25em]
                      font-bold mb-8">
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

      {/* ── 6. Stats — full-width, colossal ── */}
      <section className="bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
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
            <motion.div key={i} variants={fadeInUp}
              className="bg-foreground flex flex-col items-center justify-center
                         px-6 py-14 sm:py-16 text-center group
                         hover:bg-sidebar-accent/20 transition-colors duration-300 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0
                              group-hover:scale-x-100 origin-left transition-transform duration-300" />
              <span className="font-display font-extrabold tabular-nums leading-none
                               text-5xl sm:text-6xl lg:text-7xl text-sidebar-foreground mb-3
                               group-hover:text-primary transition-colors duration-300">
                <StatCounter value={stat.value} />
              </span>
              <span className="text-sidebar-foreground/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                {L(stat)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 7. Process — clean 4-step ── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="text-center mb-14">
            <p className="text-primary font-display font-bold text-[11px] uppercase tracking-[0.25em] mb-4">
              {L({ en: 'How It Works', fr: 'Comment Ça Marche' })}
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl
                           tracking-tight [text-wrap:balance]">
              {L({ en: 'From Request to Delivery', fr: 'De la Demande à la Livraison' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border"
          >
            {orderSteps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp}
                className="bg-background p-7 sm:p-8 group hover:bg-muted/40
                           transition-colors duration-200 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0
                                group-hover:scale-x-100 origin-left transition-transform duration-300" />
                <div className="font-display font-extrabold text-[4.5rem] leading-none tabular-nums
                                text-border group-hover:text-primary/15 transition-colors duration-300
                                mb-2 select-none -ml-1">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="w-11 h-11 rounded-sm bg-foreground flex items-center justify-center mb-5
                                group-hover:bg-primary transition-colors duration-250">
                  <step.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground
                                        transition-colors duration-250" />
                </div>
                <h3 className="font-display font-extrabold text-base mb-2 leading-tight">
                  {L(step.title)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {L(step.desc)}
                </p>
                {step.href && step.action && (
                  <Link href={step.href}
                    className="inline-flex items-center gap-1.5 text-primary text-xs font-display font-bold
                               hover:gap-3 transition-all duration-200">
                    {L(step.action)} <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 8. CTA — centered, cinematic ── */}
      <section className="relative bg-sidebar py-28 sm:py-36 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&auto=format&fit=crop&q=55"
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar/95 via-sidebar/80 to-sidebar/95" />
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        {/* Central glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <div className="absolute top-0 left-0 right-0 h-px bg-primary/60" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={fadeInUp}
              className="text-blue-400 font-display font-bold text-[11px] uppercase tracking-[0.28em] mb-5">
              {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
            </motion.p>
            <motion.h2 variants={fadeInUp}
              className="font-display font-extrabold text-sidebar-foreground tracking-tight
                         leading-[1.0] mb-7 [text-wrap:balance]
                         text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
              {L({ en: "Let's Move Your\nBusiness Forward.", fr: 'Faisons Avancer\nVotre Business.' })}
            </motion.h2>
            <motion.p variants={fadeInUp}
              className="text-sidebar-foreground/45 text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              {L({
                en: 'One partner for freight, industrial supply and general commerce — across 30+ countries.',
                fr: 'Un partenaire pour le fret, la fourniture industrielle et le commerce général — dans 30+ pays.',
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
