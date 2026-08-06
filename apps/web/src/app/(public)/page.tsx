'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, ArrowUpRight, Globe2, Ship, Factory, BarChart3,
  Handshake, TreePine, Package, FileText, Clock, Truck, ChevronLeft, ChevronRight,
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

const HERO_INTERVAL = 5500;

// Per-slide Ken Burns: each slide gets a unique zoom + pan direction
const kenBurns = [
  // Slide 0 — zoom out, drift from top-right to centre
  { initial: { scale: 1.14, x: '2.5%', y: '1.5%' },  animate: { scale: 1.0, x: '0%', y: '0%' } },
  // Slide 1 — zoom in, drift from bottom-left to centre
  { initial: { scale: 1.0,  x: '-2%',  y: '1%' },     animate: { scale: 1.12, x: '0%', y: '0%' } },
  // Slide 2 — gentle zoom out, slow upward drift
  { initial: { scale: 1.1,  x: '0%',   y: '2%' },     animate: { scale: 1.0, x: '0%', y: '0%' } },
] as const;

const heroSlides = [
  {
    tag:   { en: 'Logistics & Transit',  fr: 'Logistique & Transit' },
    lines: { en: 'WE MOVE\nYOUR WORLD.',        fr: 'NOUS BOUGEONS\nVOTRE MONDE.' },
    sub:   { en: 'End-to-end freight forwarding across 30+ countries — air, sea and road, fully tracked.', fr: 'Freight forwarding complet dans 30+ pays — aérien, maritime et routier, entièrement suivi.' },
    cta1:  { label: { en: 'Get a Free Quote',  fr: 'Obtenir un Devis' },  href: '/quote' },
    cta2:  { label: { en: 'Our Services',      fr: 'Nos Services' },      href: '/services' },
    image: 'https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?w=1800&auto=format&fit=crop&q=80',
    theme: {
      tag:      'text-blue-400',
      tagBg:    'bg-blue-400',
      headline: 'text-white',
      sub:      'text-slate-200/75',
      overlay:  'linear-gradient(105deg,rgba(2,8,23,0.93) 0%,rgba(2,8,23,0.62) 42%,rgba(2,8,23,0.12) 100%)',
    },
  },
  {
    tag:   { en: 'Industrial Supply',    fr: 'Fourniture Industrielle' },
    lines: { en: 'POWERED BY\nEXPERTISE.',      fr: 'ALIMENTÉ PAR\nL\'EXPERTISE.' },
    sub:   { en: 'Generators, lubricants and OEM-grade parts — Total, Shell and certified industrial brands.', fr: 'Générateurs, lubrifiants et pièces OEM — Total, Shell et marques industrielles certifiées.' },
    cta1:  { label: { en: 'View Products',     fr: 'Voir les Produits' }, href: '/products' },
    cta2:  { label: { en: 'Request a Quote',   fr: 'Demander un Devis' }, href: '/quote' },
    image: 'https://images.unsplash.com/photo-1670689334799-cdc6777db8cc?w=1800&auto=format&fit=crop&q=80',
    theme: {
      tag:      'text-amber-400',
      tagBg:    'bg-amber-400',
      headline: 'text-orange-50',
      sub:      'text-orange-100/70',
      overlay:  'linear-gradient(105deg,rgba(12,6,0,0.94) 0%,rgba(12,6,0,0.64) 42%,rgba(12,6,0,0.10) 100%)',
    },
  },
  {
    tag:   { en: 'Global Commerce',      fr: 'Commerce Mondial' },
    lines: { en: 'TRADE ACROSS\nALL BORDERS.',   fr: 'COMMERCE SANS\nFRONTIÈRES.' },
    sub:   { en: 'Import, export and brand representation across emerging markets — one partner for every transaction.', fr: 'Import, export et représentation de marque sur marchés émergents — un partenaire pour chaque transaction.' },
    cta1:  { label: { en: 'Get a Free Quote',  fr: 'Obtenir un Devis' },  href: '/quote' },
    cta2:  { label: { en: 'About LTIC',        fr: 'À Propos de LTIC' }, href: '/about' },
    image: 'https://images.unsplash.com/photo-1768069794826-a31af289449f?w=1800&auto=format&fit=crop&q=80',
    video: '/videos/hero-borders.mp4',
    theme: {
      tag:      'text-yellow-300',
      tagBg:    'bg-yellow-300',
      headline: 'text-amber-50',
      sub:      'text-amber-100/70',
      overlay:  'linear-gradient(105deg,rgba(8,5,1,0.92) 0%,rgba(8,5,1,0.60) 42%,rgba(8,5,1,0.10) 100%)',
    },
  },
];

const services = [
  { icon: Ship,      en: 'Logistics & Transit',        fr: 'Logistique & Transit',               descEn: 'End-to-end freight forwarding, customs clearance and international transit by air, sea and road.',        descFr: 'Freight forwarding complet, dédouanement et transit international.' },
  { icon: Globe2,    en: 'Import & Export',            fr: 'Import & Export',                    descEn: 'Cross-border trade facilitation with expert compliance management and full documentation support.',        descFr: 'Facilitation du commerce transfrontalier avec gestion de la conformité.' },
  { icon: Factory,   en: 'Industrial Supply',          fr: 'Fourniture Industrielle',            descEn: 'Generators, lubricants, filters and heavy materials — Total, Shell and certified OEM brands.',           descFr: 'Générateurs, lubrifiants, filtres — Total, Shell et marques OEM certifiées.' },
  { icon: TreePine,  en: 'Timber & Trade',             fr: 'Bois & Commerce',                   descEn: 'Certified tropical timber and logs for international construction and general trade markets.',             descFr: 'Bois tropicaux certifiés pour la construction et le commerce international.' },
  { icon: BarChart3, en: 'Supply Chain Consulting',    fr: "Conseil Chaîne d'Approvisionnement", descEn: 'Strategic logistics optimization, procurement consulting and risk management for global markets.',         descFr: 'Optimisation logistique, conseil en approvisionnement et gestion des risques.' },
  { icon: Handshake, en: 'Commercial Representation', fr: 'Représentation Commerciale',         descEn: 'Brand representation, joint ventures and distribution partnerships across emerging markets.',              descFr: 'Représentation de marque et partenariats de distribution sur marchés émergents.' },
];

const features = [
  {
    label:   { en: 'Industrial Supply',          fr: 'Fourniture Industrielle' },
    heading: { en: 'Industrial Products\nDelivered On-Time.', fr: 'Produits Industriels\nLivrés à Temps.' },
    body:    { en: 'From power generators to OEM-grade lubricants, we source and ship the industrial essentials your operations depend on — Total, Shell and certified OEM brands, shipped anywhere.', fr: 'Des groupes électrogènes aux lubrifiants OEM, nous approvisionnons les produits industriels essentiels — Total, Shell et marques OEM certifiées.' },
    image:   '/images/industrial-supply.jpg',
    tag:     { en: 'Supply', fr: 'Fourniture' },
    href:    '/products',
  },
  {
    label:   { en: 'Timber & Natural Resources', fr: 'Bois & Ressources Naturelles' },
    heading: { en: 'Certified Timber\nfor Global Markets.', fr: 'Bois Certifié\npour Marchés Mondiaux.' },
    body:    { en: 'We export certified tropical species for international construction and general trade — sustainably sourced from Central African forests with full documentation.', fr: 'Nous exportons des essences tropicales certifiées pour la construction internationale et le commerce général.' },
    image:   '/images/timber-resources.jpg',
    tag:     { en: 'Trade', fr: 'Commerce' },
    href:    '/products',
  },
  {
    label:   { en: 'General Commerce',           fr: 'Commerce Général' },
    heading: { en: 'Everything Your\nBusiness Needs.', fr: 'Tout Ce Dont\nVotre Entreprise a Besoin.' },
    body:    { en: 'A diverse catalog of consumer and trade goods — sourced globally and delivered anywhere. From bulk commodity orders to specialized procurement, we handle it all.', fr: 'Un catalogue diversifié de biens de consommation et commerciaux, sourcés mondialement et livrés partout.' },
    image:   '/images/general-commerce.jpg',
    tag:     { en: 'Commerce', fr: 'Commerce' },
    href:    '/products',
  },
];

const productCategories = [
  { en: 'Power Generators',    fr: 'Groupes Électrogènes',  descEn: 'Diesel, gas & standby power units', descFr: 'Groupes diesel, gaz et secours',             image: '/images/power-generators.jpg', tag: { en: 'Industrial', fr: 'Industriel' } },
  { en: 'Lubricants & Oils',  fr: 'Lubrifiants & Huiles',   descEn: 'Total, Shell and OEM-grade lubricants', descFr: 'Lubrifiants Total, Shell et marques OEM', image: '/images/lubricants-oils.jpg', tag: { en: 'Supply', fr: 'Fourniture' } },
  { en: 'Timber & Logs',      fr: 'Bois & Grumes',           descEn: 'Certified tropical species for export', descFr: 'Essences tropicales certifiées',           image: '/images/timber-logs.jpg', tag: { en: 'Trade', fr: 'Commerce' } },
  { en: 'Filters & Parts',    fr: 'Filtres & Pièces',        descEn: 'OEM-grade filters for all machinery', descFr: 'Filtres OEM pour toutes machines',           image: '/images/filters-parts.jpg', tag: { en: 'Industrial', fr: 'Industriel' } },
  { en: 'Heavy Equipment',    fr: 'Équipements Lourds',      descEn: 'Machinery, tools and structural materials', descFr: 'Machines, outils et matériaux',        image: '/images/heavy-equipment.jpg', tag: { en: 'Supply', fr: 'Fourniture' } },
  { en: 'General Merchandise',fr: 'Marchandises Générales',  descEn: 'Wide range of consumer and trade goods', descFr: 'Large gamme de biens de consommation',   image: '/images/general-merchandise.jpg', tag: { en: 'Commerce', fr: 'Commerce' } },
  { en: 'Marine & Maintenance Chemicals', fr: 'Produits Chimiques Marins & Entretien', descEn: 'Tank cleaners, degreasers & MARPOL-compliant marine chemicals', descFr: 'Nettoyants de réservoirs, dégraissants et produits chimiques marins conformes MARPOL', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=75', tag: { en: 'Marine', fr: 'Marine' } },
  { en: 'Industrial Chemicals & Raw Materials', fr: 'Produits Chimiques Industriels & Matières Premières', descEn: 'Sulfur, acids, solvents and bulk industrial minerals', descFr: 'Soufre, acides, solvants et minéraux industriels en vrac', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=75', tag: { en: 'Chemicals', fr: 'Chimique' } },
  { en: 'Food & Agricultural Products', fr: 'Produits Alimentaires & Agricoles', descEn: 'Cocoa, coffee, palm oil, spices & agri-food exports', descFr: 'Cacao, café, huile de palme, épices et exports agro-alimentaires', image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=600&auto=format&fit=crop&q=75', tag: { en: 'Agri-Food', fr: 'Agro-Alimentaire' } },
];

const orderSteps = [
  { icon: Package,  num: '01', title: { en: 'Browse Catalog',   fr: 'Parcourir le Catalogue' }, desc: { en: 'Explore our full industrial catalog and services.',      fr: 'Explorez notre catalogue industriel et nos services.' },         action: { en: 'View Catalog',   fr: 'Voir le Catalogue' }, href: '/products' },
  { icon: FileText, num: '02', title: { en: 'Request a Quote',  fr: 'Demander un Devis' },     desc: { en: 'Submit your requirements in under 2 minutes.',           fr: 'Soumettez vos besoins en moins de 2 minutes.' },                 action: { en: 'Get a Quote',    fr: 'Obtenir un Devis' }, href: '/quote' },
  { icon: Clock,    num: '03', title: { en: 'Receive an Offer', fr: 'Recevoir une Offre' },     desc: { en: 'Custom pricing and freight costs within 24–48 hours.',  fr: 'Offre personnalisée avec frais de transport sous 24–48h.' },     action: null, href: null },
  { icon: Truck,    num: '04', title: { en: 'Tracked Delivery', fr: 'Livraison Suivie' },       desc: { en: 'Customs, freight and logistics tracked in real time.',   fr: 'Douanes, fret et logistique suivis en temps réel.' },           action: { en: 'Track Shipment', fr: 'Suivre' },            href: '/tracking' },
];

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
      variants={{
        hidden: { opacity: 0, y: 48 },
        show:   { opacity: 1, y: 0,
                  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
      }}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      className="group bg-white border border-border rounded-2xl p-7
                 shadow-sm hover:shadow-xl hover:border-primary/30
                 transition-shadow transition-colors duration-300 flex flex-col"
    >
      {/* Icon */}
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5
                      group-hover:bg-primary group-hover:scale-110
                      transition-all duration-300 flex-shrink-0">
        <Icon className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-300" />
      </div>

      {/* Number badge */}
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/60 mb-2 block">
        {String(index + 1).padStart(2, '0')}
      </span>

      <h3 className="font-bold text-xl text-foreground mb-3 leading-tight">
        {L({ en, fr })}
      </h3>
      <p className="text-muted-foreground text-base leading-relaxed flex-1 mb-5">
        {L({ en: descEn, fr: descFr })}
      </p>

      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold
                   group-hover:gap-3 transition-all duration-200 w-fit"
      >
        {L({ en: 'Learn more', fr: 'En savoir plus' })}
        <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
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
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 lg:py-20
                  border-b border-border last:border-b-0
                  ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
    >
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
        <Image
          src={image}
          alt={L(label)}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <span className="absolute top-4 left-4 bg-primary text-primary-foreground
                         text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
          {L(tag)}
        </span>
      </div>

      {/* Copy */}
      <div>
        <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
          {L(label)}
        </p>
        <h3 className="font-extrabold text-section text-foreground
                       whitespace-pre-line leading-none mb-5">
          {L(heading)}
        </h3>
        <p className="text-muted-foreground text-base leading-relaxed mb-7 max-w-md">
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
  index: number;
}

const catalogEase = [0.16, 1, 0.3, 1] as const;

const rowVariant = {
  hidden: { opacity: 0, y: 48 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: catalogEase } },
};

const catalogStagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function ProductCategoryCard({ en, fr, image, tag, index }: ProductCategoryCardProps) {
  const { L } = useLanguage();
  const prefersReduced = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={rowVariant}
      whileHover={prefersReduced ? {} : { y: -1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <Link
        href="/products"
        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl
                   border-l-2 border-l-transparent border border-border
                   hover:border-l-primary hover:border-primary/30 hover:bg-primary/[0.04]
                   transition-all duration-200 ease-out
                   focus-visible:ring-2 focus-visible:ring-primary outline-none"
      >
        {/* Thumbnail */}
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted shadow-sm">
          <Image
            src={image}
            alt={en}
            width={40}
            height={40}
            className={`w-full h-full object-cover ${prefersReduced ? '' : 'transition-transform duration-300 ease-out group-hover:scale-110'}`}
            suppressHydrationWarning
          />
        </div>

        {/* Index */}
        <span className="font-display text-[10px] font-bold text-muted-foreground/30 w-4 flex-shrink-0 tabular-nums select-none group-hover:text-primary/40 transition-colors duration-200">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Name */}
        <span className="font-sans font-medium text-sm text-foreground/65 group-hover:text-primary transition-colors duration-200 flex-1 leading-tight">
          {L({ en, fr })}
        </span>

        {/* Tag */}
        <span className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wide
                         px-2 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0
                         group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
          {L(tag)}
        </span>

        {/* Arrow */}
        <ArrowUpRight suppressHydrationWarning className={`h-3.5 w-3.5 text-muted-foreground/35 group-hover:text-primary flex-shrink-0 transition-all duration-200 ${prefersReduced ? '' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
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
  const [imgFailed, setImgFailed] = useState(false);
  const logoSrc = b.logoUrl && !imgFailed ? b.logoUrl : null;
  return (
    <div className="flex items-center gap-2 mx-2.5 px-4 py-2 bg-white border border-border
                    rounded-lg hover:border-primary/40 hover:shadow-sm
                    transition-all duration-200 cursor-default flex-shrink-0">
      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 overflow-hidden rounded-sm">
        {logoSrc
          ? <img src={logoSrc} alt={b.name} width={28} height={28}
              className="w-full h-full object-contain"
              onError={() => setImgFailed(true)}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth <= 1 || img.naturalHeight <= 1) setImgFailed(true);
              }} />
          : <div className="w-full h-full bg-primary/15 rounded-sm flex items-center justify-center">
              <span className="text-[9px] font-black text-primary leading-none">
                {b.name.slice(0, 2).toUpperCase()}
              </span>
            </div>}
      </div>
      <span className="font-semibold text-xs text-foreground/65 whitespace-nowrap">
        {b.name}
      </span>
    </div>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { L, language } = useLanguage();
  const shouldReduce = useReducedMotion() ?? false;

  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo = (i: number) => setActiveSlide(i);
  const prev = () => setActiveSlide(i => (i - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setActiveSlide(i => (i + 1) % heroSlides.length);

  useEffect(() => {
    if (paused || shouldReduce) return;
    const id = setInterval(() => {
      setActiveSlide(i => (i + 1) % heroSlides.length);
    }, HERO_INTERVAL);
    return () => clearInterval(id);
  }, [activeSlide, paused, shouldReduce]);

  const { data: featuredProducts, isLoading } = useQuery<any[]>({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/api/products/featured'),
  });
  const { data: spotlightData } = useQuery<any>({
    queryKey: ['spotlight'],
    queryFn: () => api.get('/api/spotlight'),
    staleTime: 60 * 1000,
  });
  const { data: apiPartners = [] } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: () => api.get('/api/partners'),
    staleTime: 5 * 60 * 1000,
  });

  const staticBrands: Partner[] = [
    { id: 101, name: 'Total Energies',    sectorEn: 'Energy',    sectorFr: 'Énergie',            logoUrl: 'https://www.google.com/s2/favicons?domain=totalenergies.com&sz=128' },
    { id: 102, name: 'Shell',             sectorEn: 'Energy',    sectorFr: 'Énergie',            logoUrl: 'https://www.google.com/s2/favicons?domain=shell.com&sz=128' },
    { id: 103, name: 'CMA CGM',           sectorEn: 'Shipping',  sectorFr: 'Transport Maritime', logoUrl: 'https://www.google.com/s2/favicons?domain=cma-cgm.com&sz=128' },
    { id: 104, name: 'DHL',               sectorEn: 'Logistics', sectorFr: 'Logistique',         logoUrl: 'https://www.google.com/s2/favicons?domain=dhl.com&sz=128' },
    { id: 105, name: 'Bolloré Logistics', sectorEn: 'Logistics', sectorFr: 'Logistique',         logoUrl: 'https://www.google.com/s2/favicons?domain=bollore.com&sz=128' },
    { id: 106, name: 'Maersk',            sectorEn: 'Shipping',  sectorFr: 'Transport Maritime', logoUrl: 'https://www.google.com/s2/favicons?domain=maersk.com&sz=128' },
    { id: 107, name: 'MSC',               sectorEn: 'Shipping',  sectorFr: 'Transport Maritime', logoUrl: 'https://www.google.com/s2/favicons?domain=msc.com&sz=128' },
    { id: 108, name: 'Camair-Co',         sectorEn: 'Aviation',  sectorFr: 'Aviation',           logoUrl: '' },
    { id: 109, name: 'Port de Douala',    sectorEn: 'Port',      sectorFr: 'Port',               logoUrl: '' },
    { id: 110, name: 'CFAO',              sectorEn: 'Trade',     sectorFr: 'Commerce',           logoUrl: 'https://www.google.com/s2/favicons?domain=cfao.com&sz=128' },
    { id: 111, name: 'Ciments Cameroun',  sectorEn: 'Industry',  sectorFr: 'Industrie',          logoUrl: '' },
    { id: 112, name: 'Orange Cameroun',   sectorEn: 'Telecom',   sectorFr: 'Télécoms',           logoUrl: 'https://www.google.com/s2/favicons?domain=orange.cm&sz=128' },
  ];

  const partners = apiPartners.length > 0 ? apiPartners : staticBrands;

  // ── Spotlight exit animation (element-relative, works at any scroll position) ──
  const spotlightRef = useRef<HTMLElement>(null);
  const { scrollYProgress: exitProg } = useScroll({
    target: spotlightRef,
    offset: ['start start', 'end start'],
  });
  const rawExitOpacity = useTransform(exitProg, [0, 0.45, 1], [1, 0.3, 0], { clamp: true });
  const rawExitY       = useTransform(exitProg, [0, 1], [0, -56], { clamp: true });
  // Skip spring physics on mobile — too CPU-heavy; use raw motion values directly
  const smoothExitOpacity = useSpring(rawExitOpacity, isMobile ? { stiffness: 1000, damping: 100 } : { stiffness: 120, damping: 30, mass: 0.65, restDelta: 0.001 });
  const smoothExitY       = useSpring(rawExitY,       isMobile ? { stiffness: 1000, damping: 100 } : { stiffness: 120, damping: 30, mass: 0.65, restDelta: 0.001 });

  return (
    <>
      {/* ══ 1. HERO — Carousel ═══════════════════════════════════════════════════ */}
      <section
        className="relative h-[52dvh] sm:h-[72dvh] lg:h-[82dvh] min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] overflow-hidden bg-black"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── Animated backgrounds (crossfade + Ken Burns zoom) ── */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`bg-${activeSlide}`}
            className="absolute inset-0"
            style={isMobile ? undefined : { willChange: 'transform, opacity' }}
            initial={{ opacity: 0, ...(isMobile ? {} : { scale: kenBurns[activeSlide].initial.scale, x: kenBurns[activeSlide].initial.x, y: kenBurns[activeSlide].initial.y }) }}
            animate={{ opacity: 1, ...(isMobile ? {} : { scale: kenBurns[activeSlide].animate.scale, x: kenBurns[activeSlide].animate.x, y: kenBurns[activeSlide].animate.y }) }}
            exit={{ opacity: 0, transition: { duration: isMobile ? 0.5 : 1.0, ease: 'easeInOut' } }}
            transition={{
              opacity: { duration: isMobile ? 0.6 : 1.2, ease: 'easeInOut' },
              scale: { duration: HERO_INTERVAL / 1000 + 2.5, ease: [0.25, 0.46, 0.45, 0.94] },
              x:     { duration: HERO_INTERVAL / 1000 + 2.5, ease: [0.25, 0.46, 0.45, 0.94] },
              y:     { duration: HERO_INTERVAL / 1000 + 2.5, ease: [0.25, 0.46, 0.45, 0.94] },
            }}
          >
            {heroSlides[activeSlide].video ? (
              <video
                key={heroSlides[activeSlide].video}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center"
              >
                <source src={heroSlides[activeSlide].video} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={heroSlides[activeSlide].image}
                alt=""
                fill
                className="object-cover object-center"
                priority={activeSlide === 0}
                sizes="100vw"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Per-slide tinted overlay ── */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`overlay-${activeSlide}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ background: heroSlides[activeSlide].theme.overlay }}
          />
        </AnimatePresence>

        {/* ── Bottom vignette ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 sm:from-black/50 via-black/10 to-transparent pointer-events-none" />

        {/* ── Mobile: right-side vignette (slide gradients only cover the left on mobile) ── */}
        <div className="sm:hidden absolute inset-0 bg-gradient-to-l from-black/65 via-black/20 to-transparent pointer-events-none" />

        {/* ── Main content ── */}
        <div className="relative z-10 h-full flex items-center pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto w-full pl-4 pr-2 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }}
                className="max-w-[640px] xl:max-w-[780px]"
              >
                {/* Tag label */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                  className="flex items-center gap-3 mb-4 sm:mb-8"
                >
                  <span className={`h-px w-8 flex-shrink-0 ${heroSlides[activeSlide].theme.tagBg}`} />
                  <span className={`font-bold text-[10px] uppercase tracking-[0.38em] ${heroSlides[activeSlide].theme.tag}`}>
                    {L(heroSlides[activeSlide].tag)}
                  </span>
                </motion.div>

                {/* Headline — per-word clip reveal */}
                <h1 className={`font-display font-extrabold text-hero leading-[0.88] tracking-[-0.03em] mb-4 sm:mb-8 ${heroSlides[activeSlide].theme.headline}`}>
                  {isMobile
                    ? L(heroSlides[activeSlide].lines).split('\n').map((line, li) => (
                        <span key={li} className="block">{line}</span>
                      ))
                    : L(heroSlides[activeSlide].lines).split('\n').map((line, li) => (
                        <span key={li} className="block overflow-hidden">
                          {line.split(' ').map((word, wi) => (
                            <motion.span
                              key={wi}
                              className="inline-block mr-[0.18em] last:mr-0"
                              initial={{ y: '115%' }}
                              animate={{ y: 0 }}
                              transition={{
                                duration: 0.58,
                                ease: [0.16, 1, 0.3, 1],
                                delay: 0.08 + (li * 3 + wi) * 0.055,
                              }}
                            >
                              {word}
                            </motion.span>
                          ))}
                        </span>
                      ))
                  }
                </h1>

                {/* Separator — hidden on mobile to save vertical space */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
                  className={`hidden sm:block h-px w-14 origin-left mb-6 ${heroSlides[activeSlide].theme.tagBg}`}
                />

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
                  className={`text-[0.82rem] sm:text-[1.05rem] leading-[1.6] sm:leading-[1.7] mb-5 sm:mb-10 max-w-[36ch] sm:max-w-[42ch] line-clamp-2 sm:line-clamp-none ${heroSlides[activeSlide].theme.sub}`}
                >
                  {L(heroSlides[activeSlide].sub)}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.66 }}
                  className="flex flex-row gap-2 sm:gap-3"
                >
                  <Button asChild size="lg"
                    className="font-semibold h-11 px-4 sm:h-12 sm:px-8 shadow-lg shadow-black/40 text-xs sm:text-base w-auto justify-center">
                    <Link href={heroSlides[activeSlide].cta1.href}>
                      {L(heroSlides[activeSlide].cta1.label)}
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 flex-shrink-0" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline"
                    className="font-semibold h-11 px-4 sm:h-12 sm:px-8 text-xs sm:text-base bg-white/8
                               border-white/35 text-white hover:bg-white/18 hover:border-white/60
                               w-auto justify-center">
                    <Link href={heroSlides[activeSlide].cta2.href}>
                      {L(heroSlides[activeSlide].cta2.label)}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Bottom navigation bar ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 pb-7 sm:pb-9">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

            {/* Slide dots — padded for 44px touch targets on mobile */}
            <div className="flex items-center gap-1 sm:gap-2.5" role="tablist" aria-label="Hero slides">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeSlide}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className="flex items-center justify-center py-5 px-5 sm:p-0 -my-5 -mx-5 sm:m-0"
                >
                  <span className={`block rounded-full transition-all duration-300 ${
                    i === activeSlide
                      ? 'w-7 sm:w-8 h-[5px] sm:h-[4px] bg-primary'
                      : 'w-[5px] h-[5px] sm:w-[4px] sm:h-[4px] bg-white/35 hover:bg-white/60'
                  }`} />
                </button>
              ))}
            </div>

            {/* Progress bar + arrows */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block w-24 h-px bg-white/12 relative overflow-hidden rounded-full">
                {!shouldReduce && (
                  <motion.div
                    key={`progress-${activeSlide}`}
                    className="absolute inset-y-0 left-0 w-full bg-white/50 origin-left rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? undefined : 1 }}
                    transition={{ duration: HERO_INTERVAL / 1000, ease: 'linear' }}
                  />
                )}
              </div>

              <div className="flex gap-1.5">
                <button onClick={prev} aria-label="Previous slide"
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-white/20 text-white/50
                             hover:bg-white/10 hover:text-white hover:border-white/45
                             transition-all duration-200 flex items-center justify-center">
                  <ChevronLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                </button>
                <button onClick={next} aria-label="Next slide"
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-white/20 text-white/50
                             hover:bg-white/10 hover:text-white hover:border-white/45
                             transition-all duration-200 flex items-center justify-center">
                  <ChevronRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ══ 2. SERVICES — clean light cards ════════════════════════════════════ */}
      <section className="bg-background py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial="hidden" whileInView="show" viewport={viewportOnce}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <motion.div
              variants={{ hidden: { opacity: 0, x: -22 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } } }}>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
                {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
              </p>
              <h2 className="font-extrabold text-section text-foreground
                             [text-wrap:balance] max-w-xl whitespace-pre-line">
                {L({ en: 'Six Services,\nOne Reliable Partner.', fr: 'Six Services,\nUn Partenaire Fiable.' })}
              </h2>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, x: 22 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } } }}
              className="flex-shrink-0">
              <Button asChild variant="outline"
                className="border-border font-semibold text-sm hover:border-primary/50 hover:text-primary h-11">
                <Link href="/services">
                  {L({ en: 'All Services', fr: 'Tous les Services' })}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Card grid — spring stagger */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
        </div>
      </section>

      {/* ══ 3. FEATURED THIS WEEK ════════════════════════════════════════════ */}
      {mounted && (isLoading || (featuredProducts && featuredProducts.length > 0)) && (
        <section className="bg-background py-3 sm:py-20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
                <p className="text-primary font-bold text-[11px] uppercase tracking-[0.28em] mb-1">
                  {L({ en: 'Products', fr: 'Produits' })}
                </p>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground leading-tight">
                  {L({ en: 'Featured This Week', fr: 'En Vedette Cette Semaine' })}
                </h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.38, ease: catalogEase, delay: 0.2 }}
              >
                <Button asChild variant="outline" size="sm"
                  className="border-border font-semibold text-sm hover:border-primary/50 hover:text-primary rounded-full">
                  <Link href="/products">
                    {L({ en: 'View All', fr: 'Tout Voir' })}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            >
              {isLoading
                ? Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white border border-border rounded-xl overflow-hidden flex flex-col">
                      <Skeleton className="aspect-square w-full flex-shrink-0" />
                      <div className="p-2.5 space-y-1.5 flex-1">
                        <Skeleton className="h-2.5 w-10" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))
                : featuredProducts?.slice(0, 6).map(product => (
                    <motion.div key={product.id} variants={scaleIn} className="h-full"
                      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 320, damping: 22 } }}>
                      <Link href={`/products/${product.slug}`}
                        className="group bg-white border border-border rounded-xl overflow-hidden
                                   hover:border-primary/40 hover:shadow-md transition-all duration-200
                                   flex flex-col h-full">
                        <div className="aspect-square relative bg-white overflow-hidden flex-shrink-0">
                          {product.imageUrl && (
                            <Image src={product.imageUrl}
                              alt={L({ en: product.nameEn, fr: product.nameFr })}
                              fill className="object-contain p-2"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            />
                          )}
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          {product.categoryName && (
                            <span className="inline-block bg-primary/10 text-primary text-[9px]
                                             px-1.5 py-0.5 mb-1.5 font-semibold rounded-full w-fit">
                              {product.categoryName}
                            </span>
                          )}
                          <p className="font-sans font-medium text-xs leading-snug text-foreground/65
                                         group-hover:text-primary transition-colors duration-150
                                         line-clamp-2 flex-1">
                            {L({ en: product.nameEn, fr: product.nameFr })}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══ 4. PRODUCT CATALOG — Browse by Category ══════════════════════════ */}
      <section className="bg-muted/40 py-3 sm:py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial="hidden" whileInView="show" viewport={viewportOnce}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            >
              <motion.p
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: catalogEase } } }}
                className="text-primary font-bold text-[11px] uppercase tracking-[0.28em] mb-1"
              >
                {L({ en: 'Our Catalog', fr: 'Notre Catalogue' })}
              </motion.p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground leading-tight overflow-hidden">
                {L({ en: 'Browse by Category', fr: 'Parcourir par Catégorie' }).split(' ').map((word, wi) => (
                  <span key={wi} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
                    <motion.span
                      className="inline-block"
                      variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.44, ease: catalogEase } } }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.38, ease: catalogEase, delay: 0.2 }}
            >
              <Button asChild variant="outline" size="sm"
                className="border-border font-semibold text-sm hover:border-primary/50 hover:text-primary rounded-full">
                <Link href="/products">
                  {L({ en: 'View All', fr: 'Tout Voir' })}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={catalogStagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 gap-1.5"
          >
            {productCategories.map((cat, i) => (
              <ProductCategoryCard key={cat.en} {...cat} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 5. FEATURES — editorial image+copy blocks ══════════════════════════ */}
      <section className="bg-white py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="mb-4">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
              {L({ en: 'Products & Commerce', fr: 'Produits & Commerce' })}
            </p>
            <h2 className="font-extrabold text-section text-foreground
                           [text-wrap:balance] max-w-2xl whitespace-pre-line">
              {L({ en: 'A Wide Range of Products,\nDelivered Anywhere.', fr: 'Une Large Gamme de Produits,\nLivrée Partout.' })}
            </h2>
          </motion.div>

          {features.map((feat, i) => (
            <FeatureBlock key={feat.label.en} {...feat} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ══ PRODUCT SPOTLIGHT — admin-editable ═══════════════════════════════ */}
      {(spotlightData?.isActive !== false) && (
      <motion.section
        ref={spotlightRef}
        style={shouldReduce ? {} : {
          opacity: smoothExitOpacity,
          y: smoothExitY,
          willChange: 'transform, opacity',
        }}
        className="relative overflow-hidden bg-[#070f1a] border-t border-b border-white/[0.09]">

        {/* ── Background: atmospheric texture (admin-editable) ── */}
        <Image
          src={spotlightData?.bgImageUrl || '/images/lubricants-oils.jpg'}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-[0.38] scale-[1.02] select-none pointer-events-none"
        />
        {/* Deep overlay — keeps text legible over the image */}
        <div className="absolute inset-0 bg-gradient-to-br
                        from-[#070f1a]/88 via-[#0d1829]/70 to-[#070f1a]/84
                        pointer-events-none" />
        {/* Right blue bloom — smaller blur radius for iPad GPU budget */}
        <div className="absolute right-[4%] top-1/2 -translate-y-1/2
                        w-[320px] h-[320px] bg-primary/18 rounded-full blur-[90px]
                        pointer-events-none" />
        {/* Left cool glow */}
        <div className="absolute -left-16 top-1/2 -translate-y-1/2
                        w-[200px] h-[200px] bg-sky-900/22 rounded-full blur-[70px]
                        pointer-events-none" />
        {/* Top hairline shine */}
        <div className="absolute inset-x-0 top-0 h-px
                        bg-gradient-to-r from-transparent via-white/28 to-transparent
                        pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* ── Left: text inside glass card ── */}
            <motion.div
              variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="flex-1">

              {/* Glass card */}
              <div className="relative overflow-hidden text-center lg:text-left
                              bg-white/[0.07] backdrop-blur-md
                              border border-white/[0.14]
                              rounded-2xl p-8 lg:p-10
                              shadow-[0_8px_60px_-8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
                {/* Card inner shine at top */}
                <div className="absolute inset-x-0 top-0 h-px
                                bg-gradient-to-r from-transparent via-white/22 to-transparent
                                pointer-events-none" />
                {/* Blue bloom inside the card — top-left corner depth */}
                <div className="absolute -top-10 -left-10 w-28 h-28
                                bg-primary/20 rounded-full blur-2xl pointer-events-none" />

              {/* "Featured Product" live pill */}
              <div className="inline-flex items-center gap-2 bg-primary/25 border border-primary/60
                              rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <span className="text-white font-bold text-[11px] uppercase tracking-[0.32em]">
                  {L({ en: 'Featured Product', fr: 'Produit Vedette' })}
                </span>
              </div>

              {/* Category */}
              <p className="text-sidebar-foreground/55 text-[11px] uppercase tracking-[0.28em] font-semibold mb-3">
                {spotlightData?.label || L({ en: 'Consumer & Industrial Goods', fr: 'Produits Consommateurs & Industriels' })}
              </p>

              {/* Headline */}
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl
                             text-sidebar-foreground leading-[0.95] tracking-tight mb-5">
                {(spotlightData
                  ? (language === 'fr' ? spotlightData.headlineFr : spotlightData.headlineEn)
                  : L({ en: 'Premium Oils &\nContainer Supply.', fr: 'Huiles Premium &\nFourniture de Contenants.' })
                ).split('\n').map((line: string, i: number) => <span key={i} className="block">{line}</span>)}
              </h2>

              {/* Blue rule */}
              <div className="w-10 h-0.5 bg-primary mx-auto lg:mx-0 mb-5 rounded-full" />

              {/* Body */}
              <p className="text-sidebar-foreground text-sm sm:text-base leading-relaxed
                            mb-3 max-w-md mx-auto lg:mx-0">
                {spotlightData
                  ? (language === 'fr' ? spotlightData.bodyFr : spotlightData.bodyEn)
                  : L({
                      en: 'From premium sunflower and edible oils to a full range of industrial containers — sourced directly from certified producers, available for bulk or unit supply.',
                      fr: "Des huiles de tournesol et alimentaires premium à une gamme complète de contenants industriels — approvisionnés directement auprès de producteurs certifiés.",
                    })
                }
              </p>
              <p className="text-sidebar-foreground/80 text-sm leading-relaxed mb-8 max-w-sm mx-auto lg:mx-0">
                {spotlightData
                  ? (language === 'fr' ? spotlightData.subBodyFr : spotlightData.subBodyEn)
                  : L({
                      en: 'Available for export, import & commercial distribution across Africa and Europe.',
                      fr: "Disponible pour l'export, l'import et la distribution commerciale en Afrique et en Europe.",
                    })
                }
              </p>

              {/* Tag chips */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                {([
                  { en: 'Bulk & Unit Orders',  fr: 'Commandes Vrac & Unité' },
                  { en: 'Export Ready',        fr: "Prêt à l'Export" },
                  { en: 'Africa & Europe',     fr: 'Afrique & Europe' },
                ] as const).map(tag => (
                  <span key={tag.en}
                    className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20
                               rounded-full px-3 py-1 text-sidebar-foreground/80 text-[11px] font-medium
                               backdrop-blur-sm">
                    <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {L(tag)}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button asChild size="lg"
                  className="font-semibold h-11 px-7 shadow-lg shadow-primary/30">
                  <Link href={spotlightData?.cta1Href || '/quote'}>
                    {spotlightData
                      ? (language === 'fr' ? spotlightData.cta1LabelFr : spotlightData.cta1LabelEn)
                      : L({ en: 'Request Supply Quote', fr: 'Demander un Devis' })
                    }
                    <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                  className="font-semibold h-11 px-6 bg-white/8 border-white/20 text-white
                             hover:bg-white/16 hover:border-white/40 backdrop-blur-sm">
                  <Link href={spotlightData?.cta2Href || '/contact'}>
                    {spotlightData
                      ? (language === 'fr' ? spotlightData.cta2LabelFr : spotlightData.cta2LabelEn)
                      : L({ en: 'Contact Us', fr: 'Nous Contacter' })
                    }
                  </Link>
                </Button>
              </div>

              </div>{/* end glass card */}
            </motion.div>

            {/* ── Right: video ── */}
            <motion.div
              variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="relative flex-shrink-0 pb-7">
              {/* Outer ambient glow */}
              <div className="absolute -inset-6 rounded-[32px] bg-primary/20 blur-3xl pointer-events-none" />
              {/* Gradient ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-primary/30 to-transparent pointer-events-none" />
              {/* Phone-style media */}
              <div className="relative w-[175px] sm:w-[205px] rounded-[22px] overflow-hidden shadow-2xl ring-1 ring-white/15"
                   style={{ aspectRatio: '9/16' }}>
                {(!spotlightData || spotlightData.mediaType === 'video') ? (
                  <video autoPlay muted loop playsInline
                         className="absolute inset-0 w-full h-full object-cover"
                         style={{ filter: 'contrast(1.06) saturate(1.12) brightness(0.95)' }}>
                    <source src={spotlightData?.mediaUrl || '/videos/oils-collection.mp4'} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={spotlightData.mediaUrl}
                    alt="Spotlight product"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'contrast(1.06) saturate(1.12) brightness(0.95)' }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
                {/* Live badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {L({ en: 'Live Stock', fr: 'Stock Actuel' })}
                  </span>
                </div>
              </div>
              {/* Available for Order pill */}
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2
                              bg-primary text-primary-foreground rounded-full px-5 py-2
                              shadow-xl shadow-primary/30 flex items-center gap-2 whitespace-nowrap">
                <Package className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                  {L({ en: 'Available for Order', fr: 'Disponible à la Commande' })}
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>
      )}

      {/* ══ 6. PARTNERS — light marquee band ═══════════════════════════════════ */}
      <section className="bg-muted border-y border-border py-3 sm:py-20 overflow-hidden relative">
        <p className="text-center text-muted-foreground text-[10px] uppercase tracking-[0.3em]
                      font-bold mb-8">
          {L({ en: 'Trusted by leading brands', fr: 'Reconnu par les grandes marques' })}
        </p>
        {/* Each row is partners×2 — the CSS -50% translateX loops seamlessly */}
        <div className="marquee-wrap space-y-3 select-none">
          <div className="flex w-max marquee-left">
            {[...partners, ...partners].map((b, i) => <PartnerCard key={i} b={b} />)}
          </div>
          <div className="flex w-max marquee-right">
            {[...partners, ...partners].map((b, i) => <PartnerCard key={i} b={b} />)}
          </div>
        </div>
        <div className="pointer-events-none absolute left-0 top-0 h-full w-20
                        bg-gradient-to-r from-muted to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20
                        bg-gradient-to-l from-muted to-transparent z-10" />
      </section>

      {/* ══ 7. PROCESS — compact 2×2 / 4-col steps ══════════════════════════ */}
      <section className="bg-white py-3 sm:py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header — inline, saves vertical space vs centred block */}
          <motion.div
            variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8"
          >
            <div>
              <p className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-1.5">
                {L({ en: 'How It Works', fr: 'Comment Ça Marche' })}
              </p>
              <h2 className="font-extrabold text-2xl sm:text-3xl text-foreground leading-tight">
                {L({ en: 'From Request to Delivery.', fr: 'De la Demande à la Livraison.' })}
              </h2>
            </div>
            <Button asChild size="sm" variant="outline"
              className="self-start sm:self-auto border-border font-semibold text-xs
                         hover:border-primary/50 hover:text-primary flex-shrink-0">
              <Link href="/quote">
                {L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}
                <ArrowRight className="h-3 w-3 ml-1.5" />
              </Link>
            </Button>
          </motion.div>

          {/* Steps — 2×2 on mobile, single row on desktop */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
          >
            {orderSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group flex items-start gap-3 p-3.5 sm:p-4 rounded-xl
                             border border-border bg-muted/30
                             hover:bg-primary/5 hover:border-primary/25
                             transition-all duration-200"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center
                                    group-hover:bg-primary group-hover:scale-105
                                    transition-all duration-200">
                      <Icon className="h-4 w-4 text-primary group-hover:text-white transition-colors duration-200" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-[17px] h-[17px]
                                     bg-foreground text-background rounded-full
                                     text-[8px] font-black flex items-center justify-center leading-none">
                      {step.num}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-foreground leading-tight mb-1">
                      {L(step.title)}
                    </p>
                    <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed
                                  line-clamp-2 hidden sm:block">
                      {L(step.desc)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ══ 8. CTA — world map ══════════════════════════════════════════════════ */}
      <section className="relative bg-sidebar py-3 sm:py-20 overflow-hidden">

        {/* ── World map image (Natural Earth 110m land, generated from TopoJSON) ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/world-map.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none opacity-80"
        />

        {/* Blue colour wash — gives the map a vivid indigo tone */}
        <div className="absolute inset-0 bg-primary/10 mix-blend-screen pointer-events-none" />

        {/* Soft centre vignette — keeps headline legible without crushing the map */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_55%_at_50%_50%,hsl(var(--sidebar)/0.68)_0%,hsl(var(--sidebar)/0.08)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar/40 via-transparent to-sidebar/40" />

        {/* Decorative animated pins — purely CSS (compositor thread, no JS overhead) */}
        {([
          { x: 28.0, y: 33.0, delay: 0.0 },
          { x: 49.5, y: 21.5, delay: 0.5 },
          { x: 52.5, y: 47.5, delay: 1.0 },
          { x: 65.5, y: 35.5, delay: 0.3 },
          { x: 80.0, y: 55.0, delay: 0.8 },
          { x: 35.0, y: 65.0, delay: 1.3 },
          { x: 83.5, y: 32.5, delay: 0.6 },
        ] as const).map((pin, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <div className="absolute -inset-2 rounded-full border-2 border-primary/70 pin-ring-outer"
                 style={{ animationDelay: `${pin.delay}s` }} />
            <div className="absolute -inset-2 rounded-full border-2 border-primary/50 pin-ring-mid"
                 style={{ animationDelay: `${pin.delay + 0.3}s` }} />
            <div className="absolute -inset-2 rounded-full border border-primary/40 pin-ring-inner"
                 style={{ animationDelay: `${pin.delay + 0.6}s` }} />
            <div className="absolute -inset-1 rounded-full bg-primary/30 pin-ring-fill"
                 style={{ animationDelay: `${pin.delay}s` }} />
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_18px_7px_hsl(var(--primary)/0.7)]" />
          </div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={fadeInUp}
              className="text-white font-bold text-xs uppercase tracking-[0.3em] mb-6
                         drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
              {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
            </motion.p>

            <motion.h2 variants={fadeInUp}
              className="font-extrabold text-white
                         text-hero mb-6 [text-wrap:balance] whitespace-pre-line
                         drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)]">
              {L({ en: "Let's Move Your\nBusiness Forward.", fr: 'Faisons Avancer\nVotre Business.' })}
            </motion.h2>

            <motion.p variants={fadeInUp}
              className="text-white/90 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              {L({
                en: 'One partner for freight, industrial supply and general commerce — across 30+ countries.',
                fr: 'Un partenaire pour le fret, la fourniture industrielle et le commerce général — dans 30+ pays.',
              })}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg"
                className="font-semibold h-14 px-10 text-base shadow-lg shadow-primary/30">
                <Link href="/contact">
                  {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="font-semibold h-14 px-10 text-base bg-white/10
                           border-white/30 text-white hover:bg-white/20 hover:border-white/60
                           backdrop-blur-sm">
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
