'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, ArrowUpRight, Globe2, Ship, Factory, BarChart3,
  Handshake, TreePine, Package, FileText, Clock, Truck, MapPin,
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
  'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1800&auto=format&fit=crop&q=80',
];

const statDefs = [
  { key: 'stat_countries', fallback: '30+',  en: 'Countries', fr: 'Pays' },
  { key: 'stat_clients',   fallback: '500+', en: 'Clients',   fr: 'Clients' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years',     fr: 'Années' },
  { key: 'stat_shipments', fallback: '10K+', en: 'Shipments', fr: 'Expéditions' },
];

const services = [
  { icon: Ship,      en: 'Logistics & Transit',        fr: 'Logistique & Transit',               descEn: 'End-to-end freight forwarding, customs clearance and international transit by air, sea and road.',          descFr: 'Freight forwarding complet, dédouanement et transit international par air, mer et route.' },
  { icon: Globe2,    en: 'Import & Export',            fr: 'Import & Export',                    descEn: 'Cross-border trade facilitation with expert compliance management and full documentation support.',          descFr: 'Facilitation du commerce transfrontalier avec gestion experte de la conformité.' },
  { icon: Factory,   en: 'Industrial Supply',          fr: 'Fourniture Industrielle',            descEn: 'Generators, lubricants, filters and heavy materials from Total, Shell and certified OEM brands.',           descFr: 'Générateurs, lubrifiants, filtres — Total, Shell et marques OEM certifiées.' },
  { icon: TreePine,  en: 'Timber & Trade',             fr: 'Bois & Commerce',                   descEn: 'Certified tropical timber and logs for international construction and general trade markets.',               descFr: 'Bois tropicaux certifiés pour la construction internationale et le commerce.' },
  { icon: BarChart3, en: 'Supply Chain Consulting',    fr: "Conseil Chaîne d'Approvisionnement", descEn: 'Strategic logistics optimization, procurement consulting and risk management for global markets.',           descFr: 'Optimisation logistique, conseil en approvisionnement et gestion des risques.' },
  { icon: Handshake, en: 'Commercial Representation', fr: 'Représentation Commerciale',         descEn: 'Brand representation, joint ventures and distribution partnerships across emerging markets.',                descFr: 'Représentation de marque et partenariats de distribution sur marchés émergents.' },
];

const features = [
  {
    label:   { en: 'Industrial Supply',         fr: 'Fourniture Industrielle' },
    heading: { en: 'Industrial Products\nDelivered On-Time.', fr: 'Produits Industriels\nLivrés à Temps.' },
    body:    { en: 'From power generators to OEM-grade lubricants, we source and ship the industrial essentials your operations depend on — Total, Shell and certified OEM brands, shipped anywhere.', fr: 'Des groupes électrogènes aux lubrifiants OEM, nous approvisionnons les produits industriels essentiels — Total, Shell et marques OEM certifiées.' },
    image:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80',
    tag:     { en: 'Supply', fr: 'Fourniture' },
    href:    '/products',
  },
  {
    label:   { en: 'Timber & Natural Resources', fr: 'Bois & Ressources Naturelles' },
    heading: { en: 'Certified Timber\nfor Global Markets.', fr: 'Bois Certifié\npour Marchés Mondiaux.' },
    body:    { en: 'We export certified tropical species for international construction, interior design and general trade — sustainably sourced from Central African forests with full documentation.', fr: 'Nous exportons des essences tropicales certifiées pour la construction internationale, le design intérieur et le commerce général.' },
    image:   'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=900&auto=format&fit=crop&q=80',
    tag:     { en: 'Trade', fr: 'Commerce' },
    href:    '/products',
  },
  {
    label:   { en: 'General Commerce',           fr: 'Commerce Général' },
    heading: { en: 'Everything Your\nBusiness Needs.', fr: 'Tout Ce Dont\nVotre Entreprise a Besoin.' },
    body:    { en: 'A diverse catalog of consumer and trade goods — sourced globally and delivered anywhere. From bulk commodity orders to specialized procurement, we handle it all.', fr: 'Un catalogue diversifié de biens de consommation et commerciaux, sourcés mondialement et livrés partout.' },
    image:   'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=900&auto=format&fit=crop&q=80',
    tag:     { en: 'Commerce', fr: 'Commerce' },
    href:    '/products',
  },
];

const productCategories = [
  { en: 'Power Generators',    fr: 'Groupes Électrogènes',  descEn: 'Diesel, gas & standby power units for industrial sites', descFr: 'Groupes diesel, gaz et secours pour sites industriels', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=75', tag: { en: 'Industrial', fr: 'Industriel' } },
  { en: 'Lubricants & Oils',  fr: 'Lubrifiants & Huiles',   descEn: 'Total, Shell and OEM-grade lubricants',                  descFr: 'Lubrifiants Total, Shell et marques OEM',              image: 'https://images.unsplash.com/photo-1635766003440-ebdef3df71e1?w=600&auto=format&fit=crop&q=75', tag: { en: 'Supply', fr: 'Fourniture' } },
  { en: 'Timber & Logs',      fr: 'Bois & Grumes',           descEn: 'Certified tropical species for export',                  descFr: 'Essences tropicales certifiées pour export',          image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&auto=format&fit=crop&q=75', tag: { en: 'Trade', fr: 'Commerce' } },
  { en: 'Filters & Parts',    fr: 'Filtres & Pièces',        descEn: 'OEM-grade oil, air and fuel filters for all machinery',  descFr: 'Filtres OEM pour toutes machines',                   image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&auto=format&fit=crop&q=75', tag: { en: 'Industrial', fr: 'Industriel' } },
  { en: 'Heavy Equipment',    fr: 'Équipements Lourds',      descEn: 'Industrial machinery, tools and structural materials',   descFr: 'Machines industrielles, outils et matériaux',        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop&q=75', tag: { en: 'Supply', fr: 'Fourniture' } },
  { en: 'General Merchandise',fr: 'Marchandises Générales',  descEn: 'Wide range of consumer and trade goods',                 descFr: 'Large gamme de biens de consommation',               image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=75', tag: { en: 'Commerce', fr: 'Commerce' } },
];

const orderSteps = [
  { icon: Package,  num: '01', title: { en: 'Browse & Discover', fr: 'Parcourir & Découvrir' }, desc: { en: 'Explore our full industrial catalog and service portfolio.',      fr: 'Explorez notre catalogue et portefeuille de services.' },         action: { en: 'View Catalog',   fr: 'Voir le Catalogue' }, href: '/products' },
  { icon: FileText, num: '02', title: { en: 'Request a Quote',   fr: 'Demander un Devis' },     desc: { en: 'Submit your requirements — takes under 2 minutes.',              fr: 'Soumettez vos besoins en moins de 2 minutes.' },                 action: { en: 'Get a Quote',    fr: 'Obtenir un Devis' }, href: '/quote' },
  { icon: Clock,    num: '03', title: { en: 'Receive an Offer',  fr: 'Recevoir une Offre' },     desc: { en: 'Custom pricing and freight costs delivered within 24–48 hours.', fr: 'Offre personnalisée avec frais de transport sous 24–48h.' },     action: null, href: null },
  { icon: Truck,    num: '04', title: { en: 'Tracked Delivery',  fr: 'Livraison Suivie' },       desc: { en: 'Customs, freight and logistics — tracked in real time.',         fr: 'Douanes, fret et logistique — suivi en temps réel.' },           action: { en: 'Track Shipment', fr: 'Suivre' },            href: '/tracking' },
];

const tickerItems = [
  { en: 'Power Generators',  fr: 'Groupes Électrogènes' },
  { en: 'Lubricants',        fr: 'Lubrifiants' },
  { en: 'Timber & Logs',     fr: 'Bois & Grumes' },
  { en: 'Freight Forwarding',fr: 'Transit International' },
  { en: 'Industrial Filters',fr: 'Filtres Industriels' },
  { en: 'Import & Export',   fr: 'Import & Export' },
  { en: 'Heavy Equipment',   fr: 'Équipements Lourds' },
  { en: 'Supply Chain',      fr: 'Chaîne Logistique' },
  { en: 'OEM Parts',         fr: 'Pièces OEM' },
  { en: 'General Merchandise',fr: 'Marchandises Générales' },
];

// ─── Local animation variants ─────────────────────────────────────────────────

const wordStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};

const wordReveal = {
  hidden: { y: '105%' },
  show: { y: '0%', transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

// ─── HeroBg ───────────────────────────────────────────────────────────────────

function HeroBg({
  idx,
  overlay = 0.3,
  sizes = '100vw',
}: {
  idx: number;
  overlay?: number;
  sizes?: string;
}) {
  const shouldReduce = useReducedMotion();
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={idx}
        className="absolute inset-0"
        initial={shouldReduce ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={heroBgs[idx % heroBgs.length]}
          alt=""
          fill
          className="object-cover"
          priority={idx === 0}
          sizes={sizes}
        />
        <div className="absolute inset-0 bg-sidebar" style={{ opacity: overlay }} />
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
    const duration = 2000;
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
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 320, damping: 24 } }}
      className="group relative bg-sidebar border-2 border-sidebar-border overflow-hidden
                 hover:border-primary/60 transition-colors duration-300 h-full"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0
                      group-hover:scale-x-100 origin-left transition-transform duration-300" />

      <span className="absolute right-4 top-1 font-display font-extrabold select-none pointer-events-none
                       text-[5.5rem] leading-none tabular-nums
                       text-sidebar-foreground/[0.04] group-hover:text-primary/[0.07]
                       transition-colors duration-300">
        {String(index + 1).padStart(2, '0')}
      </span>

      <Link
        href="/services"
        className="block p-7 h-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        <div className="flex flex-col gap-6 min-h-[220px]">
          <div className="w-12 h-12 border-2 border-sidebar-border flex items-center justify-center
                          group-hover:border-primary/50 group-hover:bg-primary/5
                          transition-colors duration-300 flex-shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 flex flex-col gap-2.5">
            <h3 className="font-display font-bold text-lg uppercase tracking-wide
                           text-sidebar-foreground group-hover:text-primary
                           transition-colors duration-200 leading-tight">
              {L({ en, fr })}
            </h3>
            <p className="text-sidebar-foreground/65 text-base leading-relaxed">
              {L({ en: descEn, fr: descFr })}
            </p>
          </div>

          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold
                           group-hover:gap-4 transition-all duration-200 w-fit">
            {L({ en: 'Learn more', fr: 'En savoir plus' })}
            <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── FeatureBlock ─────────────────────────────────────────────────────────────

interface FeatureBlockProps {
  label:   { en: string; fr: string };
  heading: { en: string; fr: string };
  body:    { en: string; fr: string };
  image:   string;
  tag:     { en: string; fr: string };
  href:    string;
  reverse?: boolean;
}

function FeatureBlock({ label, heading, body, image, tag, href, reverse }: FeatureBlockProps) {
  const { L } = useLanguage();
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`grid lg:grid-cols-2 gap-[2px] bg-border overflow-hidden
                  ${reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
    >
      <div className="relative aspect-[4/3] lg:aspect-auto min-h-[320px] overflow-hidden bg-muted">
        <Image
          src={image}
          alt={L(label)}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        <span className="absolute top-4 left-4 bg-primary text-primary-foreground
                         text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1.5">
          {L(tag)}
        </span>
      </div>

      <div className="bg-card p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
        <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-5 flex items-center gap-2">
          <span className="w-6 h-px bg-primary flex-shrink-0" />
          {L(label)}
        </p>
        <h3 className="font-display font-extrabold text-section text-foreground
                       whitespace-pre-line leading-none mb-6">
          {L(heading)}
        </h3>
        <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
          {L(body)}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-primary font-semibold text-sm
                     hover:gap-4 transition-all duration-200 w-fit group"
        >
          {L({ en: 'View products', fr: 'Voir les produits' })}
          <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                                   transition-transform duration-200" />
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
      className="group border-2 border-border overflow-hidden bg-card
                 hover:border-primary/50 transition-colors duration-200"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <Image
          src={image}
          alt={en}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-transparent" />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground
                         text-[10px] font-bold uppercase tracking-widest px-2 py-1">
          {L(tag)}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-display font-bold text-sm uppercase tracking-wide text-foreground mb-1.5
                       group-hover:text-primary transition-colors duration-200">
          {L({ en, fr })}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">
          {L({ en: descEn, fr: descFr })}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold
                     hover:gap-3 transition-all duration-200"
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
                    border-2 border-sidebar-border hover:border-primary/50
                    hover:bg-sidebar-accent transition-colors duration-200
                    cursor-default flex-shrink-0">
      <div className="w-8 h-8 bg-sidebar border border-sidebar-border
                      flex items-center justify-center flex-shrink-0 overflow-hidden">
        {b.logoUrl
          ? <img src={b.logoUrl} alt={b.name} width={32} height={32} className="w-full h-full object-contain p-0.5" />
          : <span className="text-xs font-display font-extrabold text-primary">{b.name.charAt(0)}</span>}
      </div>
      <span className="font-bold text-xs text-sidebar-foreground/70 whitespace-nowrap uppercase tracking-wide">
        {b.name}
      </span>
    </div>
  );
}

// ─── TickerItem ───────────────────────────────────────────────────────────────

function TickerItem({ en, fr }: { en: string; fr: string }) {
  const { L } = useLanguage();
  return (
    <span className="inline-flex items-center gap-3 mx-6 flex-shrink-0">
      <span className="w-1.5 h-1.5 bg-white/70 flex-shrink-0 rotate-45" />
      <span className="font-display font-bold text-sm uppercase tracking-[0.18em]
                       text-white/90 whitespace-nowrap">
        {L({ en, fr })}
      </span>
    </span>
  );
}

// ─── ProcessStep ──────────────────────────────────────────────────────────────

interface ProcessStepProps {
  icon: React.ElementType;
  num: string;
  title: { en: string; fr: string };
  desc: { en: string; fr: string };
  action: { en: string; fr: string } | null;
  href: string | null;
}

function ProcessStep({ icon: Icon, num, title, desc, action, href }: ProcessStepProps) {
  const { L } = useLanguage();
  return (
    <motion.div
      variants={fadeInUp}
      className="group relative bg-background p-7 sm:p-8 border-t-2 border-border
                 hover:border-primary transition-colors duration-300"
    >
      <div className="absolute right-5 top-3 font-display font-extrabold text-[4rem] leading-none
                      tabular-nums select-none text-border group-hover:text-primary/10
                      transition-colors duration-300">
        {num}
      </div>

      <div className="w-12 h-12 border-2 border-border flex items-center justify-center mb-5
                      group-hover:border-primary/50 group-hover:bg-primary/5
                      transition-colors duration-300">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <h3 className="font-display font-bold text-base uppercase tracking-wide mb-2 leading-tight">
        {L(title)}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        {L(desc)}
      </p>
      {href && action && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold
                     hover:gap-3 transition-all duration-200"
        >
          {L(action)} <ArrowRight className="h-3 w-3 flex-shrink-0" />
        </Link>
      )}
    </motion.div>
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
      {/* ══ 1. HERO — editorial split ══════════════════════════════════════════ */}
      <section className="relative min-h-dvh bg-sidebar overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.035] pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary z-20" />

        <div className="relative z-10 flex min-h-dvh">

          {/* Left: content */}
          <div className="flex-1 flex flex-col justify-center
                          px-8 sm:px-12 lg:pl-16 lg:pr-10 py-28 lg:py-20">
            <motion.div variants={stagger} initial="hidden" animate="show">

              {/* Eyebrow */}
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-10">
                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">
                  {L({ en: 'Cameroon · Pan-Africa · Global', fr: 'Cameroun · Pan-Afrique · Mondial' })}
                </span>
              </motion.div>

              {/* Headline — line-by-line clip reveal */}
              <motion.h1
                variants={wordStagger}
                className="font-display font-extrabold text-sidebar-foreground
                           leading-[0.88] tracking-[-0.02em] mb-8"
              >
                {([
                  { en: 'TRADE.', fr: 'TRADEZ.' },
                  { en: 'SHIP.',  fr: 'EXPÉDIEZ.' },
                ] as { en: string; fr: string }[]).map((word, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.span variants={wordReveal} className="block text-hero">
                      {L(word)}
                    </motion.span>
                  </div>
                ))}
                <div className="overflow-hidden">
                  <motion.span variants={wordReveal} className="block text-hero text-primary">
                    {L({ en: 'SUPPLY.', fr: 'APPROVISIONNEZ.' })}
                  </motion.span>
                </div>
              </motion.h1>

              {/* Sub */}
              <motion.p
                variants={fadeInUp}
                className="text-sidebar-foreground/70 text-xl max-w-[520px] leading-relaxed mb-10"
              >
                {L({
                  en: 'LTIC SARL delivers freight, industrial supply and general commerce across 30+ countries — one partner, zero complications.',
                  fr: 'LTIC SARL livre fret, fournitures industrielles et commerce général dans 30+ pays — un partenaire, zéro complication.',
                })}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 mb-12">
                <Button asChild size="lg"
                  className="font-semibold rounded-none h-12 px-8 shadow-none text-base">
                  <Link href="/quote">
                    {L({ en: 'Get a Free Quote', fr: 'Obtenir un Devis Gratuit' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                  className="font-semibold rounded-none h-12 px-8 text-base bg-transparent
                             border-2 border-sidebar-foreground/25 text-sidebar-foreground
                             hover:bg-sidebar-foreground/10 hover:border-sidebar-foreground/50">
                  <Link href="/products">
                    {L({ en: 'Browse Products', fr: 'Voir les Produits' })}
                  </Link>
                </Button>
              </motion.div>

              {/* Stat badges */}
              <motion.div variants={staggerFast} className="flex flex-wrap gap-3">
                {stats.map((s, i) => (
                  <motion.div key={i} variants={fadeInUp}
                    className="border-2 border-sidebar-border bg-sidebar-accent/40 px-4 py-2.5 min-w-[80px]">
                    <div className="font-display font-extrabold text-xl text-primary tabular-nums leading-none">
                      {s.value}
                    </div>
                    <div className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest mt-1 font-semibold">
                      {L(s)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right: diagonal image panel — desktop only */}
          <div className="hidden lg:block relative flex-shrink-0 w-[44vw] max-w-[680px]
                          overflow-hidden hero-panel">
            <HeroBg idx={bgIdx} overlay={0.12} sizes="44vw" />

            {/* Image nav dots */}
            <div className="absolute bottom-8 right-8 z-10 flex gap-2">
              {heroBgs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBgIdx(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`h-[2px] transition-all duration-300 cursor-pointer
                              ${i === bgIdx ? 'bg-white w-10' : 'bg-white/40 w-5 hover:bg-white/70'}`}
                />
              ))}
            </div>

            {/* Corner brackets */}
            <div className="absolute top-8 left-10 w-8 h-8 border-t-2 border-l-2 border-primary/70 pointer-events-none" />
            <div className="absolute bottom-8 left-10 w-8 h-8 border-b-2 border-l-2 border-primary/70 pointer-events-none" />
          </div>
        </div>

        {/* Mobile: full-bleed background */}
        <div className="absolute inset-0 -z-10 lg:hidden">
          <HeroBg idx={bgIdx} overlay={0.78} sizes="100vw" />
        </div>

        {/* Scroll line */}
        {!shouldReduce && (
          <motion.div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <motion.div
              className="w-px h-10 bg-gradient-to-b from-transparent to-primary/60"
              animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </section>

      {/* ══ 2. TICKER — blue kinetic strip ═════════════════════════════════════ */}
      <div className="bg-primary overflow-hidden py-3.5 select-none" aria-hidden="true">
        <div className="flex w-max marquee-left">
          {doubled.map((item, i) => (
            <TickerItem key={i} en={item.en} fr={item.fr} />
          ))}
        </div>
      </div>

      {/* ══ 3. SERVICES — dark gap-grid ════════════════════════════════════════ */}
      <section className="bg-sidebar py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.07] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-sidebar-border" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-5 flex items-center gap-2">
                <span className="w-6 h-px bg-primary flex-shrink-0" />
                {L({ en: 'Our Services', fr: 'Nos Services' })}
              </p>
              <h2 className="font-display font-extrabold text-section text-sidebar-foreground
                             [text-wrap:balance] whitespace-pre-line max-w-xl">
                {L({ en: 'Six Ways We Move\nYour Business.', fr: 'Six Façons de Faire\nAvancer Votre Business.' })}
              </h2>
            </motion.div>
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="flex-shrink-0">
              <Button asChild variant="outline"
                className="rounded-none border-2 border-sidebar-border text-sidebar-foreground
                           bg-transparent hover:bg-sidebar-accent hover:border-primary/50 font-semibold text-sm">
                <Link href="/services">
                  {L({ en: 'All Services', fr: 'Tous les Services' })}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-sidebar-border"
          >
            {services.map((svc, i) => (
              <div key={svc.en} className="bg-sidebar">
                <ServiceCard icon={svc.icon} en={svc.en} fr={svc.fr}
                  descEn={svc.descEn} descFr={svc.descFr} index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 4. FEATURES — alternating editorial split ══════════════════════════ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="mb-14">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-primary flex-shrink-0" />
              {L({ en: 'Products & Commerce', fr: 'Produits & Commerce' })}
            </p>
            <h2 className="font-display font-extrabold text-section [text-wrap:balance]
                           whitespace-pre-line max-w-2xl">
              {L({ en: 'A Wide Range of Products,\nDelivered Anywhere.', fr: 'Une Large Gamme de Produits,\nLivrée Partout.' })}
            </h2>
          </motion.div>

          <div className="space-y-[2px]">
            {features.map((feat, i) => (
              <FeatureBlock key={feat.label.en} {...feat} reverse={i % 2 === 1} />
            ))}
          </div>

          {/* Category tiles */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <p className="font-display font-bold text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {L({ en: 'Full Product Catalog', fr: 'Catalogue Complet' })}
              </p>
              <Button asChild variant="outline" size="sm"
                className="rounded-none border-2 font-semibold text-xs">
                <Link href="/products">
                  {L({ en: 'View All', fr: 'Tout Voir' })}
                  <ArrowRight className="h-3 w-3 ml-1.5" />
                </Link>
              </Button>
            </div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-border"
            >
              {productCategories.map(cat => (
                <div key={cat.en} className="bg-background">
                  <ProductCategoryCard {...cat} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* API featured products */}
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
                      <div key={i} className="border-2 border-border overflow-hidden">
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
                          className="group border-2 border-border overflow-hidden
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
                              <span className="inline-block bg-primary/10 text-primary text-[9px]
                                               px-1.5 py-0.5 mb-1 font-bold uppercase tracking-wide">
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

      {/* ══ 5. STATS — colossal numbers ════════════════════════════════════════ */}
      <section className="bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 lg:grid-cols-4 gap-[2px] bg-sidebar-border/50"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeInUp}
              className="bg-foreground flex flex-col items-center justify-center
                         px-6 py-16 sm:py-20 text-center group
                         hover:bg-sidebar-accent/15 transition-colors duration-300 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0
                              group-hover:scale-x-100 origin-left transition-transform duration-300" />
              <span className="font-display font-extrabold tabular-nums leading-none
                               text-[3.5rem] sm:text-[5rem] lg:text-[6.5rem]
                               text-sidebar-foreground mb-3
                               group-hover:text-primary transition-colors duration-300">
                <StatCounter value={stat.value} />
              </span>
              <span className="text-sidebar-foreground/40 text-[10px] uppercase tracking-[0.25em] font-bold">
                {L(stat)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══ 6. PARTNERS — dark marquee ══════════════════════════════════════════ */}
      <section className="bg-sidebar border-y-2 border-sidebar-border py-12 overflow-hidden relative">
        <p className="text-center text-sidebar-foreground/30 text-[10px] uppercase tracking-[0.3em]
                      font-bold mb-8">
          {L({ en: 'Trusted by leading brands worldwide', fr: 'Reconnu par les grandes marques mondiales' })}
        </p>
        <div className="marquee-wrap space-y-3 select-none">
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

      {/* ══ 7. PROCESS — 4-step gap-grid ════════════════════════════════════════ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="mb-14">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-primary flex-shrink-0" />
              {L({ en: 'How It Works', fr: 'Comment Ça Marche' })}
            </p>
            <h2 className="font-display font-extrabold text-section [text-wrap:balance]
                           whitespace-pre-line max-w-xl">
              {L({ en: 'From Request\nto Delivery.', fr: 'De la Demande\nà la Livraison.' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-border"
          >
            {orderSteps.map((step, i) => (
              <div key={i} className="bg-background">
                <ProcessStep {...step} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 8. CTA — cinematic full-bleed ══════════════════════════════════════ */}
      <section className="relative bg-sidebar py-28 sm:py-40 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1800&auto=format&fit=crop&q=60"
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar/90 via-sidebar/70 to-sidebar/90" />
        <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={fadeInUp}
              className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-6
                         flex items-center justify-center gap-3">
              <span className="w-6 h-px bg-primary" />
              {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
              <span className="w-6 h-px bg-primary" />
            </motion.p>

            <motion.h2 variants={fadeInUp}
              className="font-display font-extrabold text-sidebar-foreground
                         text-hero mb-8 [text-wrap:balance] whitespace-pre-line">
              {L({ en: "Let's Move Your\nBusiness Forward.", fr: 'Faisons Avancer\nVotre Business.' })}
            </motion.h2>

            <motion.p variants={fadeInUp}
              className="text-sidebar-foreground/65 text-xl max-w-lg mx-auto mb-12 leading-relaxed">
              {L({
                en: 'One partner for freight, industrial supply and general commerce — across 30+ countries.',
                fr: 'Un partenaire pour le fret, la fourniture industrielle et le commerce général — dans 30+ pays.',
              })}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg"
                className="font-semibold rounded-none h-14 px-10 text-base shadow-none">
                <Link href="/contact">
                  {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="font-semibold rounded-none h-14 px-10 text-base bg-transparent
                           border-2 border-sidebar-foreground/25 text-sidebar-foreground
                           hover:bg-sidebar-foreground/10 hover:border-sidebar-foreground/45">
                <Link href="/quote">
                  {L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
