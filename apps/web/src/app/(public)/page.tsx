'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, ArrowUpRight, Globe2, Ship, Factory, BarChart3,
  Handshake, TreePine, Package, FileText, Clock, Truck, ChevronRight,
  Users2, ShieldCheck,
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

const heroBg =
  'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1800&auto=format&fit=crop&q=80';

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
    image:   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80',
    tag:     { en: 'Supply', fr: 'Fourniture' },
    href:    '/products',
  },
  {
    label:   { en: 'Timber & Natural Resources', fr: 'Bois & Ressources Naturelles' },
    heading: { en: 'Certified Timber\nfor Global Markets.', fr: 'Bois Certifié\npour Marchés Mondiaux.' },
    body:    { en: 'We export certified tropical species for international construction and general trade — sustainably sourced from Central African forests with full documentation.', fr: 'Nous exportons des essences tropicales certifiées pour la construction internationale et le commerce général.' },
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
  { en: 'Power Generators',    fr: 'Groupes Électrogènes',  descEn: 'Diesel, gas & standby power units', descFr: 'Groupes diesel, gaz et secours',             image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=75', tag: { en: 'Industrial', fr: 'Industriel' } },
  { en: 'Lubricants & Oils',  fr: 'Lubrifiants & Huiles',   descEn: 'Total, Shell and OEM-grade lubricants', descFr: 'Lubrifiants Total, Shell et marques OEM', image: 'https://images.unsplash.com/photo-1635766003440-ebdef3df71e1?w=600&auto=format&fit=crop&q=75', tag: { en: 'Supply', fr: 'Fourniture' } },
  { en: 'Timber & Logs',      fr: 'Bois & Grumes',           descEn: 'Certified tropical species for export', descFr: 'Essences tropicales certifiées',           image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&auto=format&fit=crop&q=75', tag: { en: 'Trade', fr: 'Commerce' } },
  { en: 'Filters & Parts',    fr: 'Filtres & Pièces',        descEn: 'OEM-grade filters for all machinery', descFr: 'Filtres OEM pour toutes machines',           image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&auto=format&fit=crop&q=75', tag: { en: 'Industrial', fr: 'Industriel' } },
  { en: 'Heavy Equipment',    fr: 'Équipements Lourds',      descEn: 'Machinery, tools and structural materials', descFr: 'Machines, outils et matériaux',        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop&q=75', tag: { en: 'Supply', fr: 'Fourniture' } },
  { en: 'General Merchandise',fr: 'Marchandises Générales',  descEn: 'Wide range of consumer and trade goods', descFr: 'Large gamme de biens de consommation',   image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=75', tag: { en: 'Commerce', fr: 'Commerce' } },
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
      variants={fadeInUp}
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="group bg-white border border-border rounded-2xl p-7
                 shadow-sm hover:shadow-xl hover:border-primary/30
                 transition-all duration-300 flex flex-col"
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

      <h3 className="font-display font-bold text-xl text-foreground mb-3 leading-tight">
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
        <h3 className="font-display font-extrabold text-section text-foreground
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
}

function ProductCategoryCard({ en, fr, descEn, descFr, image, tag }: ProductCategoryCardProps) {
  const { L } = useLanguage();
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
      className="group bg-white border border-border rounded-2xl overflow-hidden
                 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <Image
          src={image}
          alt={en}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground
                         text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
          {L(tag)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-base text-foreground mb-1.5
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
    <div className="flex items-center gap-2.5 mx-3 px-5 py-3 bg-white border border-border
                    rounded-xl hover:border-primary/40 hover:shadow-md
                    transition-all duration-200 cursor-default flex-shrink-0">
      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center
                      flex-shrink-0 overflow-hidden">
        {b.logoUrl
          ? <img src={b.logoUrl} alt={b.name} width={32} height={32}
              className="w-full h-full object-contain p-0.5" />
          : <span className="text-xs font-display font-extrabold text-primary">
              {b.name.charAt(0)}
            </span>}
      </div>
      <span className="font-semibold text-sm text-foreground/70 whitespace-nowrap">
        {b.name}
      </span>
    </div>
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
    <motion.div variants={fadeInUp} className="group flex flex-col items-start lg:items-center text-left lg:text-center">
      {/* Number + icon stack */}
      <div className="relative mb-5">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center
                        shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background
                         rounded-full flex items-center justify-center text-[10px] font-bold">
          {num}
        </span>
      </div>

      <h3 className="font-display font-bold text-base text-foreground mb-2 leading-tight">
        {L(title)}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-[200px] lg:max-w-[180px]">
        {L(desc)}
      </p>
      {href && action && (
        <Link href={href}
          className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold
                     hover:gap-3 transition-all duration-200">
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

  const { data: featuredProducts, isLoading } = useQuery<any[]>({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/api/products/featured'),
  });
  const { data: apiPartners = [] } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: () => api.get('/api/partners'),
    staleTime: 5 * 60 * 1000,
  });

  const staticBrands: Partner[] = [
    { id: 101, name: 'Total Energies',   sectorEn: 'Energy',      sectorFr: 'Énergie' },
    { id: 102, name: 'Shell',            sectorEn: 'Energy',      sectorFr: 'Énergie' },
    { id: 103, name: 'CMA CGM',          sectorEn: 'Shipping',    sectorFr: 'Transport Maritime' },
    { id: 104, name: 'DHL',             sectorEn: 'Logistics',   sectorFr: 'Logistique' },
    { id: 105, name: 'Bolloré Logistics',sectorEn: 'Logistics',   sectorFr: 'Logistique' },
    { id: 106, name: 'Maersk',          sectorEn: 'Shipping',    sectorFr: 'Transport Maritime' },
    { id: 107, name: 'MSC',             sectorEn: 'Shipping',    sectorFr: 'Transport Maritime' },
    { id: 108, name: 'Camair-Co',       sectorEn: 'Aviation',    sectorFr: 'Aviation' },
    { id: 109, name: 'Port de Douala',   sectorEn: 'Port',        sectorFr: 'Port' },
    { id: 110, name: 'CFAO',            sectorEn: 'Trade',       sectorFr: 'Commerce' },
    { id: 111, name: 'Ciments Cameroun',sectorEn: 'Industry',    sectorFr: 'Industrie' },
    { id: 112, name: 'Orange Cameroun', sectorEn: 'Telecom',     sectorFr: 'Télécoms' },
  ];

  const partners = apiPartners.length > 0 ? apiPartners : staticBrands;
  // All brands in each row, ×4 so single-set width (~3.4k px) always exceeds any viewport
  const brandsRow1 = [...partners, ...partners, ...partners, ...partners];
  const brandsRow2 = [...partners, ...partners, ...partners, ...partners];

  return (
    <>
      {/* ══ 1. HERO — cinematic medium-height ═════════════════════════════════ */}
      <section className="relative h-[72vh] min-h-[520px] overflow-hidden">
        {/* Background image */}
        <Image
          src={heroBg}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {/* Cinematic gradient overlay — darker left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-2xl"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Eyebrow */}
              <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
                <span className="w-8 h-px bg-primary" />
                <span className="text-white/80 text-xs font-semibold uppercase tracking-[0.3em]">
                  {L({ en: 'Global Logistics & Commerce', fr: 'Logistique & Commerce Mondial' })}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="font-display font-extrabold text-white text-hero
                           leading-[0.9] tracking-[-0.02em] mb-6"
              >
                {L({ en: 'TRADE.\nSHIP.\nSUPPLY.', fr: 'TRADEZ.\nEXPÉDIEZ.\nAPPROVISIONNEZ.' })}
              </motion.h1>

              {/* Sub */}
              <motion.p variants={fadeInUp}
                className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg">
                {L({
                  en: 'LTIC SARL delivers freight, industrial supply and general commerce across 30+ countries — one partner, zero complications.',
                  fr: 'LTIC SARL livre fret, fournitures industrielles et commerce général dans 30+ pays — un partenaire, zéro complication.',
                })}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <Button asChild size="lg"
                  className="font-semibold rounded-full h-12 px-8 shadow-lg
                             shadow-primary/30 text-base">
                  <Link href="/quote">
                    {L({ en: 'Get a Free Quote', fr: 'Obtenir un Devis Gratuit' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                  className="font-semibold rounded-full h-12 px-8 text-base bg-white/10
                             border-white/40 text-white hover:bg-white/20 hover:border-white/70
                             backdrop-blur-sm">
                  <Link href="/products">
                    {L({ en: 'Browse Products', fr: 'Voir les Produits' })}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* ══ VALUE RIBBON — bridges hero → services ════════════════════════════ */}
      <div className="bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {([
              { icon: Globe2,      en: '30+ Countries Served',  fr: '30+ Pays Desservis' },
              { icon: Users2,      en: '500+ Trusted Clients',  fr: '500+ Clients' },
              { icon: Clock,       en: '24h Quote Turnaround',  fr: 'Devis en 24h' },
              { icon: ShieldCheck, en: 'Fully Insured Cargo',   fr: 'Cargo Assuré' },
            ] as const).map(({ icon: Icon, en, fr }, i) => (
              <div key={i} className="flex items-center justify-center gap-2.5 py-5 px-3">
                <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-white/70 text-xs sm:text-sm font-semibold whitespace-nowrap">
                  {L({ en, fr })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 2. SERVICES — clean light cards ════════════════════════════════════ */}
      <section className="bg-background py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <motion.div variants={fadeInLeft}>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
                {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
              </p>
              <h2 className="font-display font-extrabold text-section text-foreground
                             [text-wrap:balance] max-w-xl whitespace-pre-line">
                {L({ en: 'Six Services,\nOne Reliable Partner.', fr: 'Six Services,\nUn Partenaire Fiable.' })}
              </h2>
            </motion.div>
            <motion.div variants={fadeInRight} className="flex-shrink-0">
              <Button asChild variant="outline"
                className="rounded-full border-border font-semibold text-sm
                           hover:border-primary/50 hover:text-primary">
                <Link href="/services">
                  {L({ en: 'All Services', fr: 'Tous les Services' })}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Card grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
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

      {/* ══ 3. FEATURES — editorial image+copy blocks ══════════════════════════ */}
      <section className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="mb-4">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
              {L({ en: 'Products & Commerce', fr: 'Produits & Commerce' })}
            </p>
            <h2 className="font-display font-extrabold text-section text-foreground
                           [text-wrap:balance] max-w-2xl whitespace-pre-line">
              {L({ en: 'A Wide Range of Products,\nDelivered Anywhere.', fr: 'Une Large Gamme de Produits,\nLivrée Partout.' })}
            </h2>
          </motion.div>

          {features.map((feat, i) => (
            <FeatureBlock key={feat.label.en} {...feat} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ══ 4. PRODUCT CATALOG — tile grid ════════════════════════════════════ */}
      <section className="bg-background py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-3">
                {L({ en: 'Our Catalog', fr: 'Notre Catalogue' })}
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground">
                {L({ en: 'Browse by Category', fr: 'Parcourir par Catégorie' })}
              </h2>
            </motion.div>
            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <Button asChild variant="outline"
                className="rounded-full border-border font-semibold text-sm
                           hover:border-primary/50 hover:text-primary">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {productCategories.map(cat => (
              <ProductCategoryCard key={cat.en} {...cat} />
            ))}
          </motion.div>

          {/* API featured products */}
          {(isLoading || (featuredProducts && featuredProducts.length > 0)) && (
            <div className="mt-12">
              <p className="font-display font-bold text-xs uppercase tracking-[0.2em]
                            text-muted-foreground mb-6">
                {L({ en: 'Featured This Week', fr: 'En Vedette Cette Semaine' })}
              </p>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
              >
                {isLoading
                  ? Array(6).fill(0).map((_, i) => (
                      <div key={i} className="bg-white border border-border rounded-xl overflow-hidden">
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
                          className="group bg-white border border-border rounded-xl overflow-hidden
                                     hover:border-primary/40 hover:shadow-md transition-all duration-200 block">
                          <div className="aspect-square relative bg-muted overflow-hidden">
                            {product.imageUrl && (
                              <Image src={product.imageUrl}
                                alt={L({ en: product.nameEn, fr: product.nameFr })}
                                fill className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                              />
                            )}
                          </div>
                          <div className="p-3">
                            {product.categoryName && (
                              <span className="inline-block bg-primary/10 text-primary text-[9px]
                                               px-1.5 py-0.5 mb-1 font-bold uppercase tracking-wide rounded-full">
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

      {/* ══ 5. PARTNERS — light marquee band ═══════════════════════════════════ */}
      <section className="bg-muted border-y border-border py-12 overflow-hidden relative">
        <p className="text-center text-muted-foreground text-[10px] uppercase tracking-[0.3em]
                      font-bold mb-8">
          {L({ en: 'Trusted by leading brands', fr: 'Reconnu par les grandes marques' })}
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
                        bg-gradient-to-r from-muted to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20
                        bg-gradient-to-l from-muted to-transparent z-10" />
      </section>

      {/* ══ 6. PROCESS — numbered steps ════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="text-center mb-16">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
              {L({ en: 'How It Works', fr: 'Comment Ça Marche' })}
            </p>
            <h2 className="font-display font-extrabold text-section text-foreground
                           [text-wrap:balance] max-w-xl mx-auto whitespace-pre-line">
              {L({ en: 'From Request\nto Delivery.', fr: 'De la Demande\nà la Livraison.' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
          >
            {orderSteps.map((step, i) => (
              <ProcessStep key={i} {...step} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 7. CTA — dark cinematic ════════════════════════════════════════════ */}
      <section className="relative bg-sidebar py-24 sm:py-36 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&auto=format&fit=crop&q=60"
          alt=""
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar/95 via-sidebar/80 to-sidebar/90" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={fadeInUp}
              className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-6">
              {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
            </motion.p>

            <motion.h2 variants={fadeInUp}
              className="font-display font-extrabold text-sidebar-foreground
                         text-hero mb-6 [text-wrap:balance] whitespace-pre-line">
              {L({ en: "Let's Move Your\nBusiness Forward.", fr: 'Faisons Avancer\nVotre Business.' })}
            </motion.h2>

            <motion.p variants={fadeInUp}
              className="text-sidebar-foreground/65 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              {L({
                en: 'One partner for freight, industrial supply and general commerce — across 30+ countries.',
                fr: 'Un partenaire pour le fret, la fourniture industrielle et le commerce général — dans 30+ pays.',
              })}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg"
                className="font-semibold rounded-full h-14 px-10 text-base shadow-lg
                           shadow-primary/30">
                <Link href="/contact">
                  {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="font-semibold rounded-full h-14 px-10 text-base bg-white/10
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
