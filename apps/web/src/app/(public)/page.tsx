'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, Globe2, Ship, Factory, BarChart3, Handshake, TreePine,
  Shield, Zap, TrendingUp, CheckCircle2, Package, FileText, Clock, Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, fadeInLeft, fadeInRight, fadeIn, scaleIn, stagger, staggerFast, viewportOnce } from '@/components/motion/variants';

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

const statDefs = [
  { key: 'stat_countries', fallback: '30+',  en: 'Countries Served',   fr: 'Pays Desservis' },
  { key: 'stat_clients',   fallback: '500+', en: 'Clients Worldwide',   fr: 'Clients Mondiaux' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years Experience',    fr: "Années d'Expérience" },
  { key: 'stat_shipments', fallback: '10K+', en: 'Shipments Completed', fr: 'Expéditions Réalisées' },
];

const services = [
  { icon: Ship,      en: 'Logistics & Transit',          fr: 'Logistique & Transit',               image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=70',    descEn: 'End-to-end freight forwarding, customs clearance, and international transit across air, sea and road.',        descFr: 'Freight forwarding complet, dédouanement et transit international aérien, maritime et routier.' },
  { icon: Globe2,    en: 'Import & Export',               fr: 'Import & Export',                    image: '',    descEn: 'Seamless global trade facilitation with compliance, documentation and strategic sourcing expertise.',        descFr: 'Facilitation du commerce mondial avec conformité, documentation et expertise en sourcing stratégique.' },
  { icon: Factory,   en: 'Industrial Supply',             fr: 'Fourniture Industrielle',            image: '',    descEn: 'Generators, lubricants, filters, and heavy industrial materials delivered to specification.',               descFr: 'Générateurs, lubrifiants, filtres et matériaux industriels lourds livrés selon spécifications.' },
  { icon: TreePine,  en: 'Timber & Trade',                fr: 'Bois & Commerce',                   image: '',    descEn: 'Premium certified tropical timber and logs for international construction and woodworking markets.',         descFr: "Bois tropicaux certifiés premium pour la construction internationale et les marchés du bois." },
  { icon: BarChart3, en: 'Supply Chain Consulting',       fr: "Conseil Chaîne d'Approvisionnement", image: '', descEn: 'Strategic procurement and logistics optimization for enterprises operating in complex markets.',              descFr: "Optimisation stratégique des achats et de la logistique pour entreprises sur marchés complexes." },
  { icon: Handshake, en: 'Commercial Representation',     fr: 'Représentation Commerciale',         image: '',    descEn: 'Brand and market representation, joint ventures, and strategic business partnerships.',                      descFr: "Représentation de marque, coentreprises et partenariats commerciaux stratégiques." },
];

const industries = [
  { en: 'Oil & Gas',           fr: 'Pétrole & Gaz' },
  { en: 'Mining & Extraction', fr: 'Mines & Extraction' },
  { en: 'Construction',        fr: 'Construction' },
  { en: 'Agriculture',         fr: 'Agriculture' },
  { en: 'Manufacturing',       fr: 'Industrie Manufacturière' },
  { en: 'Forestry',            fr: 'Foresterie' },
  { en: 'Energy',              fr: 'Énergie' },
  { en: 'Public Works',        fr: 'Travaux Publics' },
];

const orderSteps = [
  {
    icon: Package,
    title:  { en: 'Browse Our Catalog',   fr: 'Parcourez Notre Catalogue' },
    desc:   { en: 'Explore industrial products — timber, generators, lubricants, and more.', fr: 'Explorez nos produits industriels — bois, générateurs, lubrifiants et plus encore.' },
    action: { en: 'View Catalog',         fr: 'Voir le Catalogue' },
    href: '/products',
  },
  {
    icon: FileText,
    title:  { en: 'Request a Quote',      fr: 'Demandez un Devis' },
    desc:   { en: 'Fill our quote form with product, quantity, destination. Takes under 2 minutes.', fr: 'Remplissez notre formulaire avec produit, quantité, destination. Moins de 2 minutes.' },
    action: { en: 'Get a Quote',          fr: 'Obtenir un Devis' },
    href: '/quote',
  },
  {
    icon: Clock,
    title:  { en: 'Receive Your Offer',   fr: 'Recevez Votre Offre' },
    desc:   { en: 'Custom price with freight costs, customs fees, and delivery timeline within 24–48 hours.', fr: 'Offre personnalisée avec frais de transport et délais sous 24–48h.' },
    action: null,
    href: null,
  },
  {
    icon: Truck,
    title:  { en: 'Track Your Shipment',  fr: 'Suivez Votre Livraison' },
    desc:   { en: 'We handle customs, freight, logistics. Track your order in real time.', fr: 'Nous gérons tout — douanes, fret, logistique. Suivez votre commande en temps réel.' },
    action: { en: 'Track a Shipment',     fr: 'Suivre une Livraison' },
    href: '/tracking',
  },
];

const whyPoints = [
  { en: 'Multinational trade network across Africa, Europe, Middle East & Americas', fr: "Réseau commercial multinational en Afrique, Europe, Moyen-Orient & Amériques" },
  { en: 'Full-spectrum logistics: freight, customs, warehousing, last-mile delivery', fr: "Logistique complète: fret, douane, entreposage, livraison dernier kilomètre" },
  { en: 'Certified industrial supply partners — Total, Shell and leading OEM brands', fr: "Partenaires certifiés — Total, Shell et grandes marques OEM" },
  { en: 'Dedicated account management and 24/7 shipment tracking', fr: "Gestion de compte dédiée et suivi d'expédition 24h/7j" },
  { en: 'Transparent pricing, structured documentation, on-time delivery', fr: "Tarification transparente, documentation structurée, livraison à temps" },
];

const whyCards = [
  { icon: Shield,     en: 'Reliability',    fr: 'Fiabilité',      descEn: 'On-time delivery backed by structured documentation.',         descFr: 'Livraison à temps avec documentation structurée.' },
  { icon: Globe2,     en: 'Global Network', fr: 'Réseau Mondial', descEn: 'Established connections across 30+ countries.',               descFr: 'Connexions établies dans 30+ pays et corridors clés.' },
  { icon: Zap,        en: 'Efficiency',     fr: 'Efficacité',     descEn: 'Optimized supply chains reducing cost and transit time.',     descFr: "Chaînes optimisées réduisant coûts et délais." },
  { icon: TrendingUp, en: 'Growth',         fr: 'Croissance',     descEn: 'Strategic partnerships that open new markets.',               descFr: "Partenariats ouvrant de nouveaux marchés." },
];

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
      {/* ── HERO — Two-panel: editorial headline + live stats panel ── */}
      <section className="relative min-h-[90vh] bg-sidebar flex items-center overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=70"
            alt="Cargo logistics operations"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar/97 via-sidebar/85 to-sidebar/55" />
        </div>

        {/* Dot grid texture */}
        <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />

        {/* Left blue accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:pl-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center">

            {/* Left: Editorial headline */}
            <motion.div variants={stagger} initial="hidden" animate="show" className="min-w-0">
              <motion.p variants={fadeInUp}
                className="flex items-center gap-2.5 font-display font-semibold text-xs uppercase tracking-[0.2em] mb-5 text-blue-400">
                <span className="w-6 h-px bg-blue-400 flex-shrink-0" />
                {L({ en: 'Multinational Business Solutions', fr: "Solutions d'Affaires Multinationales" })}
              </motion.p>

              {/* H1 — font scales DOWN at lg (two-column) to prevent FR overflow, back up at xl */}
              <motion.h1 variants={fadeInUp}
                className="font-display font-bold text-sidebar-foreground tracking-tight mb-6 leading-[1.08]
                           text-[2.5rem] sm:text-5xl
                           lg:text-[2.25rem] xl:text-[2.9rem] 2xl:text-5xl
                           [text-wrap:balance]">
                {/* Line 1 — main phrase */}
                <span className="block">
                  {L({ en: 'Global Logistics &', fr: 'Logistique Mondiale &' })}
                </span>
                {/* Line 2 — continuation */}
                <span className="block">
                  {L({ en: 'Industrial Trade', fr: 'Commerce Industriel' })}
                </span>
                {/* Line 3 — accent */}
                <span className="block text-primary mt-2">
                  {L({ en: 'Built for Africa.', fr: "Conçu pour l'Afrique." })}
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp}
                className="text-sidebar-foreground/65 text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed mb-8 max-w-lg">
                {L({
                  en: 'Reliable logistics, transit, industrial supply, and international trade services — connecting 30+ countries with precision and accountability.',
                  fr: 'Services fiables de logistique, transit, fourniture industrielle et commerce international — connectant 30+ pays avec précision.',
                })}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="font-display font-semibold text-sm px-7 rounded-sm shadow-none">
                  <Link href="/quote">
                    {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline"
                  className="font-display font-semibold text-sm px-7 rounded-sm bg-transparent border-sidebar-foreground/30 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground hover:border-sidebar-foreground/50">
                  <Link href="/services">{L({ en: 'Our Services', fr: 'Nos Services' })}</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right: Stats command panel */}
            <motion.div variants={fadeInRight} initial="hidden" animate="show" className="hidden lg:block">
              <div className="border border-primary/25 overflow-hidden">
                {/* Header bar */}
                <div className="px-4 py-2.5 border-b border-primary/20 bg-primary/10 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                  <span className="text-primary text-xs font-display font-semibold uppercase tracking-widest">
                    {L({ en: 'Live Operations', fr: 'Opérations en Direct' })}
                  </span>
                </div>
                {/* Stats 2×2 */}
                <div className="grid grid-cols-2 gap-px bg-primary/12">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-sidebar/90 p-6 hover:bg-primary/5 transition-colors duration-200">
                      <span className="stat-num font-display font-bold text-3xl xl:text-4xl text-primary block mb-2">
                        {stat.value}
                      </span>
                      <span className="text-sidebar-foreground/50 text-xs uppercase tracking-wider font-medium">
                        {L(stat)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND — Full-bleed navy ── */}
      <section className="bg-foreground py-14 border-b border-sidebar-border/30">
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
                <span className="stat-num font-display font-bold text-4xl sm:text-5xl text-primary mb-2">
                  {stat.value}
                </span>
                <span className="text-sidebar-foreground/55 text-xs uppercase tracking-widest font-medium">
                  {L(stat)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PARTNERS MARQUEE ── */}
      <section className="relative bg-background py-16 overflow-hidden border-b border-border">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="text-center mb-10 px-4"
        >
          <span className="amber-rule mx-auto mb-4" />
          <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-2">
            {L({ en: 'Trusted Partners & Brands', fr: 'Partenaires & Marques de Confiance' })}
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
            {L({ en: 'Brands We Work With', fr: 'Marques Avec Lesquelles Nous Travaillons' })}
          </h2>
        </motion.div>

        <div className="marquee-wrap space-y-3 select-none">
          <div className="flex w-max marquee-left">
            {[...brandsRow1, ...brandsRow1].map((b, i) => (
              <div key={i}
                className="flex items-center gap-3 mx-3 px-5 py-3 bg-card border border-border rounded-sm hover:border-primary/40 transition-all duration-300 cursor-default flex-shrink-0">
                <div className="w-9 h-9 rounded-sm bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {b.logoUrl
                    ? <img src={b.logoUrl} alt={b.name} className="w-full h-full object-contain p-0.5" />
                    : <span className="text-xs font-display font-bold text-primary">{b.name.charAt(0)}</span>
                  }
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-foreground leading-none">{b.name}</p>
                  <p className="text-xs text-primary mt-0.5">{L({ en: b.sectorEn, fr: b.sectorFr })}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-max marquee-right">
            {[...brandsRow2, ...brandsRow2].map((b, i) => (
              <div key={i}
                className="flex items-center gap-3 mx-3 px-5 py-3 bg-card border border-border rounded-sm hover:border-primary/40 transition-all duration-300 cursor-default flex-shrink-0">
                <div className="w-9 h-9 rounded-sm bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {b.logoUrl
                    ? <img src={b.logoUrl} alt={b.name} className="w-full h-full object-contain p-0.5" />
                    : <span className="text-xs font-display font-bold text-primary">{b.name.charAt(0)}</span>
                  }
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-foreground leading-none">{b.name}</p>
                  <p className="text-xs text-primary mt-0.5">{L({ en: b.sectorEn, fr: b.sectorFr })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10" />
      </section>

      {/* ── SERVICES — Bento grid ── */}
      <section className="bg-card py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header with inline CTA */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-10"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-foreground max-w-xl">
                {L({ en: 'Comprehensive Business Solutions', fr: "Solutions d'Affaires Complètes" })}
              </h2>
              <Button asChild variant="outline" className="rounded-sm font-display font-semibold text-sm flex-shrink-0 self-start sm:self-auto">
                <Link href="/services">
                  {L({ en: 'All Services', fr: 'Tous les Services' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Bento grid: featured (2×2) + 5 smaller cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* FEATURED: Logistics — large card with freight image */}
            <motion.div
              variants={fadeIn}
              className="relative md:col-span-2 md:row-span-2 min-h-[300px] md:min-h-0 overflow-hidden group cursor-default"
            >
              <Image
                src={services[0].image}
                alt={L({ en: services[0].en, fr: services[0].fr })}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/75 to-sidebar/15" />
              <div className="absolute inset-0 p-7 sm:p-10 flex flex-col justify-end">
                <div className="w-11 h-11 rounded-sm bg-primary/20 border border-primary/40 flex items-center justify-center mb-5">
                  <Ship className="h-5 w-5 text-primary" />
                </div>
                <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-2">
                  {L({ en: 'Core Service', fr: 'Service Principal' })}
                </p>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-sidebar-foreground tracking-tight mb-3">
                  {L({ en: services[0].en, fr: services[0].fr })}
                </h3>
                <p className="text-sidebar-foreground/65 text-sm leading-relaxed max-w-lg">
                  {L({ en: services[0].descEn, fr: services[0].descFr })}
                </p>
              </div>
            </motion.div>

            {/* Regular bento cards — services[1..5] */}
            {services.slice(1).map(({ icon: Icon, ...svc }) => (
              <motion.div
                key={svc.en}
                variants={fadeInUp}
                className="bento-card card-elevated bg-card border border-border p-6 cursor-default group"
              >
                <div className="w-10 h-10 rounded-sm bg-foreground flex items-center justify-center mb-4">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-display font-bold text-sm mb-2 group-hover:text-primary transition-colors duration-200">
                  {L({ en: svc.en, fr: svc.fr })}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {L({ en: svc.descEn, fr: svc.descFr })}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY LTIC — 50/50 navy + white split section ── */}
      <section className="overflow-hidden border-b border-border">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT: Navy panel with dot grid */}
          <div className="lg:flex-1 bg-sidebar relative">
            <div className="absolute inset-0 dot-grid opacity-60" />
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <div className="relative px-8 sm:px-12 lg:px-16 xl:px-20 py-20 lg:py-28 lg:max-w-2xl lg:ml-auto">
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
                <motion.span variants={fadeInUp} className="amber-rule mb-4" />
                <motion.p variants={fadeInUp}
                  className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
                  {L({ en: 'Why LTIC SARL', fr: 'Pourquoi LTIC SARL' })}
                </motion.p>
                <motion.h2 variants={fadeInUp}
                  className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-sidebar-foreground mb-6">
                  {L({ en: 'Your Strategic Partner for Global Operations', fr: 'Votre Partenaire Stratégique pour les Opérations Mondiales' })}
                </motion.h2>
                <motion.p variants={fadeInUp}
                  className="text-sidebar-foreground/60 mb-8 leading-relaxed text-sm sm:text-base">
                  {L({
                    en: 'LTIC SARL is more than a logistics company — we are a multinational business solutions provider with the networks, expertise, and operational capacity to handle your most complex international requirements.',
                    fr: "LTIC SARL est plus qu'une société de logistique — nous sommes un fournisseur de solutions d'affaires multinationales avec les réseaux, l'expertise et la capacité opérationnelle nécessaires.",
                  })}
                </motion.p>
                <ul className="space-y-3">
                  {whyPoints.map((item, i) => (
                    <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sidebar-foreground/70 text-sm">{L(item)}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: White panel with feature cards + mini stats */}
          <div className="lg:flex-1 bg-background px-8 sm:px-12 lg:px-16 xl:px-20 py-20 lg:py-28">
            <div className="lg:max-w-2xl">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="grid grid-cols-2 gap-4"
              >
                {whyCards.map(({ icon: Icon, ...card }) => (
                  <motion.div key={card.en} variants={scaleIn}
                    className="bg-card border border-border p-5 sm:p-6 card-elevated cursor-default">
                    <div className="w-10 h-10 rounded-sm bg-foreground flex items-center justify-center mb-4">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-display font-bold text-sm mb-1.5">{L({ en: card.en, fr: card.fr })}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{L({ en: card.descEn, fr: card.descFr })}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mini stats bar */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="mt-5 p-6 bg-foreground"
              >
                <p className="text-sidebar-foreground/45 text-xs uppercase tracking-widest font-display font-semibold mb-4">
                  {L({ en: 'By the Numbers', fr: 'En Chiffres' })}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { val: stats[0]?.value || '30+', en: 'Countries', fr: 'Pays' },
                    { val: stats[1]?.value || '500+', en: 'Clients', fr: 'Clients' },
                    { val: stats[2]?.value || '5+', en: 'Years', fr: 'Années' },
                  ].map((s) => (
                    <div key={s.en} className="text-center">
                      <span className="stat-num font-display font-bold text-2xl text-primary block">{s.val}</span>
                      <span className="text-sidebar-foreground/45 text-xs uppercase tracking-wide mt-1 block">{L(s)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-muted/50 py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-12"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              {L({ en: 'Industrial Catalog', fr: 'Catalogue Industriel' })}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
                {L({ en: 'Featured Products', fr: 'Produits en Vedette' })}
              </h2>
              <Button asChild variant="outline" className="rounded-sm font-display font-semibold text-sm flex-shrink-0 self-start sm:self-auto">
                <Link href="/products">
                  {L({ en: 'Browse Full Catalog', fr: 'Parcourir le Catalogue' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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
                  <motion.div key={product.id} variants={fadeInUp}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-300 block card-elevated"
                    >
                      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt={L({ en: product.nameEn, fr: product.nameFr })}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        {product.categoryName && (
                          <span className="inline-block bg-primary/15 text-primary text-xs rounded-sm px-2 py-0.5 mb-2 font-medium">
                            {product.categoryName}
                          </span>
                        )}
                        <h3 className="font-display font-semibold text-sm leading-tight group-hover:text-primary transition-colors duration-200">
                          {L({ en: product.nameEn, fr: product.nameFr })}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS — Vertical route-line + Industries panel ── */}
      <section className="bg-background py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-14 max-w-xl"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              {L({ en: 'Simple Process', fr: 'Processus Simple' })}
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-4">
              {L({ en: 'How to Place an Order', fr: 'Comment Passer une Commande' })}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {L({ en: 'From catalog to delivery — four clear steps.', fr: 'Du catalogue à la livraison — quatre étapes claires.' })}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* LEFT: Vertical route-line timeline (signature element) */}
            <div className="relative">
              {/* The dashed route line */}
              <div className="absolute left-8 top-10 bottom-10 route-line-dashed" />

              {orderSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeInLeft}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 mb-5 last:mb-0"
                >
                  {/* Waypoint circle */}
                  <div className="relative z-10 w-16 h-16 rounded-full border-2 border-primary bg-background flex items-center justify-center flex-shrink-0 shadow-[0_0_0_4px_hsl(var(--background))]">
                    <span className="font-display font-bold text-base text-primary">0{i + 1}</span>
                  </div>
                  {/* Step card */}
                  <div className="flex-1 bg-card border border-border p-5 card-elevated">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <h3 className="font-display font-bold text-sm">{L(step.title)}</h3>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3">{L(step.desc)}</p>
                    {step.href && step.action && (
                      <Link href={step.href}
                        className="inline-flex items-center gap-1 text-primary text-xs font-display font-semibold hover:gap-2 transition-all duration-200">
                        {L(step.action)} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* RIGHT: Industries panel on navy bg */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="bg-sidebar rounded-sm p-8 lg:p-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 dot-grid opacity-50" />
              <div className="relative">
                <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
                  {L({ en: 'Industries We Serve', fr: 'Secteurs que Nous Servons' })}
                </p>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-sidebar-foreground tracking-tight mb-6">
                  {L({ en: 'Global Coverage Across All Sectors', fr: 'Couverture Mondiale Tous Secteurs' })}
                </h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {industries.map((ind) => (
                    <span key={ind.en}
                      className="px-3 py-1.5 bg-sidebar-border/50 border border-sidebar-border text-sidebar-foreground/70 text-xs font-medium rounded-sm">
                      {L(ind)}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild size="sm" className="font-display font-semibold text-xs rounded-sm justify-start">
                    <Link href="/products">
                      {L({ en: 'Browse Industrial Catalog', fr: 'Catalogue Industriel' })}
                      <ArrowRight className="h-3.5 w-3.5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline"
                    className="font-display font-semibold text-xs rounded-sm justify-start bg-transparent border-sidebar-foreground/20 text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground hover:border-sidebar-foreground/40">
                    <Link href="/contact">
                      {L({ en: 'Contact a Specialist', fr: 'Contacter un Spécialiste' })}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA — Centered, dramatic, dot-grid navy ── */}
      <section className="bg-sidebar relative overflow-hidden py-28">
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-55 pointer-events-none" />
        {/* Soft blue light from corners */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        {/* Top rule */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <motion.p variants={fadeInUp}
              className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-6">
              {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
            </motion.p>
            <motion.h2 variants={fadeInUp}
              className="text-hero font-display font-bold text-sidebar-foreground tracking-tight mb-6">
              {L({ en: 'Optimize Your Global Operations Today.', fr: "Optimisez Vos Opérations Mondiales Aujourd'hui." })}
            </motion.h2>
            <motion.p variants={fadeInUp}
              className="text-sidebar-foreground/55 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {L({
                en: 'Connect with our team of logistics and trade experts. Get a tailored solution for your next shipment or industrial supply.',
                fr: "Connectez-vous avec nos experts en logistique et commerce. Obtenez une solution sur mesure pour votre prochaine expédition.",
              })}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="font-display font-semibold text-sm px-8 rounded-sm shadow-none">
                <Link href="/contact">
                  {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"
                className="font-display font-semibold text-sm px-8 rounded-sm bg-transparent border-sidebar-foreground/25 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:border-sidebar-foreground/40 hover:text-sidebar-foreground">
                <Link href="/quote">{L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
