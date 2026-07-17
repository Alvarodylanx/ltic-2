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
  { icon: Ship,      en: 'Logistics & Transit',          fr: 'Logistique & Transit',          descEn: 'End-to-end freight forwarding, customs clearance, and international transit across air, sea and road.',                     descFr: 'Freight forwarding complet, dédouanement et transit international aérien, maritime et routier.' },
  { icon: Globe2,    en: 'Import & Export',               fr: 'Import & Export',                descEn: 'Seamless global trade facilitation with compliance, documentation and strategic sourcing expertise.',                       descFr: 'Facilitation du commerce mondial avec conformité, documentation et expertise en sourcing stratégique.' },
  { icon: Factory,   en: 'Industrial Supply',             fr: 'Fourniture Industrielle',        descEn: 'Generators, lubricants, filters, and heavy industrial materials delivered to specification.',                              descFr: 'Générateurs, lubrifiants, filtres et matériaux industriels lourds livrés selon spécifications.' },
  { icon: TreePine,  en: 'Timber & Trade',                fr: 'Bois & Commerce',                descEn: 'Premium certified tropical timber and logs for international construction and woodworking markets.',                        descFr: "Bois tropicaux certifiés premium pour la construction internationale et les marchés du bois." },
  { icon: BarChart3, en: 'Supply Chain Consulting',       fr: "Conseil Chaîne d'Approvisionnement", descEn: 'Strategic procurement and logistics optimization for enterprises operating in complex markets.',                      descFr: "Optimisation stratégique des achats et de la logistique pour entreprises sur marchés complexes." },
  { icon: Handshake, en: 'Commercial Representation',     fr: 'Représentation Commerciale',     descEn: 'Brand and market representation, joint ventures, and strategic business partnerships.',                                     descFr: "Représentation de marque, coentreprises et partenariats commerciaux stratégiques." },
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
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] sm:min-h-[88vh] bg-sidebar flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=70"
            alt="Cargo logistics operations"
            fill
            className="object-cover opacity-15"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar/95 to-sidebar/50" />
        </div>

        {/* Blue vertical accent line — desktop only */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden lg:block" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 lg:pl-12">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">

            <motion.p
              variants={fadeInUp}
              className="text-sidebar-primary font-display font-semibold text-xs uppercase tracking-[0.22em] mb-5"
            >
              {L({ en: 'Multinational Business Solutions', fr: "Solutions d'Affaires Multinationales" })}
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="text-hero font-display font-bold text-sidebar-foreground tracking-tight mb-6 sm:mb-8"
            >
              {L({ en: 'Global Logistics & Industrial Trade', fr: 'Logistique Mondiale & Commerce Industriel' })}
              <span className="block text-sidebar-primary mt-2 sm:mt-3">
                {L({ en: 'Built for Africa.', fr: "Conçu pour l'Afrique." })}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-sidebar-foreground/70 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl"
            >
              {L({
                en: 'Reliable logistics, transit, industrial supply, and international trade services — connecting 30+ countries with precision and accountability.',
                fr: 'Services fiables de logistique, transit, fourniture industrielle et commerce international — connectant 30+ pays avec précision et responsabilité.',
              })}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="font-display font-semibold px-8 rounded-sm shadow-none w-full xs:w-auto"
              >
                <Link href="/quote">
                  {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-display font-semibold px-8 rounded-sm bg-transparent border-sidebar-foreground/30 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground hover:border-sidebar-foreground/50 w-full xs:w-auto"
              >
                <Link href="/services">{L({ en: 'Our Services', fr: 'Nos Services' })}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-foreground py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn} className="flex flex-col items-center">
                <span className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-sidebar-primary leading-none mb-2">
                  {stat.value}
                </span>
                <span className="text-sidebar-foreground/60 text-xs uppercase tracking-widest font-medium mt-1">
                  {L(stat)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Partners marquee ── */}
      <section className="relative bg-background py-12 sm:py-16 overflow-hidden">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="text-center mb-8 sm:mb-10 px-4"
        >
          <span className="amber-rule mx-auto mb-4" />
          <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-2">
            {L({ en: 'Trusted Partners & Brands', fr: 'Partenaires & Marques de Confiance' })}
          </p>
          <h2 className="font-display font-bold text-section tracking-tight">
            {L({ en: 'Brands We Work With', fr: 'Marques Avec Lesquelles Nous Travaillons' })}
          </h2>
        </motion.div>

        <div className="marquee-wrap space-y-3 select-none">
          <div className="flex w-max marquee-left">
            {[...brandsRow1, ...brandsRow1].map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 mx-3 px-5 py-3 bg-card border border-border rounded-sm hover:border-primary/40 transition-all duration-300 cursor-default flex-shrink-0"
              >
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
              <div
                key={i}
                className="flex items-center gap-3 mx-3 px-5 py-3 bg-card border border-border rounded-sm hover:border-primary/40 transition-all duration-300 cursor-default flex-shrink-0"
              >
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

        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-l from-background to-transparent z-10" />
      </section>

      {/* ── Services ── */}
      <section className="bg-card py-16 sm:py-20 lg:py-28 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-12 sm:mb-16"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
            </p>
            <h2 className="font-display font-bold text-section tracking-tight text-foreground mb-4">
              {L({ en: 'Comprehensive Business Solutions', fr: "Solutions d'Affaires Complètes" })}
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed text-sm sm:text-base">
              {L({
                en: 'From freight forwarding to industrial supply and strategic partnerships — covering the full spectrum of global business operations.',
                fr: "Du freight forwarding à la fourniture industrielle et aux partenariats stratégiques — couvrant tout le spectre des opérations mondiales.",
              })}
            </p>
          </motion.div>

          {/* Seamless grid — gap-px on md+, spaced on mobile */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-px sm:bg-border"
          >
            {services.map(({ icon: Icon, ...svc }) => (
              <motion.div
                key={svc.en}
                variants={fadeInUp}
                className="group bg-card p-6 sm:p-7 lg:p-8 hover:bg-muted/40 transition-colors duration-300 cursor-default relative border border-border sm:border-0"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-sm bg-foreground flex items-center justify-center mb-5 sm:mb-6">
                  <Icon className="h-5 w-5 text-sidebar-primary" />
                </div>
                <h3 className="font-display font-bold text-base mb-3">{L({ en: svc.en, fr: svc.fr })}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{L({ en: svc.descEn, fr: svc.descFr })}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-8 sm:mt-10"
          >
            <Button asChild variant="outline" className="rounded-sm font-display font-semibold text-sm w-full sm:w-auto">
              <Link href="/services">
                {L({ en: 'View All Services', fr: 'Voir Tous les Services' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-background py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <span className="amber-rule mb-4" />
              <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
                {L({ en: 'Why LTIC SARL', fr: 'Pourquoi LTIC SARL' })}
              </p>
              <h2 className="font-display font-bold text-section tracking-tight mb-5 sm:mb-6">
                {L({ en: 'Your Strategic Partner for Global Operations', fr: 'Votre Partenaire Stratégique pour les Opérations Mondiales' })}
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                {L({
                  en: 'LTIC SARL is more than a logistics company — we are a multinational business solutions provider with the networks, expertise, and operational capacity to handle your most complex international requirements.',
                  fr: "LTIC SARL est plus qu'une société de logistique — nous sommes un fournisseur de solutions d'affaires multinationales avec les réseaux, l'expertise et la capacité opérationnelle nécessaires.",
                })}
              </p>
              <ul className="space-y-3">
                {[
                  { en: 'Multinational trade network across Africa, Europe, Middle East & Americas', fr: "Réseau commercial multinational en Afrique, Europe, Moyen-Orient & Amériques" },
                  { en: 'Full-spectrum logistics: freight, customs, warehousing, last-mile delivery', fr: "Logistique complète: fret, douane, entreposage, livraison dernier kilomètre" },
                  { en: 'Certified industrial supply partners — Total, Shell and leading OEM brands', fr: "Partenaires certifiés — Total, Shell et grandes marques OEM" },
                  { en: 'Dedicated account management and 24/7 shipment tracking', fr: "Gestion de compte dédiée et suivi d'expédition 24h/7j" },
                  { en: 'Phytosanitary treatment and regulatory compliance services', fr: "Services de traitement phytosanitaire et conformité réglementaire" },
                  { en: 'Transparent pricing, structured documentation, on-time delivery', fr: "Tarification transparente, documentation structurée, livraison à temps" },
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
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{L(item)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {[
                { icon: Shield,     en: 'Reliability',    fr: 'Fiabilité',     descEn: 'On-time delivery backed by structured documentation and tracking.',                  descFr: 'Livraison à temps avec documentation structurée et suivi.' },
                { icon: Globe2,     en: 'Global Network', fr: 'Réseau Mondial', descEn: 'Established connections across 30+ countries and key trade corridors.',               descFr: 'Connexions établies dans 30+ pays et corridors commerciaux clés.' },
                { icon: Zap,        en: 'Efficiency',     fr: 'Efficacité',    descEn: 'Optimized supply chains reducing cost and transit time.',                              descFr: "Chaînes d'approvisionnement optimisées réduisant coûts et délais." },
                { icon: TrendingUp, en: 'Growth',         fr: 'Croissance',    descEn: 'Strategic partnerships that open new markets and opportunities.',                       descFr: "Partenariats stratégiques ouvrant de nouveaux marchés et opportunités." },
              ].map(({ icon: Icon, ...card }) => (
                <motion.div
                  key={card.en}
                  variants={scaleIn}
                  className="bg-card border border-border rounded-sm p-5 sm:p-6 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-sm bg-foreground flex items-center justify-center mb-4">
                    <Icon className="h-4 w-4 text-sidebar-primary" />
                  </div>
                  <h4 className="font-display font-bold text-sm mb-1.5">{L({ en: card.en, fr: card.fr })}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{L({ en: card.descEn, fr: card.descFr })}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-muted/40 py-16 sm:py-20 lg:py-28 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-12 sm:mb-16"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              {L({ en: 'Industrial Catalog', fr: 'Catalogue Industriel' })}
            </p>
            <h2 className="font-display font-bold text-section tracking-tight">
              {L({ en: 'Featured Products', fr: 'Produits en Vedette' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-10"
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
                      className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/50 hover:shadow-sm transition-all duration-300 block"
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
                          <span className="inline-block bg-secondary text-primary text-xs rounded-sm px-2 py-0.5 mb-2 font-medium font-display">
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

          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <Button asChild variant="outline" className="rounded-sm font-display font-semibold text-sm w-full sm:w-auto">
              <Link href="/products">
                {L({ en: 'Browse Full Catalog', fr: 'Parcourir le Catalogue' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Industries ── */}
      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-10 sm:mb-12 text-center"
          >
            <span className="amber-rule mx-auto mb-4" />
            <h2 className="font-display font-bold text-section tracking-tight">
              {L({ en: 'Industries We Serve', fr: 'Secteurs que Nous Servons' })}
            </h2>
          </motion.div>
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {industries.map((ind) => (
              <motion.span
                key={ind.en}
                variants={scaleIn}
                className="bg-card border border-border text-foreground rounded-sm px-4 sm:px-5 py-2.5 text-sm font-display font-medium cursor-default hover:border-primary/50 hover:text-primary hover:bg-secondary/40 transition-colors duration-200"
              >
                {L(ind)}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How to Order ── */}
      <section className="bg-muted/40 py-16 sm:py-20 lg:py-28 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-12 sm:mb-16"
          >
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              {L({ en: 'Simple Process', fr: 'Processus Simple' })}
            </p>
            <h2 className="font-display font-bold text-section tracking-tight mb-4">
              {L({ en: 'How to Place an Order', fr: 'Comment Passer une Commande' })}
            </h2>
            <p className="text-muted-foreground max-w-md text-sm sm:text-base">
              {L({ en: 'From catalog to delivery — four straightforward steps.', fr: 'Du catalogue à la livraison — quatre étapes claires.' })}
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative"
          >
            {orderSteps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative">
                {/* Connector line — desktop only */}
                {i < orderSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-0.5rem)] w-full h-px bg-border z-0" />
                )}
                <div className="relative z-10 bg-card border border-border rounded-sm p-5 sm:p-6 h-full hover:border-primary/40 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-sm bg-foreground flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-4 w-4 text-sidebar-primary" />
                    </div>
                    <span className="font-display font-bold text-2xl text-primary/25 leading-none">0{i + 1}</span>
                  </div>
                  <h3 className="font-display font-bold text-sm mb-2">{L(step.title)}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">{L(step.desc)}</p>
                  {step.href && step.action && (
                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-1.5 text-primary text-xs font-display font-semibold hover:gap-2.5 transition-all duration-200 min-h-[24px]"
                    >
                      {L(step.action)} <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-foreground py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-sidebar-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-4">
                {L({ en: 'Ready to Start?', fr: 'Prêt à Commencer ?' })}
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-sidebar-foreground tracking-tight leading-tight">
                {L({ en: 'Optimize Your Global Operations Today.', fr: "Optimisez Vos Opérations Mondiales Aujourd'hui." })}
              </h2>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="font-display font-semibold px-8 rounded-sm w-full sm:w-auto"
              >
                <Link href="/contact">
                  {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="font-display font-semibold px-8 rounded-sm bg-transparent border-sidebar-foreground/25 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:border-sidebar-foreground/40 hover:text-sidebar-foreground w-full sm:w-auto"
              >
                <Link href="/quote">{L({ en: 'Get a Quote', fr: 'Obtenir un Devis' })}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
