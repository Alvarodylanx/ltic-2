'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, ArrowUpRight, Globe2, Ship, Factory, Droplets,
  Handshake, Package, FileText, Clock, Truck, GraduationCap, Wrench,
  ChevronLeft, ChevronRight, Calendar, Newspaper,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import {
  fadeInUp, fadeInLeft, fadeInRight, scaleIn, popIn,
  stagger, staggerFast, viewportOnce, fadeM, staggerM,
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
    tag:   { en: 'Maritime & Offshore',  fr: 'Maritime & Offshore' },
    lines: { en: 'YOUR PARTNER\nAT SEA.',        fr: 'VOTRE PARTENAIRE\nEN MER.' },
    sub:   { en: 'General ship chandling, offshore supply and vessel maintenance — LTIC SARL is your trusted maritime partner in the Gulf of Guinea.', fr: 'Avitaillement des navires, fournitures offshore et maintenance — LTIC SARL est votre partenaire maritime de confiance dans le Golfe de Guinée.' },
    cta1:  { label: { en: 'Maritime Services',  fr: 'Services Maritimes' }, href: '/services' },
    cta2:  { label: { en: 'Get a Quote',       fr: 'Demander un Devis' }, href: '/quote' },
    image: '/images/hero-slide-1.jpg',
    theme: {
      tag:      'text-blue-400',
      tagBg:    'bg-blue-400',
      headline: 'text-white',
      sub:      'text-slate-200/75',
      overlay:  'linear-gradient(105deg,rgba(2,8,23,0.93) 0%,rgba(2,8,23,0.62) 42%,rgba(2,8,23,0.12) 100%)',
    },
  },
  {
    tag:   { en: 'ECOKLIN — Made in Douala', fr: 'ECOKLIN — Fabriqué à Douala' },
    lines: { en: 'ECOKLIN.\nMADE IN DOUALA.',       fr: 'ECOKLIN.\nFABRIQUÉ À DOUALA.' },
    sub:   { en: 'LTIC SARL manufactures home care and industrial hygiene products under the ECOKLIN brand at our PK13 factory in Douala.', fr: 'LTIC SARL fabrique des produits ménagers et d\'hygiène industrielle sous la marque ECOKLIN dans notre usine à PK13, Douala.' },
    cta1:  { label: { en: 'View Products',     fr: 'Voir les Produits' }, href: '/products' },
    cta2:  { label: { en: 'About LTIC',        fr: 'À Propos de LTIC' }, href: '/about' },
    image: '/images/hero-slide-2.jpg',
    theme: {
      tag:      'text-amber-400',
      tagBg:    'bg-amber-400',
      headline: 'text-orange-50',
      sub:      'text-orange-100/70',
      overlay:  'linear-gradient(105deg,rgba(12,6,0,0.94) 0%,rgba(12,6,0,0.64) 42%,rgba(12,6,0,0.10) 100%)',
    },
  },
  {
    tag:   { en: 'Commerce & Trade',     fr: 'Commerce & Négoce' },
    lines: { en: 'WE SUPPLY\nYOUR WORLD.',        fr: 'NOUS FOURNISSONS\nVOTRE MONDE.' },
    sub:   { en: 'Lubricants, timber, food products, generators, engines and spare parts — supplying Chad, RCA, Congo-Brazzaville, Gabon and all regions of Cameroon.', fr: 'Lubrifiants, bois, produits alimentaires, groupes électrogènes, moteurs et pièces — fournitures vers le Tchad, RCA, Congo-Brazzaville, Gabon et toutes les régions du Cameroun.' },
    cta1:  { label: { en: 'Our Products',      fr: 'Nos Produits' },      href: '/products' },
    cta2:  { label: { en: 'Contact Us',        fr: 'Nous Contacter' },    href: '/contact' },
    image: '/images/hero-slide-3.jpg',
    video: '/videos/hero-commerce-v2.mp4',
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
  { icon: Truck,          en: 'Land Transport',                 fr: 'Transport Terrestre',              descEn: 'Douala to Chad, RCA, Congo-Brazzaville, Gabon — and full coverage across all 10 regions of Cameroon.',  descFr: 'Douala vers le Tchad, RCA, Congo-Brazzaville, Gabon — et couverture complète des 10 régions du Cameroun.' },
  { icon: Factory,        en: 'Chemical Manufacturing',         fr: 'Production de Produits Chimiques', descEn: 'ECOKLIN — our own brand of cleaning and industrial hygiene products manufactured at our PK13 factory.',   descFr: 'ECOKLIN — notre marque de produits de nettoyage et d\'hygiène industrielle, fabriqués à PK13.' },
  { icon: Droplets,       en: 'Lubricant Distribution',         fr: 'Commercialisation des Lubrifiants', descEn: 'Authorized distributor of Total and Shell lubricants for motors, vessels and industrial equipment.',      descFr: 'Distributeur agréé de lubrifiants Total et Shell pour moteurs, navires et équipements industriels.' },
  { icon: Ship,           en: 'Offshore Marine Services',       fr: 'Services Offshore & Maritimes',    descEn: 'General ship chandling, spare parts, sludging and full maritime supply across African ports.',            descFr: 'Avitaillement des navires, pièces détachées, services de boues et fournitures maritimes dans les ports africains.' },
  { icon: GraduationCap, en: 'Logistics Staff Training',       fr: 'Formation du Personnel Logistique', descEn: 'Professional logistics training for personnel in maritime, customs, transit and supply chain operations.', descFr: 'Formation professionnelle pour le personnel en logistique maritime, douanes, transit et supply chain.' },
  { icon: Handshake,      en: 'Commercial Representation',      fr: 'Représentation Commerciale',        descEn: 'Representing international brands entering the Cameroonian and Central African markets.',                  descFr: 'Représentation de marques internationales sur les marchés camerounais et centrafricains.' },
  { icon: Wrench,         en: 'Vessel Maintenance at Sea',      fr: 'Maintenance des Navires en Haute Mer', descEn: 'On-site maintenance and technical support for vessels operating in African waters.',                  descFr: 'Maintenance et support technique sur site pour navires opérant dans les eaux africaines.' },
];

const features = [
  {
    label:   { en: 'ECOKLIN — Made in Douala',   fr: 'ECOKLIN — Fabriqué à Douala' },
    heading: { en: 'Our Own Brand.\nOur Own Factory.', fr: 'Notre Marque.\nNotre Usine.' },
    body:    { en: 'LTIC SARL manufactures cleaning and hygiene products under the ECOKLIN brand at our PK13 factory in Douala — bleach, degreasers, liquid soaps, muriatic acid and more. Eco-friendly, biodegradable, and distributed across African countries.', fr: 'LTIC SARL fabrique des produits de nettoyage et d\'hygiène sous la marque ECOKLIN dans notre usine à PK13, Douala — javel, dégraissants, savons liquides, acide muriatique et plus. Écologiques, biodégradables et distribués dans les pays africains.' },
    image:   '/images/ecoklin-products.jpg',
    tag:     { en: 'ECOKLIN', fr: 'ECOKLIN' },
    href:    '/products?category=chemical-products',
    contain: true,
  },
  {
    label:   { en: 'Timber & Natural Resources', fr: 'Bois & Ressources Naturelles' },
    heading: { en: 'Certified Timber\nfrom Central Africa.', fr: 'Bois Certifié\nd\'Afrique Centrale.' },
    body:    { en: 'We supply certified tropical timber species — Tali, Iroko, Pachi, Movingui, Azobe, Doussié, Padou, Teak and Bibinga — sourced from Central African forests with full documentation for export.', fr: 'Nous fournissons des essences tropicales certifiées — Tali, Iroko, Pachi, Movingui, Azobé, Doussié, Padou, Teck et Bibinga — issues des forêts d\'Afrique Centrale avec documentation complète pour l\'export.' },
    image:   '/images/timber-resources.jpg',
    tag:     { en: 'Timber', fr: 'Bois' },
    href:    '/products',
  },
  {
    label:   { en: 'Commerce & Supply',          fr: 'Commerce & Fourniture' },
    heading: { en: 'Products Your\nBusiness Needs.', fr: 'Les Produits Dont\nVotre Entreprise a Besoin.' },
    body:    { en: 'Generators, engines and spare parts, food and agricultural products, lubricants, and maritime supplies — LTIC SARL sources and supplies across Central Africa and neighboring countries.', fr: 'Groupes électrogènes, moteurs et pièces détachées, produits alimentaires et agricoles, lubrifiants et fournitures maritimes — LTIC SARL approvisionne l\'Afrique Centrale et les pays voisins.' },
    image:   '/images/general-commerce.jpg',
    tag:     { en: 'Commerce', fr: 'Commerce' },
    href:    '/products',
  },
];

const productCategories = [
  { en: 'Chemical Products',        fr: 'Produits Chimiques',           descEn: 'ECOKLIN brand — bleach, soaps, degreasers, muriatic acid', descFr: 'Marque ECOKLIN — javel, savons, dégraissants, acide muriatique', image: '/images/cat-industrial-chemicals.jpg', tag: { en: 'ECOKLIN', fr: 'ECOKLIN' }, slug: 'chemical-products' },
  { en: 'Timber & Logs',            fr: 'Bois & Grumes',                descEn: 'Tali, Iroko, Pachi, Azobe and certified tropical species',  descFr: 'Tali, Iroko, Pachi, Azobé et essences tropicales certifiées',  image: '/images/timber-logs.jpg',             tag: { en: 'Timber', fr: 'Bois' },          slug: 'timber-logs' },
  { en: 'Offshore & Maritime',      fr: 'Offshore & Maritime',          descEn: 'Maritime supplies, ship chandling and vessel maintenance',  descFr: 'Fournitures maritimes, avitaillement et maintenance navires',   image: '/images/cat-marine-chemicals.jpg',    tag: { en: 'Marine', fr: 'Marine' },        slug: 'offshore-maritime' },
  { en: 'Lubricants Oil',           fr: 'Lubrifiants',                  descEn: 'Total, Shell motor and vessel lubricants only',             descFr: 'Lubrifiants moteur et marine Total, Shell uniquement',          image: '/images/lubricants-oils.jpg',         tag: { en: 'Supply', fr: 'Fourniture' },    slug: 'lubricants' },
  { en: 'Food & Agricultural',      fr: 'Alimentaire & Agricole',       descEn: 'Cacao, coffee, peanut oil, beans, corn and sesame',        descFr: 'Cacao, café, huile d\'arachide, haricots, maïs et sésame',    image: '/images/cat-agrifood.jpg',            tag: { en: 'Agri-Food', fr: 'Agro-Ali.' }, slug: 'food-agricultural-products' },
  { en: 'Filters',                  fr: 'Filtres',                      descEn: 'Oil, air and fuel filters for all equipment types',        descFr: 'Filtres huile, air et carburant pour tous équipements',        image: '/images/filters-parts.jpg',           tag: { en: 'Filters', fr: 'Filtres' },      slug: 'filters' },
  { en: 'Generators',               fr: 'Groupes Électrogènes',         descEn: 'Diesel and gas generators for industrial use',             descFr: 'Groupes électrogènes diesel et gaz pour usage industriel',     image: '/images/power-generators.jpg',        tag: { en: 'Commerce', fr: 'Commerce' },    slug: 'generators' },
  { en: 'Engines & Spare Parts',    fr: 'Moteurs & Pièces Détachées',   descEn: 'Marine and industrial engines, spare parts and components', descFr: 'Moteurs maritimes et industriels, pièces de rechange',         image: '/images/heavy-equipment.jpg',         tag: { en: 'Parts', fr: 'Pièces' },         slug: 'spare-parts' },
];

const orderSteps = [
  { icon: Package,  num: '01', title: { en: 'Browse Catalog',   fr: 'Parcourir le Catalogue' }, desc: { en: 'Explore our full industrial catalog and services.',      fr: 'Explorez notre catalogue industriel et nos services.' },         action: { en: 'View Catalog',   fr: 'Voir le Catalogue' }, href: '/products' },
  { icon: FileText, num: '02', title: { en: 'Request a Quote',  fr: 'Demander un Devis' },     desc: { en: 'Submit your requirements in under 2 minutes.',           fr: 'Soumettez vos besoins en moins de 2 minutes.' },                 action: { en: 'Get a Quote',    fr: 'Obtenir un Devis' }, href: '/quote' },
  { icon: Clock,    num: '03', title: { en: 'Receive an Offer', fr: 'Recevoir une Offre' },     desc: { en: 'Custom pricing and freight costs within 24–48 hours.',  fr: 'Offre personnalisée avec frais de transport sous 24–48h.' },     action: null, href: null },
  { icon: Truck,    num: '04', title: { en: 'Tracked Delivery', fr: 'Livraison Suivie' },       desc: { en: 'Customs, freight and logistics tracked in real time.',   fr: 'Douanes, fret et logistique suivis en temps réel.' },           action: { en: 'Track Shipment', fr: 'Suivre' },            href: '/tracking' },
];

// ─── HeroVideo — imperative .play() so mobile browsers don't block autoplay ──

function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover object-center"
      style={{ filter: 'saturate(1.45) contrast(1.05)' }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

// ─── WordReveal ───────────────────────────────────────────────────────────────

function WordReveal({ text, className }: { text: string; className?: string }) {
  const lines = text.split('\n');
  let wi = 0;
  return (
    <span className={className}>
      {lines.map((line, li) => {
        const words = line.split(' ');
        return (
          <span key={li} className="block">
            {words.map((word) => {
              const idx = wi++;
              return (
                <span key={idx} className="inline-block overflow-hidden mr-[0.22em]">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: '115%', opacity: 0 },
                      show: { y: 0, opacity: 1,
                              transition: { type: 'spring', stiffness: 90, damping: 14, delay: idx * 0.065 } },
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

// ─── ServiceCard ──────────────────────────────────────────────────────────────

interface ServiceCardProps {
  icon: React.ElementType;
  en: string; fr: string;
  descEn: string; descFr: string;
  index: number;
  isMobile?: boolean;
}

function ServiceCard({ icon: Icon, en, fr, descEn, descFr, index, isMobile }: ServiceCardProps) {
  const { L } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  // 3D tilt only on desktop — skip spring instances entirely on mobile
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-60, 60], [10, -10]), { stiffness: 160, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [-60, 60], [-10, 10]), { stiffness: 160, damping: 22 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  }
  function onLeave() { mx.set(0); my.set(0); }

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 48, scale: 0.92 },
        show:   { opacity: 1, y: 0, scale: 1,
                  transition: isMobile ? {} : { type: 'spring', stiffness: 160, damping: 26, delay: index * 0.07 } },
      }}
      style={isMobile ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group bg-white border border-border rounded-2xl p-7
                 shadow-sm hover:shadow-2xl hover:border-primary/40
                 transition-shadow transition-colors duration-300 flex flex-col cursor-default"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/[0.03] transition-colors duration-300 pointer-events-none" />

      {/* Icon — floating animation only on desktop (no infinite loops on mobile) */}
      <motion.div
        animate={isMobile ? {} : { y: [0, -3, 0] }}
        transition={isMobile ? {} : { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.65 }}
        className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5
                   group-hover:bg-primary group-hover:scale-110
                   transition-all duration-300 flex-shrink-0"
      >
        <Icon className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-300" />
      </motion.div>

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
        aria-label={L({ en: `Learn more about ${L({ en, fr })}`, fr: `En savoir plus sur ${L({ en, fr })}` })}
        className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold
                   group-hover:gap-3 transition-all duration-200 w-fit py-3"
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
  contain?: boolean;
  isMobile?: boolean;
  skip?: boolean;
}

function FeatureBlock({ label, heading, body, image, tag, href, reverse, contain, isMobile, skip }: FeatureBlockProps) {
  const { L } = useLanguage();
  const blockRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: blockRef, offset: ['start end', 'end start'] });
  // Disable scroll-driven parallax on mobile — JS scroll handlers cause jank
  const imgY = useTransform(scrollYProgress, [0, 1], isMobile ? ['0%', '0%'] : ['10%', '-10%']);

  // On mobile: start in "show" state so children appear immediately without spring animations
  const initState = skip ? 'show' : 'hidden';

  return (
    <motion.div
      ref={blockRef}
      initial={initState}
      {...(skip
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: viewportOnce })}
      variants={skip
        ? { hidden: {}, show: {} }
        : { hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } } }}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-16 lg:py-20
                  border-b border-border last:border-b-0
                  ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
    >
      {/* Image */}
      <motion.div
        variants={skip ? fadeM : (reverse ? fadeInRight : fadeInLeft)}
        className={`relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl ${contain ? 'bg-white' : ''}`}
      >
        <motion.div style={contain ? {} : { y: imgY }} className="absolute inset-0 scale-[1.15]">
          <Image
            src={image}
            alt={L(label)}
            fill
            className={`${contain ? 'object-contain p-4 scale-100' : 'object-cover'} transition-transform duration-700`}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
        <motion.span
          variants={skip ? fadeM : popIn}
          className="absolute top-4 left-4 bg-primary text-primary-foreground
                     text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
          {L(tag)}
        </motion.span>
      </motion.div>

      {/* Copy */}
      <motion.div variants={skip ? fadeM : (reverse ? fadeInLeft : fadeInRight)}>
        <motion.p variants={skip ? fadeM : fadeInUp} className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
          {L(label)}
        </motion.p>
        <motion.h3
          variants={skip ? fadeM : { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="font-extrabold text-section text-foreground whitespace-pre-line leading-none mb-5"
        >
          {skip
            ? <span>{L(heading).split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}</span>
            : <WordReveal text={L(heading)} />}
        </motion.h3>
        <motion.p variants={skip ? fadeM : fadeInUp} className="text-muted-foreground text-base leading-relaxed mb-7 max-w-md">
          {L(body)}
        </motion.p>
        <motion.div variants={skip ? fadeM : fadeInUp}>
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm
                       hover:gap-4 transition-all duration-200 w-fit group py-3"
          >
            {L({ en: 'View products', fr: 'Voir les produits' })}
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                                     transition-transform duration-200" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── ProductCategoryCard ──────────────────────────────────────────────────────

interface ProductCategoryCardProps {
  en: string; fr: string;
  descEn: string; descFr: string;
  image: string;
  tag: { en: string; fr: string };
  slug: string;
  index: number;
}

const catalogEase = [0.16, 1, 0.3, 1] as const;

function ProductCategoryCard({ en, fr, image, slug }: ProductCategoryCardProps) {
  const { L } = useLanguage();
  const prefersReduced = useReducedMotion() ?? false;

  return (
    <Link
      href={`/products?category=${slug}`}
      className="flex flex-col items-center gap-3 group outline-none select-none"
      draggable={false}
    >
      {/* Circle */}
      <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden relative
                      ring-2 ring-border/50 group-hover:ring-primary
                      shadow-md group-hover:shadow-xl group-hover:shadow-primary/15
                      transition-all duration-300 ease-out">
        <Image
          src={image}
          alt={L({ en, fr })}
          fill
          className={`object-cover object-center ${prefersReduced ? '' : 'transition-transform duration-500 ease-out group-hover:scale-110'}`}
          draggable={false}
        />
        {/* subtle gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent
                        group-hover:from-black/40 transition-all duration-300" />
      </div>

      {/* Label below the circle — never clipped */}
      <span className="text-center font-semibold text-xs sm:text-sm text-foreground/80
                       group-hover:text-primary transition-colors duration-200
                       leading-snug max-w-[9rem] px-1">
        {L({ en, fr })}
      </span>
    </Link>
  );
}

// ─── CategoryCarousel ─────────────────────────────────────────────────────────

function CategoryCarousel({ skip }: { skip?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState({ left: false, right: true });

  function sync() {
    const el = trackRef.current;
    if (!el) return;
    setArrows({
      left:  el.scrollLeft > 8,
      right: el.scrollLeft < el.scrollWidth - el.clientWidth - 8,
    });
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', sync); ro.disconnect(); };
  }, []);

  const scroll = (dir: 'left' | 'right') =>
    trackRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });

  return (
    <div className="relative">
      {/* ── Scroll track ───────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="flex flex-row gap-5 sm:gap-7 lg:gap-9 overflow-x-auto scrollbar-hide
                   px-4 sm:px-6 lg:px-8 py-5"
        style={{ scrollSnapType: 'x mandatory', cursor: 'grab' }}
        onMouseDown={e => { (e.currentTarget as HTMLDivElement).style.cursor = 'grabbing'; }}
        onMouseUp={e =>   { (e.currentTarget as HTMLDivElement).style.cursor = 'grab'; }}
        onMouseLeave={e =>{ (e.currentTarget as HTMLDivElement).style.cursor = 'grab'; }}
      >
        {productCategories.map((cat, i) => (
          <motion.div
            key={cat.en}
            className="flex-shrink-0"
            style={{ scrollSnapAlign: 'start' }}
            initial={skip ? false : { opacity: 0, y: 32 }}
            {...(skip
              ? { animate: { opacity: 1, y: 0 } }
              : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: catalogEase, delay: i * 0.06 } })}
          >
            <ProductCategoryCard {...cat} index={i} />
          </motion.div>
        ))}
      </div>

      {/* ── Left fade + arrow ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {arrows.left && (
          <motion.div
            key="arrow-left"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-0 bottom-0 flex items-center pointer-events-none"
          >
            <div className="absolute inset-y-0 left-0 w-24
                            bg-gradient-to-r from-muted/95 via-muted/60 to-transparent" />
            <button
              onClick={() => scroll('left')}
              className="relative z-10 ml-2 w-10 h-10 rounded-full
                         bg-white/90 backdrop-blur-sm shadow-lg
                         border border-border/70 hover:border-primary/50
                         flex items-center justify-center
                         text-foreground/70 hover:text-primary
                         transition-all duration-200 ease-out
                         hover:scale-105 active:scale-95
                         pointer-events-auto"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Right fade + arrow ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {arrows.right && (
          <motion.div
            key="arrow-right"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-0 bottom-0 flex items-center justify-end pointer-events-none"
          >
            <div className="absolute inset-y-0 right-0 w-24
                            bg-gradient-to-l from-muted/95 via-muted/60 to-transparent" />
            <button
              onClick={() => scroll('right')}
              className="relative z-10 mr-2 w-10 h-10 rounded-full
                         bg-white/90 backdrop-blur-sm shadow-lg
                         border border-border/70 hover:border-primary/50
                         flex items-center justify-center
                         text-foreground/70 hover:text-primary
                         transition-all duration-200 ease-out
                         hover:scale-105 active:scale-95
                         pointer-events-auto"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dot indicators ─────────────────────────────────────────────────── */}
      <div className="flex justify-center gap-1.5 mt-1 pb-1">
        {productCategories.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = trackRef.current;
              if (!el) return;
              const items = el.children;
              (items[i] as HTMLElement)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }}
            className="w-1.5 h-1.5 rounded-full bg-border hover:bg-primary transition-colors duration-200"
            aria-label={`Go to category ${i + 1}`}
          />
        ))}
      </div>
    </div>
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
  // skip = disable heavy spring / stagger animations only when user prefers reduced motion
  // 3D tilt, parallax, and floating are already individually guarded by isMobile
  const skip = shouldReduce;

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
    if (paused) return;
    const id = setInterval(() => {
      setActiveSlide(i => (i + 1) % heroSlides.length);
    }, isMobile ? 9000 : HERO_INTERVAL);
    return () => clearInterval(id);
  }, [activeSlide, paused, isMobile]);

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
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<any[]>({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/api/products/featured'),
    staleTime: 5 * 60 * 1000,
  });

  const { data: latestNews, isLoading: newsLoading } = useQuery<any[]>({
    queryKey: ['news', 'preview'],
    queryFn: () => api.get('/api/news'),
    staleTime: 5 * 60 * 1000,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const sideCount = latestNews ? Math.max(0, latestNews.length - 1) : 0;
  const [sideIndex, setSideIndex] = useState(0);
  useEffect(() => {
    if (sideCount <= 0) return;
    const timer = setInterval(() => setSideIndex(prev => (prev + 1) % sideCount), 3000);
    return () => clearInterval(timer);
  }, [sideCount]);


  const staticBrands: Partner[] = [
    { id: 101, name: 'Alpha Marine Group', sectorEn: 'Maritime',  sectorFr: 'Maritime',           logoUrl: '/images/brands/alpha-marine.png' },
    { id: 102, name: 'Maersk',             sectorEn: 'Shipping',  sectorFr: 'Transport Maritime', logoUrl: '/images/brands/maersk.png' },
    { id: 103, name: 'MSC',                sectorEn: 'Shipping',  sectorFr: 'Transport Maritime', logoUrl: '/images/brands/msc.png' },
    { id: 104, name: 'Bolloré',            sectorEn: 'Logistics', sectorFr: 'Logistique',         logoUrl: '/images/brands/bollore.svg' },
    { id: 105, name: 'Solena',             sectorEn: 'Industry',  sectorFr: 'Industrie',          logoUrl: '/images/brands/solena.jpg' },
    { id: 106, name: 'Total Energies',     sectorEn: 'Energy',    sectorFr: 'Énergie',            logoUrl: '/images/brands/total.png' },
    { id: 107, name: 'Shell',              sectorEn: 'Energy',    sectorFr: 'Énergie',            logoUrl: '/images/brands/shell.png' },
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
      {/* Preload all hero slide images so they're ready before the carousel reaches them */}
      <div aria-hidden className="sr-only pointer-events-none">
        {heroSlides.filter(s => !s.video).map(s => (
          <Image key={s.image} src={s.image} alt="" fill priority sizes="1px" />
        ))}
      </div>

      {/* ══ 1. HERO — Carousel ═══════════════════════════════════════════════════ */}
      <section
        className="relative -mt-[72px] lg:-mt-[80px] h-[calc(52dvh+72px)] sm:h-[calc(72dvh+72px)] lg:h-[calc(82dvh+80px)] min-h-[492px] sm:min-h-[572px] lg:min-h-[640px] overflow-hidden bg-black"
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
              <HeroVideo key={heroSlides[activeSlide].video} src={heroSlides[activeSlide].video!} />
            ) : (
              <Image
                src={heroSlides[activeSlide].image}
                alt=""
                fill
                className="object-cover object-center"
                priority
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
        <div className="relative z-10 h-full flex items-center pt-[100px] sm:pt-[110px] lg:pt-[128px] pb-12 sm:pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto w-full pl-4 pr-2 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }}
                className="max-w-[640px] xl:max-w-[780px]"
              >
                {/* Tag label */}
                <motion.div
                  initial={{ opacity: 0, x: isMobile ? 0 : -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
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
                  initial={{ opacity: 0, y: isMobile ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: isMobile ? 0.2 : 0.5 }}
                  className={`text-[0.82rem] sm:text-[1.05rem] leading-[1.6] sm:leading-[1.7] mb-5 sm:mb-10 max-w-[36ch] sm:max-w-[42ch] line-clamp-2 sm:line-clamp-none ${heroSlides[activeSlide].theme.sub}`}
                >
                  {L(heroSlides[activeSlide].sub)}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: isMobile ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: isMobile ? 0.3 : 0.66 }}
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
      <section className="bg-background py-3 sm:py-20 relative overflow-hidden">
        {/* Floating orbs — desktop only; infinite loops are too heavy on mobile GPUs */}
        <motion.div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/6 blur-3xl pointer-events-none"
          animate={skip ? {} : { scale: [1, 1.07, 1], opacity: [0.5, 0.72, 0.5] }}
          transition={skip ? {} : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"
          animate={skip ? {} : { scale: [1.04, 1, 1.04], opacity: [0.4, 0.62, 0.4] }}
          transition={skip ? {} : { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={skip ? 'show' : 'hidden'}
            {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
            variants={skip
              ? { hidden: {}, show: {} }
              : { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <motion.div
              variants={skip ? fadeM : { hidden: { opacity: 0, x: -22 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 160, damping: 26 } } }}>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
                {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
              </p>
              <h2 className="font-extrabold text-section text-foreground
                             [text-wrap:balance] max-w-xl whitespace-pre-line">
                {skip
                  ? L({ en: 'Seven Services,\nOne Reliable Partner.', fr: 'Sept Services,\nUn Partenaire Fiable.' }).split('\n').map((l, i) => <span key={i} className="block">{l}</span>)
                  : <WordReveal text={L({ en: 'Seven Services,\nOne Reliable Partner.', fr: 'Sept Services,\nUn Partenaire Fiable.' })} />}
              </h2>
            </motion.div>
            <motion.div
              variants={skip ? fadeM : { hidden: { opacity: 0, x: 22 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 160, damping: 26 } } }}
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
            initial={skip ? 'show' : 'hidden'}
            {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
            variants={skip ? staggerM : { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
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
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══ 3. FEATURED THIS WEEK ════════════════════════════════════════════ */}
      {(featuredLoading || (featuredProducts && featuredProducts.length > 0)) && (
        <section className="bg-muted/40 py-12 sm:py-16 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <motion.div
              initial={skip ? false : { opacity: 0, y: 60 }}
              {...(skip
                ? { animate: { opacity: 1, y: 0 } }
                : { whileInView: { opacity: 1, y: 0 }, viewport: viewportOnce, transition: { type: 'spring', stiffness: 85, damping: 15 } })}
              className="flex items-end justify-between gap-4 mb-10"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-px bg-primary flex-shrink-0" />
                  <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                    {L({ en: 'Featured This Week', fr: 'En Vedette Cette Semaine' })}
                  </span>
                </div>
                <h2 className="font-extrabold text-2xl sm:text-3xl text-foreground leading-tight">
                  {L({ en: 'Products We Recommend', fr: 'Produits que Nous Recommandons' })}
                </h2>
              </div>
              <Link href="/products"
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline shrink-0">
                {L({ en: 'View All', fr: 'Voir Tout' })}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Grid — uniform height cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {featuredLoading
                ? Array(7).fill(0).map((_, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8ecf0', overflow: 'hidden' }}>
                      <Skeleton style={{ height: '130px', display: 'block', width: '100%', background: '#f1f5f9' }} />
                      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Skeleton style={{ height: '8px', width: '50%', background: '#f1f5f9', borderRadius: '4px' }} />
                        <Skeleton style={{ height: '11px', width: '90%', background: '#f1f5f9', borderRadius: '4px' }} />
                      </div>
                    </div>
                  ))
                : featuredProducts!.slice(0, 7).map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={skip ? false : { opacity: 0, y: 20 }}
                      {...(skip
                        ? { animate: { opacity: 1, y: 0 } }
                        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.42, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] } })}
                      whileHover={skip ? {} : { y: -3, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
                      style={{ height: '100%' }}
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        className="group"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          background: '#ffffff',
                          borderRadius: '10px',
                          border: '1px solid #e8ecf0',
                          overflow: 'hidden',
                          textDecoration: 'none',
                          transition: 'border-color 0.18s, box-shadow 0.18s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'hsl(var(--primary) / 0.45)';
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#e8ecf0';
                          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                        }}
                      >
                        {/* Image */}
                        <div style={{ height: '130px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #f1f5f9' }}>
                          {product.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.imageUrl}
                              alt={product.nameEn || product.nameFr || ''}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: '4px' }}
                            />
                          ) : (
                            <Package className="h-8 w-8 text-slate-300" />
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ padding: '10px 12px', flex: 1 }}>
                          {product.categoryName && (
                            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(var(--primary))', marginBottom: '4px' }}>
                              {product.categoryName}
                            </p>
                          )}
                          <p style={{ fontSize: '11px', fontWeight: 600, color: '#1e293b', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {L({ en: product.nameEn, fr: product.nameFr })}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 4. PRODUCT CATALOG — Browse by Category ══════════════════════════ */}
      <section className="bg-muted/40 py-3 sm:py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={skip ? 'show' : 'hidden'}
              {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
              variants={skip
                ? { hidden: {}, show: {} }
                : { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            >
              <motion.p
                variants={skip
                  ? fadeM
                  : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: catalogEase } } }}
                className="text-primary font-bold text-[11px] uppercase tracking-[0.28em] mb-1"
              >
                {L({ en: 'Our Catalog', fr: 'Notre Catalogue' })}
              </motion.p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground leading-tight overflow-hidden">
                {skip
                  ? L({ en: 'Browse by Category', fr: 'Parcourir par Catégorie' })
                  : L({ en: 'Browse by Category', fr: 'Parcourir par Catégorie' }).split(' ').map((word, wi) => (
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
              initial={skip ? false : { opacity: 0, x: 16 }}
              {...(skip
                ? { animate: { opacity: 1, x: 0 } }
                : { whileInView: { opacity: 1, x: 0 }, viewport: viewportOnce, transition: { duration: 0.38, ease: catalogEase, delay: 0.2 } })}
            >
              <Button asChild variant="outline"
                className="border-border font-semibold text-sm hover:border-primary/50 hover:text-primary rounded-full h-11 px-4">
                <Link href="/products">
                  {L({ en: 'View All', fr: 'Tout Voir' })}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <CategoryCarousel skip={skip} />
        </div>
      </section>

      {/* ══ 5. FEATURES — editorial image+copy blocks ══════════════════════════ */}
      <section className="bg-white py-3 sm:py-20 relative overflow-hidden">
        <motion.div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-primary/4 blur-3xl pointer-events-none"
          animate={skip ? {} : { scale: [1, 1.2, 1], x: [0, 20, 0] }}
          transition={skip ? {} : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] rounded-full bg-amber-400/5 blur-3xl pointer-events-none"
          animate={skip ? {} : { scale: [1.1, 1, 1.1], y: [0, -20, 0] }}
          transition={skip ? {} : { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={skip ? fadeM : fadeInUp} initial={skip ? 'show' : 'hidden'}
            {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
            className="mb-4">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.28em] mb-4">
              {L({ en: 'Products & Commerce', fr: 'Produits & Commerce' })}
            </p>
            <h2 className="font-extrabold text-section text-foreground
                           [text-wrap:balance] max-w-2xl whitespace-pre-line">
              {skip
                ? L({ en: 'A Wide Range of Products,\nAcross Central Africa.', fr: 'Une Large Gamme de Produits,\nDans Toute l\'Afrique Centrale.' }).split('\n').map((l, i) => <span key={i} className="block">{l}</span>)
                : <WordReveal text={L({ en: 'A Wide Range of Products,\nAcross Central Africa.', fr: 'Une Large Gamme de Produits,\nDans Toute l\'Afrique Centrale.' })} />}
            </h2>
          </motion.div>

          {features.map((feat, i) => (
            <FeatureBlock key={feat.label.en} {...feat} reverse={i % 2 === 1} isMobile={isMobile} skip={skip} />
          ))}
        </div>
      </section>

      {/* ══ PRODUCT SPOTLIGHT — admin-editable ═══════════════════════════════ */}
      {(spotlightData?.isActive !== false) && (
      <motion.section
        ref={spotlightRef}
        style={shouldReduce || isMobile ? {} : {
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
              variants={skip ? undefined : fadeInLeft}
              initial={skip ? false : 'hidden'}
              {...(skip ? { animate: { opacity: 1, x: 0 } } : { whileInView: 'show', viewport: viewportOnce })}
              className="flex-1">

              {/* Glass card */}
              <div className="relative overflow-hidden text-center lg:text-left
                              bg-white/[0.07] sm:backdrop-blur-md
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
                {spotlightData?.label || L({ en: 'ECOKLIN — Chemical Products', fr: 'ECOKLIN — Produits Chimiques' })}
              </p>

              {/* Headline */}
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl
                             text-sidebar-foreground leading-[0.95] tracking-tight mb-5">
                {(spotlightData
                  ? (language === 'fr' ? spotlightData.headlineFr : spotlightData.headlineEn)
                  : L({ en: 'ECOKLIN —\nMade in Douala.', fr: 'ECOKLIN —\nFabriqué à Douala.' })
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
                      en: 'ECOKLIN is LTIC SARL\'s own brand of cleaning, hygiene and sanitation products manufactured at our factory in PK13, Douala — bleach, degreasers, liquid soaps, muriatic acid and more.',
                      fr: 'ECOKLIN est la marque propre de LTIC SARL, fabricant des produits de nettoyage, hygiène et assainissement dans notre usine à PK13, Douala — javel, dégraissants, savons liquides, acide muriatique et plus.',
                    })
                }
              </p>
              <p className="text-sidebar-foreground/80 text-sm leading-relaxed mb-8 max-w-sm mx-auto lg:mx-0">
                {spotlightData
                  ? (language === 'fr' ? spotlightData.subBodyFr : spotlightData.subBodyEn)
                  : L({
                      en: 'Available across Central Africa and neighboring countries. Wholesale and retail supply for businesses and distributors.',
                      fr: 'Disponible en Afrique Centrale et dans les pays voisins. Fourniture en gros et en détail pour entreprises et distributeurs.',
                    })
                }
              </p>

              {/* Tag chips */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                {([
                  { en: 'Made in Douala',      fr: 'Fabriqué à Douala' },
                  { en: 'ECOKLIN Brand',       fr: 'Marque ECOKLIN' },
                  { en: 'Wholesale Available', fr: 'Vente en Gros' },
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
              variants={skip ? undefined : fadeInRight}
              initial={skip ? false : 'hidden'}
              {...(skip ? { animate: { opacity: 1, x: 0 } } : { whileInView: 'show', viewport: viewportOnce })}
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
            {[...partners, ...partners, ...partners, ...partners].map((b, i) => <PartnerCard key={i} b={b} />)}
          </div>
          <div className="flex w-max marquee-right">
            {[...partners, ...partners, ...partners, ...partners].map((b, i) => <PartnerCard key={i} b={b} />)}
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
            variants={skip ? fadeM : fadeInUp} initial={skip ? 'show' : 'hidden'}
            {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
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
            <Button asChild variant="outline"
              className="self-start sm:self-auto border-border font-semibold text-xs
                         hover:border-primary/50 hover:text-primary flex-shrink-0 h-11 px-4">
              <Link href="/quote">
                {L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}
                <ArrowRight className="h-3 w-3 ml-1.5" />
              </Link>
            </Button>
          </motion.div>

          {/* Steps — 2×2 on mobile, single row on desktop */}
          <motion.div
            variants={skip ? staggerM : stagger}
            initial={skip ? 'show' : 'hidden'}
            {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
          >
            {orderSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  variants={skip ? fadeM : fadeInUp}
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

      {/* ══ 8. LATEST NEWS ══════════════════════════════════════════════════════ */}
      {(newsLoading || (latestNews && latestNews.length > 0)) && (
        <section className="bg-background py-12 sm:py-16 border-b border-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Section header */}
            <motion.div
              variants={skip ? fadeM : fadeInUp} initial={skip ? 'show' : 'hidden'}
              {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
              className="flex items-end justify-between mb-6 sm:mb-8"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-5 h-px bg-primary flex-shrink-0" />
                  <span className="text-primary font-bold text-[10px] uppercase tracking-[0.32em]">
                    {L({ en: 'News & Insights', fr: 'Actualités & Analyses' })}
                  </span>
                </div>
                <h2 className="font-extrabold text-2xl sm:text-3xl text-foreground leading-tight">
                  {L({ en: 'Latest Updates', fr: 'Dernières Actualités' })}
                </h2>
              </div>
              <Link
                href="/news"
                className="flex items-center gap-1.5 text-sm font-semibold text-primary
                           hover:gap-3 transition-all duration-200 shrink-0"
              >
                {L({ en: 'All News', fr: 'Toutes les Actualités' })}
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Link>
            </motion.div>

            {/* Unified container */}
            <motion.div
              variants={skip ? fadeM : fadeInUp} initial={skip ? 'show' : 'hidden'}
              {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}
              className=""
            >
              {newsLoading ? (
                /* Skeleton — mirrors the real layout */
                <div className="grid grid-cols-1 lg:grid-cols-5 h-auto lg:h-[520px] gap-2 sm:gap-3">
                  <div className="lg:col-span-3 h-56 lg:h-full bg-white/[0.04] rounded-xl lg:rounded-2xl" />
                  <div className="lg:col-span-2 flex flex-col gap-2 sm:gap-3">
                    <div className="flex-1 h-36 lg:h-auto bg-white/[0.06] rounded-xl lg:rounded-2xl" />
                    <div className="flex-1 h-36 lg:h-auto bg-white/[0.04] rounded-xl lg:rounded-2xl" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 h-auto lg:h-[520px] gap-2 sm:gap-3">

                  {/* ── Large featured card (left, 60%) ───────────────── */}
                  {latestNews![0] && (
                    <Link
                      href={`/news/${latestNews![0].id}`}
                      aria-label={L({ en: latestNews![0].titleEn, fr: latestNews![0].titleFr })}
                      className="lg:col-span-3 relative group overflow-hidden block
                                 h-72 sm:h-80 lg:h-full
                                 rounded-xl lg:rounded-2xl
                                 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset outline-none"
                    >
                      {/* Background image */}
                      <Image
                        src={latestNews![0].imageUrl || '/images/banner-news.jpg'}
                        alt={L({ en: latestNews![0].titleEn, fr: latestNews![0].titleFr })}
                        fill
                        className="object-cover transition-transform duration-700 ease-out
                                   group-hover:scale-[1.04]"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                      {/* Cinematic gradient — stronger at bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t
                                      from-black/90 via-black/35 to-black/5
                                      pointer-events-none" />
                      {/* Subtle left-side ambient glow on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-transparent
                                      opacity-0 group-hover:opacity-20 transition-opacity duration-500
                                      pointer-events-none" />

                      {/* Top-left: Featured badge */}
                      <div className="absolute top-5 left-5 flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground text-[9px] font-black
                                         uppercase tracking-[0.25em] px-3 py-1.5 rounded-full
                                         shadow-lg shadow-primary/30">
                          {L({ en: 'Featured', fr: 'À la Une' })}
                        </span>
                        {latestNews![0].category && (
                          <span className="bg-white/15 backdrop-blur-sm text-white/90 text-[9px]
                                           font-semibold uppercase tracking-[0.18em] px-2.5 py-1.5
                                           rounded-full border border-white/20">
                            {latestNews![0].category}
                          </span>
                        )}
                      </div>

                      {/* Bottom content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        {/* Accent rule */}
                        <div className="w-8 h-0.5 bg-primary rounded-full mb-4
                                        scale-x-50 origin-left group-hover:scale-x-100
                                        transition-transform duration-500" />
                        <h3 className="font-extrabold text-white text-xl sm:text-2xl lg:text-[1.65rem]
                                       leading-[1.2] mb-3 [text-wrap:balance] max-w-[42ch]">
                          {L({ en: latestNews![0].titleEn, fr: latestNews![0].titleFr })}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-white/50 text-xs">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <time dateTime={latestNews![0].publishedAt}>
                              {format(new Date(latestNews![0].publishedAt), 'dd MMM yyyy')}
                            </time>
                          </div>
                          <span className="flex items-center gap-1.5 text-primary text-xs font-bold
                                           uppercase tracking-[0.15em]
                                           group-hover:gap-2.5 transition-all duration-300">
                            {L({ en: 'Read more', fr: 'Lire plus' })}
                            <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* ── Two small stacked cards (right, 40%) — auto-rotating ─ */}
                  <div className="lg:col-span-2 flex flex-col gap-2 sm:gap-3">
                    {(() => {
                      const sideArticles = latestNews!.slice(1);
                      if (sideArticles.length === 0) {
                        return (
                          <>
                            <div className="flex-1 h-48 sm:h-52 lg:h-auto rounded-xl lg:rounded-2xl bg-white/[0.04]
                                            flex flex-col items-center justify-center gap-4 p-6 text-center">
                              <Newspaper className="h-8 w-8 text-white/20" />
                              <Link href="/news" className="text-primary text-sm font-semibold hover:underline">
                                {L({ en: 'View all articles', fr: 'Voir tous les articles' })}
                              </Link>
                            </div>
                            <div className="flex-1 h-48 sm:h-52 lg:h-auto rounded-xl lg:rounded-2xl bg-white/[0.04]" />
                          </>
                        );
                      }
                      return [0, 1].map((slot) => {
                        const article = sideArticles[(sideIndex + slot) % sideArticles.length];
                        return (
                          <div key={slot} className="relative flex-1 h-48 sm:h-52 lg:h-auto overflow-hidden rounded-xl lg:rounded-2xl">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`${slot}-${article.id}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.45, ease: 'easeInOut' }}
                                className="absolute inset-0"
                              >
                                <Link
                                  href={`/news/${article.id}`}
                                  className="relative group block h-full w-full
                                             focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset outline-none"
                                >
                                  <Image
                                    src={article.imageUrl || '/images/banner-news.jpg'}
                                    alt={L({ en: article.titleEn, fr: article.titleFr })}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                                    sizes="(max-width: 1024px) 100vw, 40vw"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 pointer-events-none" />
                                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-500 pointer-events-none" />
                                  {article.category && (
                                    <div className="absolute top-4 right-4">
                                      <span className="bg-primary/90 text-primary-foreground text-[9px] font-bold
                                                       uppercase tracking-[0.18em] px-2.5 py-1 rounded-full shadow-md shadow-primary/20">
                                        {article.category}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                                    <h3 className="font-bold text-white text-sm sm:text-[0.92rem] leading-snug mb-2 line-clamp-2">
                                      {L({ en: article.titleEn, fr: article.titleFr })}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5 text-white/45 text-[10px]">
                                        <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
                                        <time dateTime={article.publishedAt}>
                                          {format(new Date(article.publishedAt), 'dd MMM yyyy')}
                                        </time>
                                      </div>
                                      <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100
                                                              translate-x-1 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0" />
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        );
                      });
                    })()}
                  </div>

                </div>
              )}
            </motion.div>

          </div>
        </section>
      )}

      {/* ══ 9. CTA — world map ══════════════════════════════════════════════════ */}
      <section className="relative bg-sidebar py-12 sm:py-20 overflow-hidden">

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
          <motion.div variants={skip ? staggerM : stagger} initial={skip ? 'show' : 'hidden'}
            {...(skip ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce })}>
            <motion.p variants={fadeInUp}
              className="text-white font-bold text-xs uppercase tracking-[0.3em] mb-2 sm:mb-6
                         drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
              {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
            </motion.p>

            <motion.h2 variants={fadeInUp}
              className="font-extrabold text-white
                         text-hero mb-3 sm:mb-6 [text-wrap:balance] whitespace-pre-line
                         drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)]">
              {L({ en: "Let's Move Your\nBusiness Forward.", fr: 'Faisons Avancer\nVotre Business.' })}
            </motion.h2>

            <motion.p variants={fadeInUp}
              className="text-white/85 text-sm sm:text-base max-w-sm sm:max-w-lg mx-auto mb-5 sm:mb-10 leading-relaxed">
              {L({
                en: 'Maritime supply, chemicals, timber, food products and commercial trade — one partner across Central Africa.',
                fr: 'Fourniture maritime, chimie, bois, produits alimentaires et commerce — un seul partenaire en Afrique Centrale.',
              })}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button asChild
                className="font-semibold h-11 sm:h-14 px-6 sm:px-10 text-sm sm:text-base shadow-lg shadow-primary/30 w-full sm:w-auto">
                <Link href="/contact">
                  {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline"
                className="font-semibold h-11 sm:h-14 px-6 sm:px-10 text-sm sm:text-base bg-white/10
                           border-white/30 text-white hover:bg-white/20 hover:border-white/60
                           backdrop-blur-sm w-full sm:w-auto">
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
