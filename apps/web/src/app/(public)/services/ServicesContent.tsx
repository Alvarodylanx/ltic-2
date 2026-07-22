'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ship, Globe2, Factory, BarChart3, Handshake, Leaf, Truck, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeInUp, fadeInLeft, stagger, viewportOnce } from '@/components/motion/variants';

const services = [
  {
    icon: Ship, en: 'Logistics & Transit', fr: 'Logistique & Transit',
    headlineEn: 'End-to-End Global Freight Solutions', headlineFr: 'Solutions de Fret Mondial de Bout en Bout',
    descEn: 'LTIC SARL manages the complete logistics lifecycle — from freight booking and customs clearance to final-mile delivery across air, sea, and road in 30+ countries.',
    descFr: "LTIC SARL gère le cycle logistique complet — de la réservation de fret et du dédouanement jusqu'à la livraison finale sur les réseaux aériens, maritimes et routiers dans plus de 30 pays.",
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&auto=format&fit=crop&q=70',
    bulletsEn: ['International freight coordination (air, sea, road)', 'Cargo handling and warehousing', 'Customs clearance and documentation', 'Real-time shipment tracking'],
    bulletsFr: ['Coordination du fret international (air, mer, route)', 'Manutention et entreposage de marchandises', 'Dédouanement et documentation', 'Suivi en temps réel des expéditions'],
  },
  {
    icon: Globe2, en: 'Import & Export', fr: 'Import & Export',
    headlineEn: 'Seamless International Trade Facilitation', headlineFr: 'Facilitation Fluide du Commerce International',
    descEn: 'We facilitate seamless cross-border transactions with expert compliance management, strategic sourcing, and comprehensive documentation support.',
    descFr: 'Nous facilitons des transactions transfrontalières fluides avec une gestion experte de la conformité, un sourcing stratégique et un support documentaire complet.',
    image: 'https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=1400&auto=format&fit=crop&q=70',
    bulletsEn: ['International trade facilitation', 'Customs coordination and compliance', 'Global sourcing and procurement', 'Trade documentation management'],
    bulletsFr: ['Facilitation du commerce international', 'Coordination douanière et conformité', 'Sourcing mondial et approvisionnement', 'Gestion de la documentation commerciale'],
  },
  {
    icon: Factory, en: 'Industrial Supply', fr: 'Fourniture Industrielle',
    headlineEn: 'Premium Industrial Products & Materials', headlineFr: 'Produits & Matériaux Industriels Premium',
    descEn: 'As an authorized distributor for Total, Shell and major OEM brands, we supply certified industrial products directly to your operations anywhere in the world.',
    descFr: 'En tant que distributeur agréé de Total, Shell et grandes marques OEM, nous fournissons des produits industriels certifiés directement à vos opérations partout dans le monde.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1400&auto=format&fit=crop&q=70',
    bulletsEn: ['Industrial generators (diesel, gas, standby power)', 'Lubricants — Total, Shell and leading brands', 'Oil filters and air filters (OEM-grade)', 'Heavy industrial materials and equipment'],
    bulletsFr: ['Générateurs industriels (diesel, gaz, secours)', 'Lubrifiants — Total, Shell et grandes marques', 'Filtres à huile et à air (qualité OEM)', 'Matériaux industriels lourds et équipements'],
  },
  {
    icon: BarChart3, en: 'Supply Chain Consulting', fr: "Conseil en Chaîne d'Approvisionnement",
    headlineEn: 'Strategic Logistics Optimization', headlineFr: 'Optimisation Logistique Stratégique',
    descEn: 'Our consultants bring deep expertise in logistics network design, procurement strategy, and supply chain risk management for complex market environments.',
    descFr: "Nos consultants apportent une expertise approfondie en conception de réseaux logistiques, stratégie d'approvisionnement et gestion des risques de la chaîne logistique.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&auto=format&fit=crop&q=70',
    bulletsEn: ['Supply chain strategy and design', 'Logistics network optimization', 'Procurement consulting', 'Risk management in trade'],
    bulletsFr: ["Stratégie et conception de la chaîne d'approvisionnement", 'Optimisation du réseau logistique', 'Conseil en approvisionnement', 'Gestion des risques commerciaux'],
  },
  {
    icon: Handshake, en: 'Commercial Representation', fr: 'Représentation Commerciale',
    headlineEn: 'Your Gateway to New Markets', headlineFr: "Votre Porte d'Entrée vers de Nouveaux Marchés",
    descEn: 'We connect international brands with local market opportunities through strategic representation, joint ventures, and distribution partnerships.',
    descFr: 'Nous connectons les marques internationales aux opportunités de marché locales grâce à la représentation stratégique, aux coentreprises et aux partenariats de distribution.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&auto=format&fit=crop&q=70',
    bulletsEn: ['Market entry strategy', 'Brand representation in target markets', 'Joint venture facilitation', 'Distribution channel development'],
    bulletsFr: ["Stratégie d'entrée sur le marché", 'Représentation de marque sur les marchés cibles', 'Facilitation de coentreprises', 'Développement de canaux de distribution'],
  },
  {
    icon: Leaf, en: 'Phytosanitary Treatment', fr: 'Traitement Phytosanitaire',
    headlineEn: 'Compliance-First Treatment Services', headlineFr: 'Services de Traitement Axés sur la Conformité',
    descEn: 'Our certified phytosanitary and sanitation services ensure your timber, agricultural goods, and equipment meet all importing country requirements.',
    descFr: "Nos services certifiés de traitement phytosanitaire garantissent que votre bois, vos produits agricoles et équipements répondent à toutes les exigences des pays importateurs.",
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&auto=format&fit=crop&q=70',
    bulletsEn: ['Phytosanitary treatment for timber', 'Industrial sanitation services', 'Regulatory compliance documentation', 'Treatment certification'],
    bulletsFr: ['Traitement phytosanitaire pour bois', "Services d'assainissement industriel", 'Documentation de conformité réglementaire', 'Certification de traitement'],
  },
  {
    icon: Truck, en: 'Transportation', fr: 'Transport',
    headlineEn: 'Reliable Multimodal Transportation', headlineFr: 'Transport Multimodal Fiable',
    descEn: 'From local road freight to international sea and air cargo, LTIC SARL coordinates reliable, cost-effective transportation solutions tailored to your timeline.',
    descFr: 'Du fret routier local au cargo maritime et aérien international, LTIC SARL coordonne des solutions de transport fiables et économiques adaptées à votre calendrier.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&auto=format&fit=crop&q=70',
    bulletsEn: ['Road freight (local and regional)', 'Air freight coordination', 'Sea freight booking and management', 'Port handling and documentation'],
    bulletsFr: ['Fret routier (local et régional)', 'Coordination du fret aérien', 'Réservation et gestion du fret maritime', 'Manutention portuaire et documentation'],
  },
];

const STRIP_H = 72;
const PANEL_H = 400;
const EXPANDED_H = STRIP_H + PANEL_H;

export default function ServicesPage() {
  const { L } = useLanguage();
  const [active, setActive] = useState(0);

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

      {/* ── EXPANDING STRIPS ────────────────────────────────────────────────── */}
      <section className="bg-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-primary font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-1">
                {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
                {L({ en: 'Our Services', fr: 'Nos Services' })}
              </h2>
            </div>
            <span className="text-muted-foreground/40 font-display text-xs uppercase tracking-[0.2em] hidden sm:block">
              {L({ en: '7 Specializations', fr: '7 Spécialisations' })}
            </span>
          </motion.div>

          {/* Desktop: expanding strips */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="hidden lg:block border border-border rounded-sm overflow-hidden divide-y divide-border">
            {services.map((svc, i) => {
              const isActive = active === i;
              return (
                <motion.div
                  key={svc.en}
                  animate={{ height: isActive ? EXPANDED_H : STRIP_H }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden cursor-pointer select-none"
                  onClick={() => setActive(i)}>

                  {/* Full-bleed image panel — sits below the strip bar */}
                  <div className="absolute left-0 right-0 bottom-0" style={{ top: STRIP_H }}>
                    <Image
                      src={svc.image} alt="" fill className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      priority={i === 0} />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/85" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
                  </div>

                  {/* Strip bar — always on top */}
                  <div className={`relative z-10 flex items-center px-6 gap-5 transition-colors duration-300 ${
                    isActive ? 'bg-foreground/75 backdrop-blur-sm' : 'bg-background hover:bg-muted/25'
                  }`} style={{ height: STRIP_H }}>
                    {/* Left accent */}
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}

                    <span className={`font-display font-black text-sm tabular-nums w-8 flex-shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-muted-foreground/25'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span className={`font-display font-bold text-base flex-1 transition-colors duration-300 ${
                      isActive ? 'text-sidebar-foreground' : 'text-foreground'
                    }`}>
                      {L({ en: svc.en, fr: svc.fr })}
                    </span>

                    <motion.span
                      className="text-muted-foreground/45 text-xs font-display hidden xl:block max-w-xs text-right"
                      animate={{ opacity: isActive ? 0 : 1 }}
                      transition={{ duration: 0.18 }}>
                      {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                    </motion.span>

                    <motion.div
                      animate={{ rotate: isActive ? 90 : 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-shrink-0">
                      <ChevronRight className={`h-4 w-4 transition-colors duration-300 ${
                        isActive ? 'text-primary' : 'text-muted-foreground/35'
                      }`} />
                    </motion.div>
                  </div>

                  {/* Content — fades in at bottom of image panel */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-7 flex items-end gap-10"
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                    transition={{ duration: 0.38, delay: isActive ? 0.24 : 0, ease: [0.22, 1, 0.36, 1] }}>

                    {/* Headline + description */}
                    <div className="flex-1 min-w-0">
                      <div className="h-px w-8 bg-primary mb-3" />
                      <h3 className="font-display font-bold text-xl lg:text-2xl text-sidebar-foreground tracking-tight mb-2 leading-tight">
                        {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                      </h3>
                      <p className="text-sidebar-foreground/55 text-sm leading-relaxed max-w-sm">
                        {L({ en: svc.descEn, fr: svc.descFr })}
                      </p>
                    </div>

                    {/* Bullet list */}
                    <div className="flex-shrink-0 grid grid-cols-2 gap-x-8 gap-y-2">
                      {svc.bulletsEn.map((b, bi) => (
                        <span key={bi} className="flex items-start gap-2 text-xs text-sidebar-foreground/50">
                          <span className="mt-1.5 h-px w-3 bg-primary flex-shrink-0" />
                          {L({ en: b, fr: svc.bulletsFr[bi] })}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button asChild size="sm"
                      className="flex-shrink-0 rounded-sm font-display font-semibold text-xs"
                      onClick={e => e.stopPropagation()}>
                      <Link href="/quote">
                        {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                        <ArrowRight className="h-3 w-3 ml-1.5" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile: scroll tabs + card */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto gap-2 pb-3 mb-6 scrollbar-hide">
              {services.map((s, i) => (
                <button key={s.en} onClick={() => setActive(i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-sm border text-sm font-display font-bold transition-all duration-200 ${
                    active === i ? 'bg-foreground border-foreground text-sidebar-foreground' : 'bg-background border-border text-muted-foreground'
                  }`}>
                  <span className={`text-[10px] font-black ${active === i ? 'text-primary' : 'text-muted-foreground/40'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {L({ en: s.en, fr: s.fr })}
                </button>
              ))}
            </div>

            {(() => {
              const svc = services[active];
              return (
                <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className="border border-border rounded-sm overflow-hidden">
                  <div className="relative h-52">
                    <Image src={svc.image} alt={L({ en: svc.en, fr: svc.fr })} fill
                      className="object-cover" sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/70" />
                  </div>
                  <div className="p-6">
                    <div className="h-px w-6 bg-primary mb-3" />
                    <h2 className="font-display font-bold text-xl tracking-tight mb-2">
                      {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {L({ en: svc.descEn, fr: svc.descFr })}
                    </p>
                    <ul className="space-y-2 mb-5">
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
              );
            })()}
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
