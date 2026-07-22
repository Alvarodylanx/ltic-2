'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ship, Globe2, Factory, BarChart3, Handshake, Leaf, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeInUp, fadeInLeft, fadeInRight, stagger, viewportOnce } from '@/components/motion/variants';

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
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=70',
    bulletsEn: ['Supply chain strategy and design', 'Logistics network optimization', 'Procurement consulting', 'Cost reduction analysis', 'Risk management in trade', 'Operational efficiency consulting'],
    bulletsFr: ["Stratégie et conception de la chaîne d'approvisionnement", 'Optimisation du réseau logistique', 'Conseil en approvisionnement', 'Analyse de réduction des coûts', 'Gestion des risques commerciaux', 'Conseil en efficacité opérationnelle'],
  },
  {
    icon: Handshake, en: 'Commercial & Brand Representation', fr: 'Représentation Commerciale & de Marque',
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

  return (
    <>
      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-32 flex flex-col justify-center">
            <motion.div variants={fadeInUp} className="w-10 h-0.5 bg-primary mb-8" />
            <motion.p variants={fadeInUp}
              className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {L({ en: 'Our Services', fr: 'Nos Services' })}
            </motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-display font-extrabold text-section text-foreground leading-none mb-6">
              {L({ en: 'Full-Spectrum Solutions', fr: 'Solutions\nà Spectre Complet' })}
            </motion.h1>
            <motion.p variants={fadeInUp}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
              {L({ en: 'From freight coordination to industrial supply and strategic consulting — operational excellence across every dimension of global commerce.', fr: "De la coordination du fret aux fournitures industrielles et au conseil stratégique — l'excellence opérationnelle dans toutes les dimensions du commerce mondial." })}
            </motion.p>
          </motion.div>

          {/* Service index */}
          <motion.div
            variants={fadeInRight} initial="hidden" animate="show"
            className="hidden lg:flex flex-col justify-center border-l border-border px-16 py-20">
            <p className="text-muted-foreground text-xs uppercase tracking-[0.25em] font-display font-bold mb-6">
              {L({ en: 'Service Index', fr: 'Index des Services' })}
            </p>
            <div className="divide-y divide-border">
              {services.map((svc, i) => (
                <div key={svc.en} className="flex items-center gap-4 py-3 group">
                  <span className="font-display font-bold text-xs text-primary/50 w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-display font-semibold text-foreground/70 group-hover:text-foreground transition-colors">
                    {L({ en: svc.en, fr: svc.fr })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICE SECTIONS ─────────────────────────────────────────────────── */}
      {services.map((svc, index) => (
        <section key={svc.en} className="bg-background border-b border-border relative overflow-hidden">
          <span aria-hidden
            className="absolute right-2 top-0 font-display font-extrabold text-[10rem] leading-none text-foreground/[0.035] select-none pointer-events-none">
            {String(index + 1).padStart(2, '0')}
          </span>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
            {/* Top row: number + service label */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-display font-bold text-primary text-xs tracking-[0.3em]">
                {String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
              </span>
              <div className="flex-1 h-px bg-border" />
              <svc.icon className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
                <p className="text-primary font-display font-bold text-xs uppercase tracking-[0.25em] mb-3">
                  {L({ en: svc.en, fr: svc.fr })}
                </p>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight mb-5">
                  {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-7">
                  {L({ en: svc.descEn, fr: svc.descFr })}
                </p>
                <ul className="space-y-2.5">
                  {svc.bulletsEn.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm leading-relaxed">
                        {L({ en: bullet, fr: svc.bulletsFr[i] })}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
                className="relative h-72 lg:h-[420px] overflow-hidden">
                <Image
                  src={svc.image} alt={L({ en: svc.en, fr: svc.fr })} fill
                  className="object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&auto=format&fit=crop&q=25"
            alt="" fill className="object-cover opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <div className="w-10 h-0.5 bg-primary mb-6" />
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-sidebar-foreground leading-tight tracking-tight">
              {L({ en: 'Ready to Get Started?', fr: 'Prêt à Commencer ?' })}
            </h2>
            <p className="text-sidebar-foreground/60 text-sm mt-4 leading-relaxed">
              {L({ en: 'Discuss your requirements with our team and get a tailored proposal.', fr: 'Discutez de vos besoins avec notre équipe et obtenez une proposition personnalisée.' })}
            </p>
          </motion.div>
          <motion.div
            variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <Button asChild size="lg" className="font-display font-bold text-sm">
              <Link href="/contact">
                {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="font-display font-bold text-sm border-white/20 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground">
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
