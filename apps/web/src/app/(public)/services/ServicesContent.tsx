'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, Globe2, Factory, BarChart3, Handshake, Leaf, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
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
    bulletsEn: ['International freight coordination (air, sea, road)', 'Cargo handling and warehousing', 'Customs clearance and documentation', 'Real-time shipment tracking'],
    bulletsFr: ['Coordination du fret international (air, mer, route)', 'Manutention et entreposage de marchandises', 'Dédouanement et documentation', 'Suivi en temps réel des expéditions'],
  },
  {
    icon: Globe2, en: 'Import & Export', fr: 'Import & Export',
    headlineEn: 'Seamless International Trade Facilitation', headlineFr: 'Facilitation Fluide du Commerce International',
    descEn: 'We facilitate seamless cross-border transactions with expert compliance management, strategic sourcing, and comprehensive documentation support.',
    descFr: 'Nous facilitons des transactions transfrontalières fluides avec une gestion experte de la conformité, un sourcing stratégique et un support documentaire complet.',
    image: 'https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['International trade facilitation', 'Customs coordination and compliance', 'Global sourcing and procurement', 'Trade documentation management'],
    bulletsFr: ['Facilitation du commerce international', 'Coordination douanière et conformité', 'Sourcing mondial et approvisionnement', 'Gestion de la documentation commerciale'],
  },
  {
    icon: Factory, en: 'Industrial Supply', fr: 'Fourniture Industrielle',
    headlineEn: 'Premium Industrial Products & Materials', headlineFr: 'Produits & Matériaux Industriels Premium',
    descEn: 'As an authorized distributor for Total, Shell and major OEM brands, we supply certified industrial products directly to your operations anywhere in the world.',
    descFr: 'En tant que distributeur agréé de Total, Shell et grandes marques OEM, nous fournissons des produits industriels certifiés directement à vos opérations partout dans le monde.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Industrial generators (diesel, gas, standby power)', 'Lubricants — Total, Shell and leading brands', 'Oil filters and air filters (OEM-grade)', 'Heavy industrial materials and equipment'],
    bulletsFr: ['Générateurs industriels (diesel, gaz, secours)', 'Lubrifiants — Total, Shell et grandes marques', 'Filtres à huile et à air (qualité OEM)', 'Matériaux industriels lourds et équipements'],
  },
  {
    icon: BarChart3, en: 'Supply Chain Consulting', fr: "Conseil en Chaîne d'Approvisionnement",
    headlineEn: 'Strategic Logistics Optimization', headlineFr: 'Optimisation Logistique Stratégique',
    descEn: 'Our consultants bring deep expertise in logistics network design, procurement strategy, and supply chain risk management for complex market environments.',
    descFr: "Nos consultants apportent une expertise approfondie en conception de réseaux logistiques, stratégie d'approvisionnement et gestion des risques de la chaîne logistique.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Supply chain strategy and design', 'Logistics network optimization', 'Procurement consulting', 'Risk management in trade'],
    bulletsFr: ["Stratégie et conception de la chaîne d'approvisionnement", 'Optimisation du réseau logistique', 'Conseil en approvisionnement', 'Gestion des risques commerciaux'],
  },
  {
    icon: Handshake, en: 'Commercial Representation', fr: 'Représentation Commerciale',
    headlineEn: 'Your Gateway to New Markets', headlineFr: "Votre Porte d'Entrée vers de Nouveaux Marchés",
    descEn: 'We connect international brands with local market opportunities through strategic representation, joint ventures, and distribution partnerships.',
    descFr: 'Nous connectons les marques internationales aux opportunités de marché locales grâce à la représentation stratégique, aux coentreprises et aux partenariats de distribution.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Market entry strategy', 'Brand representation in target markets', 'Joint venture facilitation', 'Distribution channel development'],
    bulletsFr: ["Stratégie d'entrée sur le marché", 'Représentation de marque sur les marchés cibles', 'Facilitation de coentreprises', 'Développement de canaux de distribution'],
  },
  {
    icon: Leaf, en: 'Phytosanitary Treatment', fr: 'Traitement Phytosanitaire',
    headlineEn: 'Compliance-First Treatment Services', headlineFr: 'Services de Traitement Axés sur la Conformité',
    descEn: 'Our certified phytosanitary and sanitation services ensure your timber, agricultural goods, and equipment meet all importing country requirements.',
    descFr: "Nos services certifiés de traitement phytosanitaire garantissent que votre bois, vos produits agricoles et équipements répondent à toutes les exigences des pays importateurs.",
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Phytosanitary treatment for timber', 'Industrial sanitation services', 'Regulatory compliance documentation', 'Treatment certification'],
    bulletsFr: ['Traitement phytosanitaire pour bois', "Services d'assainissement industriel", 'Documentation de conformité réglementaire', 'Certification de traitement'],
  },
  {
    icon: Truck, en: 'Transportation', fr: 'Transport',
    headlineEn: 'Reliable Multimodal Transportation', headlineFr: 'Transport Multimodal Fiable',
    descEn: 'From local road freight to international sea and air cargo, LTIC SARL coordinates reliable, cost-effective transportation solutions tailored to your timeline.',
    descFr: 'Du fret routier local au cargo maritime et aérien international, LTIC SARL coordonne des solutions de transport fiables et économiques adaptées à votre calendrier.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Road freight (local and regional)', 'Air freight coordination', 'Sea freight booking and management', 'Port handling and documentation'],
    bulletsFr: ['Fret routier (local et régional)', 'Coordination du fret aérien', 'Réservation et gestion du fret maritime', 'Manutention portuaire et documentation'],
  },
];

const cardVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 120 : -120,
    opacity: 0,
    rotate: dir > 0 ? 4 : -4,
    scale: 0.94,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -120 : 120,
    opacity: 0,
    rotate: dir > 0 ? -4 : 4,
    scale: 0.94,
  }),
};

export default function ServicesPage() {
  const { L } = useLanguage();
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const goTo = (i: number) => {
    setDir(i >= active ? 1 : -1);
    setActive(i);
  };
  const prev = () => goTo(active > 0 ? active - 1 : services.length - 1);
  const next = () => goTo(active < services.length - 1 ? active + 1 : 0);

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

      {/* ── STACKED DEAL CARDS ──────────────────────────────────────────────── */}
      <section className="bg-background py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header + number nav */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex items-center justify-between mb-10">
            <div>
              <p className="text-primary font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-1">
                {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
              </p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
                {L({ en: 'Our Services', fr: 'Nos Services' })}
              </h2>
            </div>

            {/* Dot nav */}
            <div className="flex items-center gap-2">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Service ${i + 1}`}
                  className={`transition-all duration-200 rounded-full ${
                    active === i
                      ? 'w-6 h-2 bg-primary'
                      : 'w-2 h-2 bg-border hover:bg-muted-foreground/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Desktop: card stack */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="hidden lg:block">

            {/* Stack wrapper — extra bottom padding reveals the peeking cards */}
            <div className="relative" style={{ paddingBottom: 28 }}>

              {/* Decorative card backs — peeking behind active card */}
              {[2, 1].map(offset => (
                <div
                  key={offset}
                  className="absolute left-0 right-0 bottom-0 border border-border rounded-sm bg-muted/20"
                  style={{
                    height: 'calc(100% - 28px)',
                    transform: `translateY(${offset * 12}px) scale(${1 - offset * 0.018})`,
                    transformOrigin: 'bottom center',
                    zIndex: 10 - offset,
                    opacity: 1 - offset * 0.35,
                  }}
                />
              ))}

              {/* Active card */}
              <div className="relative z-20" style={{ minHeight: 540 }}>
                <AnimatePresence custom={dir} mode="wait">
                  <motion.div
                    key={active}
                    custom={dir}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    className="border border-border rounded-sm overflow-hidden bg-background"
                    style={{ minHeight: 540 }}>

                    {/* Card layout: image left (40%) + content right (60%) */}
                    <div className="grid grid-cols-[2fr_3fr] h-full min-h-[540px]">

                      {/* Image side */}
                      <div className="relative overflow-hidden">
                        <Image
                          src={svc.image} alt="" fill
                          className="object-cover"
                          sizes="40vw"
                          priority={active === 0} />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
                        <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/40" />
                        {/* Ghost number on image */}
                        <span className="absolute bottom-5 left-5 font-display font-black leading-none select-none pointer-events-none"
                          style={{ fontSize: 'clamp(5rem, 10vw, 8rem)', color: 'rgba(255,255,255,0.07)' }}>
                          {String(active + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Content side */}
                      <div className="flex flex-col justify-between p-8 lg:p-10 bg-background">

                        {/* Top: label + headline */}
                        <div>
                          <p className="text-primary font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-3">
                            {L({ en: svc.en, fr: svc.fr })}
                          </p>
                          <div className="h-px w-8 bg-primary mb-4" />
                          <h3 className="font-display font-bold text-2xl lg:text-3xl tracking-tight leading-tight mb-4">
                            {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-prose">
                            {L({ en: svc.descEn, fr: svc.descFr })}
                          </p>
                          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                            {svc.bulletsEn.map((b, bi) => (
                              <li key={bi} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="mt-2 h-px w-3 bg-primary flex-shrink-0" />
                                {L({ en: b, fr: svc.bulletsFr[bi] })}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Bottom: CTA + navigation */}
                        <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
                          <Button asChild size="sm" className="rounded-sm font-display font-semibold text-sm">
                            <Link href="/quote">
                              {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                              <ArrowRight className="h-3.5 w-3.5 ml-2" />
                            </Link>
                          </Button>

                          <div className="flex items-center gap-3">
                            <button onClick={prev} aria-label="Previous"
                              className="w-8 h-8 flex items-center justify-center border border-border rounded-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-150">
                              <ArrowLeft className="h-3.5 w-3.5" />
                            </button>
                            <span className="font-display font-black text-xs tabular-nums text-muted-foreground/50 tracking-wider">
                              {String(active + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                            </span>
                            <button onClick={next} aria-label="Next"
                              className="w-8 h-8 flex items-center justify-center border border-border rounded-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-150">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Mobile: accordion */}
          <div className="lg:hidden divide-y divide-border/40 border-t border-border/40">
            {services.map((s, i) => {
              const isOpen = active === i;
              return (
                <div key={s.en}>
                  <button onClick={() => setActive(i)}
                    className="w-full flex items-center gap-4 py-4 text-left">
                    <span className={`font-display font-black text-xs tabular-nums flex-shrink-0 transition-colors ${isOpen ? 'text-primary' : 'text-muted-foreground/30'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-display font-bold text-base flex-1 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-40'}`}>
                      {L({ en: s.en, fr: s.fr })}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.28 }}>
                      <ArrowRight className={`h-4 w-4 flex-shrink-0 transition-colors ${isOpen ? 'text-primary' : 'text-muted-foreground/30'}`} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden">
                        <div className="pb-5">
                          <div className="relative h-44 rounded-sm overflow-hidden mb-4">
                            <Image src={s.image} alt={L({ en: s.en, fr: s.fr })} fill className="object-cover" sizes="100vw" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
                          </div>
                          <div className="h-px w-6 bg-primary mb-2" />
                          <h3 className="font-display font-bold text-base tracking-tight mb-2">{L({ en: s.headlineEn, fr: s.headlineFr })}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-3">{L({ en: s.descEn, fr: s.descFr })}</p>
                          <ul className="space-y-1.5 mb-4">
                            {s.bulletsEn.map((b, bi) => (
                              <li key={bi} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="mt-2 h-px w-3 bg-primary flex-shrink-0" />
                                {L({ en: b, fr: s.bulletsFr[bi] })}
                              </li>
                            ))}
                          </ul>
                          <Button asChild size="sm" className="w-full rounded-sm font-display font-semibold">
                            <Link href="/quote">
                              {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                              <ArrowRight className="h-3.5 w-3.5 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
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
