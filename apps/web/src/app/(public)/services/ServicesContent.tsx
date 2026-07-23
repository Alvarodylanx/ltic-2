'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, Globe2, Factory, BarChart3, Handshake, Leaf, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeInUp, fadeInLeft, stagger, viewportOnce } from '@/components/motion/variants';

const services = [
  {
    icon: Ship, en: 'Logistics & Transit', fr: 'Logistique & Transit',
    headlineEn: 'End-to-End Global Freight Solutions', headlineFr: 'Solutions de Fret Mondial de Bout en Bout',
    descEn: 'LTIC SARL manages the complete logistics lifecycle — from freight booking and customs clearance to final-mile delivery across air, sea, and road in 30+ countries.',
    descFr: "LTIC SARL gère le cycle logistique complet — de la réservation de fret et du dédouanement jusqu'à la livraison finale sur les réseaux aériens, maritimes et routiers dans plus de 30 pays.",
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['International freight coordination (air, sea, road)', 'Cargo handling and warehousing', 'Customs clearance and documentation', 'International transit management', 'Last-mile distribution solutions', 'Real-time shipment tracking'],
    bulletsFr: ['Coordination du fret international (air, mer, route)', 'Manutention et entreposage de marchandises', 'Dédouanement et documentation', 'Gestion du transit international', 'Solutions de distribution dernier kilomètre', 'Suivi en temps réel des expéditions'],
  },
  {
    icon: Globe2, en: 'Import & Export', fr: 'Import & Export',
    headlineEn: 'Seamless International Trade Facilitation', headlineFr: 'Facilitation Fluide du Commerce International',
    descEn: 'We facilitate seamless cross-border transactions with expert compliance management, strategic sourcing, and comprehensive documentation support.',
    descFr: 'Nous facilitons des transactions transfrontalières fluides avec une gestion experte de la conformité, un sourcing stratégique et un support documentaire complet.',
    image: 'https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['International trade facilitation', 'Customs coordination and compliance', 'Global sourcing and procurement', 'Trade documentation management', 'Regulatory compliance advisory', 'Strategic market sourcing'],
    bulletsFr: ['Facilitation du commerce international', 'Coordination douanière et conformité', 'Sourcing mondial et approvisionnement', 'Gestion de la documentation commerciale', 'Conseil en conformité réglementaire', 'Sourcing stratégique de marché'],
  },
  {
    icon: Factory, en: 'Industrial Supply', fr: 'Fourniture Industrielle',
    headlineEn: 'Premium Industrial Products & Materials', headlineFr: 'Produits & Matériaux Industriels Premium',
    descEn: 'As an authorized distributor for Total, Shell and major OEM brands, we supply certified industrial products directly to your operations anywhere in the world.',
    descFr: 'En tant que distributeur agréé de Total, Shell et grandes marques OEM, nous fournissons des produits industriels certifiés directement à vos opérations partout dans le monde.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Industrial generators (diesel, gas, standby power)', 'Lubricants — Total, Shell and leading brands', 'Oil filters and air filters (OEM-grade)', 'Timber and logs (certified tropical species)', 'Heavy industrial materials and equipment', 'Custom industrial procurement'],
    bulletsFr: ['Générateurs industriels (diesel, gaz, secours)', 'Lubrifiants — Total, Shell et grandes marques', 'Filtres à huile et à air (qualité OEM)', 'Bois et grumes (essences tropicales certifiées)', 'Matériaux industriels lourds et équipements', 'Approvisionnement industriel sur mesure'],
  },
  {
    icon: BarChart3, en: 'Supply Chain Consulting', fr: "Conseil en Chaîne d'Approvisionnement",
    headlineEn: 'Strategic Logistics Optimization', headlineFr: 'Optimisation Logistique Stratégique',
    descEn: 'Our consultants bring deep expertise in logistics network design, procurement strategy, and supply chain risk management for complex market environments.',
    descFr: "Nos consultants apportent une expertise approfondie en conception de réseaux logistiques, stratégie d'approvisionnement et gestion des risques de la chaîne logistique.",
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Supply chain strategy and design', 'Logistics network optimization', 'Procurement consulting', 'Cost reduction analysis', 'Risk management in trade', 'Operational efficiency consulting'],
    bulletsFr: ["Stratégie et conception de la chaîne d'approvisionnement", 'Optimisation du réseau logistique', 'Conseil en approvisionnement', 'Analyse de réduction des coûts', 'Gestion des risques commerciaux', 'Conseil en efficacité opérationnelle'],
  },
  {
    icon: Handshake, en: 'Commercial Representation', fr: 'Représentation Commerciale',
    headlineEn: 'Your Gateway to New Markets', headlineFr: "Votre Porte d'Entrée vers de Nouveaux Marchés",
    descEn: 'We connect international brands with local market opportunities through strategic representation, joint ventures, and distribution partnerships.',
    descFr: 'Nous connectons les marques internationales aux opportunités de marché locales grâce à la représentation stratégique, aux coentreprises et aux partenariats de distribution.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Market entry strategy', 'Brand representation in target markets', 'Joint venture facilitation', 'Strategic business partnerships', 'Distribution channel development', 'Trade mission coordination'],
    bulletsFr: ["Stratégie d'entrée sur le marché", 'Représentation de marque sur les marchés cibles', 'Facilitation de coentreprises', 'Partenariats commerciaux stratégiques', 'Développement de canaux de distribution', 'Coordination de missions commerciales'],
  },
  {
    icon: Leaf, en: 'Phytosanitary Treatment', fr: 'Traitement Phytosanitaire',
    headlineEn: 'Compliance-First Treatment Services', headlineFr: 'Services de Traitement Axés sur la Conformité',
    descEn: 'Our certified phytosanitary and sanitation services ensure your timber, agricultural goods, and equipment meet all importing country requirements.',
    descFr: "Nos services certifiés de traitement phytosanitaire garantissent que votre bois, vos produits agricoles et équipements répondent à toutes les exigences des pays importateurs.",
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Phytosanitary treatment for timber and agricultural goods', 'Industrial sanitation services', 'Regulatory compliance documentation', 'Inspection coordination', 'Treatment certification'],
    bulletsFr: ['Traitement phytosanitaire pour bois et produits agricoles', "Services d'assainissement industriel", 'Documentation de conformité réglementaire', 'Coordination des inspections', 'Certification de traitement'],
  },
  {
    icon: Truck, en: 'Transportation', fr: 'Transport',
    headlineEn: 'Reliable Multimodal Transportation', headlineFr: 'Transport Multimodal Fiable',
    descEn: 'From local road freight to international sea and air cargo, LTIC SARL coordinates reliable, cost-effective transportation solutions tailored to your timeline.',
    descFr: 'Du fret routier local au cargo maritime et aérien international, LTIC SARL coordonne des solutions de transport fiables et économiques adaptées à votre calendrier.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Road freight (local and regional)', 'Air freight coordination', 'Sea freight booking and management', 'Port handling and documentation', 'Fleet coordination for bulk cargo'],
    bulletsFr: ['Fret routier (local et régional)', 'Coordination du fret aérien', 'Réservation et gestion du fret maritime', 'Manutention portuaire et documentation', 'Coordination de flotte pour fret en vrac'],
  },
];

export default function ServicesPage() {
  const { L } = useLanguage();
  const [active, setActive] = useState(0);

  const svc = services[active];

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative bg-sidebar py-20 sm:py-28 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&auto=format&fit=crop&q=50"
          alt="" fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/90 via-sidebar/70 to-sidebar/30" />
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p variants={fadeInUp}
            className="text-primary font-display font-semibold text-xs uppercase tracking-[0.25em] mb-4">
            {L({ en: 'Our Services', fr: 'Nos Services' })}
          </motion.p>
          <motion.h1 variants={fadeInUp}
            className="font-display font-bold text-section text-sidebar-foreground leading-none mb-5 max-w-2xl">
            {L({ en: 'Full-Spectrum Business Solutions', fr: "Solutions d'Affaires à Spectre Complet" })}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-sidebar-foreground/70 text-base sm:text-lg max-w-xl leading-relaxed">
            {L({ en: 'Seven specializations. One integrated partner. Excellence across every dimension of global commerce.', fr: "Sept spécialisations. Un partenaire intégré. L'excellence dans toutes les dimensions du commerce mondial." })}
          </motion.p>
        </motion.div>
      </section>

      {/* ── TABBED SERVICE EXPLORER ─────────────────────────────────────────── */}
      <section className="bg-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── DESKTOP: sidebar tabs + right panel ── */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="hidden lg:grid lg:grid-cols-[280px_1fr] border border-border rounded-sm overflow-hidden"
            style={{ minHeight: 680 }}>

            {/* Left: tab list */}
            <div className="border-r border-border flex flex-col bg-muted/10">
              {/* Header */}
              <div className="px-6 py-5 border-b border-border">
                <p className="text-primary font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-0.5">
                  {L({ en: 'Our Services', fr: 'Nos Services' })}
                </p>
                <p className="text-muted-foreground/50 text-[10px] font-display uppercase tracking-widest">
                  {L({ en: '7 Specializations', fr: '7 Spécialisations' })}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex-1 divide-y divide-border">
                {services.map((s, i) => {
                  const isActive = active === i;
                  return (
                    <button
                      key={s.en}
                      onClick={() => setActive(i)}
                      className={`relative w-full text-left flex items-center gap-3 px-6 py-4 transition-all duration-200 group ${
                        isActive ? 'bg-foreground' : 'hover:bg-muted/40'
                      }`}>
                      {/* Active border */}
                      {isActive && (
                        <motion.div
                          layoutId="tab-border"
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      {/* Number */}
                      <span className={`font-display font-black text-xs tabular-nums w-7 flex-shrink-0 transition-colors duration-200 ${
                        isActive ? 'text-primary' : 'text-muted-foreground/30 group-hover:text-muted-foreground/60'
                      }`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {/* Name */}
                      <span className={`font-display font-bold text-sm leading-snug flex-1 transition-colors duration-200 ${
                        isActive ? 'text-sidebar-foreground' : 'text-foreground'
                      }`}>
                        {L({ en: s.en, fr: s.fr })}
                      </span>
                      {/* Arrow */}
                      <motion.div
                        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
                        transition={{ duration: 0.2 }}>
                        <ArrowRight className="h-3.5 w-3.5 text-primary" />
                      </motion.div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="p-5 border-t border-border">
                <Button asChild size="sm" className="w-full rounded-sm font-display font-semibold text-xs">
                  <Link href="/quote">
                    {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                    <ArrowRight className="h-3 w-3 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: service detail */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col">

                  {/* Image — top 42% */}
                  <div className="relative flex-shrink-0" style={{ height: '42%' }}>
                    <Image
                      src={svc.image}
                      alt={L({ en: svc.en, fr: svc.fr })}
                      fill className="object-cover"
                      sizes="70vw" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
                    {/* Service number watermark */}
                    <span className="absolute top-5 right-6 font-display font-black leading-none select-none pointer-events-none"
                      style={{ fontSize: '6rem', color: 'rgba(255,255,255,0.06)' }}>
                      {String(active + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content — bottom 58% */}
                  <div className="flex-1 overflow-y-auto px-10 py-7">
                    <p className="text-primary font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-2">
                      {L({ en: svc.en, fr: svc.fr })}
                    </p>
                    <h2 className="font-display font-bold text-2xl lg:text-3xl tracking-tight mb-3 leading-tight">
                      {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-prose">
                      {L({ en: svc.descEn, fr: svc.descFr })}
                    </p>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                      {svc.bulletsEn.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <span className="mt-2 h-px w-4 bg-primary flex-shrink-0" />
                          {L({ en: b, fr: svc.bulletsFr[i] })}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── MOBILE: horizontal scroll tabs + stacked content ── */}
          <div className="lg:hidden">
            {/* Scrollable tab strip */}
            <div className="flex overflow-x-auto gap-2 pb-3 mb-6 scrollbar-hide">
              {services.map((s, i) => (
                <button
                  key={s.en}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-sm border text-sm font-display font-bold transition-all duration-200 ${
                    active === i
                      ? 'bg-foreground border-foreground text-sidebar-foreground'
                      : 'bg-background border-border text-muted-foreground'
                  }`}>
                  <span className={`text-[10px] font-black ${active === i ? 'text-primary' : 'text-muted-foreground/40'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {L({ en: s.en, fr: s.fr })}
                </button>
              ))}
            </div>

            {/* Mobile service content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="border border-border rounded-sm overflow-hidden">
                <div className="relative h-52">
                  <Image src={svc.image} alt={L({ en: svc.en, fr: svc.fr })} fill
                    className="object-cover" sizes="100vw" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
                </div>
                <div className="p-6">
                  <p className="text-primary font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-2">
                    {L({ en: svc.en, fr: svc.fr })}
                  </p>
                  <h2 className="font-display font-bold text-xl tracking-tight mb-3">
                    {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {L({ en: svc.descEn, fr: svc.descFr })}
                  </p>
                  <ul className="space-y-2.5 mb-5">
                    {svc.bulletsEn.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-2 h-px w-4 bg-primary flex-shrink-0" />
                        {L({ en: b, fr: svc.bulletsFr[i] })}
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="sm" className="rounded-sm font-display font-semibold w-full">
                    <Link href="/quote">
                      {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                      <ArrowRight className="h-3.5 w-3.5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="bg-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-sidebar-foreground tracking-tight">
              {L({ en: 'Ready to Get Started?', fr: 'Prêt à Commencer ?' })}
            </h2>
            <p className="text-sidebar-foreground/60 text-sm mt-2">
              {L({ en: 'Discuss your requirements and get a tailored proposal within 24 hours.', fr: 'Discutez de vos besoins et obtenez une proposition personnalisée dans les 24 heures.' })}
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex flex-shrink-0 gap-3">
            <Button asChild size="lg" className="font-display font-semibold text-sm rounded-sm">
              <Link href="/contact">
                {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="font-display font-semibold text-sm rounded-sm border-white/20 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground">
              <Link href="/quote">
                {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
