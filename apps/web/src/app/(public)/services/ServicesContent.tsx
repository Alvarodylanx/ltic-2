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

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

const contentVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
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

      {/* ── CINEMATIC CAROUSEL ──────────────────────────────────────────────── */}
      <section className="bg-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Number navigation strip */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex border border-border rounded-sm overflow-hidden mb-4">
            {services.map((s, i) => {
              const isActive = active === i;
              return (
                <button
                  key={s.en}
                  onClick={() => goTo(i)}
                  className={`relative flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors duration-200 border-r border-border last:border-r-0 ${
                    isActive ? 'bg-foreground' : 'bg-background hover:bg-muted/25'
                  }`}>
                  {isActive && (
                    <motion.div layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
                  )}
                  <span className={`font-display font-black text-xs tabular-nums transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground/30'
                  }`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-display font-semibold text-[9px] uppercase tracking-wider leading-none text-center px-1 hidden sm:block transition-colors duration-200 ${
                    isActive ? 'text-sidebar-foreground/80' : 'text-muted-foreground/40'
                  }`}>
                    {L({ en: s.en, fr: s.fr }).split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Main carousel panel */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="relative rounded-sm overflow-hidden border border-border"
            style={{ height: 'clamp(480px, 55vw, 600px)' }}>

            {/* Slide — image layer */}
            <AnimatePresence custom={dir} mode="sync">
              <motion.div
                key={`img-${active}`}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0">
                <Image
                  src={svc.image} alt="" fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority={active === 0} />
                {/* Layered gradients: subtle top, heavy bottom-left */}
                <div className="absolute inset-0 bg-gradient-to-b from-foreground/25 via-transparent to-foreground/92" />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/50 via-foreground/10 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Ghost number watermark */}
            <AnimatePresence mode="wait">
              <motion.span
                key={`num-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-5 right-7 font-display font-black leading-none select-none pointer-events-none z-10"
                style={{ fontSize: 'clamp(6rem, 14vw, 11rem)', color: 'rgba(255,255,255,0.04)' }}>
                {String(active + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>

            {/* Content layer */}
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={`content-${active}`}
                custom={dir}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                className="absolute bottom-0 left-0 right-0 z-10 p-7 lg:p-10 flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-10">

                {/* Left: text content */}
                <div className="flex-1 min-w-0">
                  <p className="text-primary font-display font-semibold text-[10px] uppercase tracking-[0.25em] mb-2">
                    {L({ en: svc.en, fr: svc.fr })}
                  </p>
                  <div className="h-px w-10 bg-primary mb-3" />
                  <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-sidebar-foreground tracking-tight leading-tight mb-3">
                    {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                  </h2>
                  <p className="text-sidebar-foreground/55 text-sm leading-relaxed max-w-lg mb-4">
                    {L({ en: svc.descEn, fr: svc.descFr })}
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {svc.bulletsEn.map((b, bi) => (
                      <span key={bi} className="flex items-center gap-2 text-xs text-sidebar-foreground/45">
                        <span className="h-px w-3 bg-primary flex-shrink-0" />
                        {L({ en: b, fr: svc.bulletsFr[bi] })}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: CTA + counter + nav */}
                <div className="flex-shrink-0 flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-3">
                  <Button asChild size="sm" className="rounded-sm font-display font-semibold text-xs">
                    <Link href="/quote">
                      {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                      <ArrowRight className="h-3 w-3 ml-1.5" />
                    </Link>
                  </Button>

                  {/* Counter + arrows */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={prev}
                      aria-label="Previous service"
                      className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-sm text-sidebar-foreground/60 hover:bg-white/10 hover:text-sidebar-foreground transition-all duration-150">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sidebar-foreground/40 font-display text-xs tabular-nums tracking-wider">
                      {String(active + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                    </span>
                    <button
                      onClick={next}
                      aria-label="Next service"
                      className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-sm text-sidebar-foreground/60 hover:bg-white/10 hover:text-sidebar-foreground transition-all duration-150">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress ticks — thin bar at very top */}
            <div className="absolute top-0 left-0 right-0 z-20 h-[2px] flex">
              {services.map((_, i) => (
                <div key={i} className="flex-1 relative">
                  <div className="absolute inset-0 bg-white/8" />
                  {i === active && (
                    <motion.div
                      layoutId="progress-fill"
                      className="absolute inset-0 bg-primary"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

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
