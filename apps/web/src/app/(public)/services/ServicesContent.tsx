'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ship, Globe2, Factory, BarChart3, Handshake, Leaf, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeInUp, fadeInLeft, fadeInRight, stagger, viewportOnce } from '@/components/motion/variants';

const services = [
  {
    icon: Ship, en: 'Logistics & Transit', fr: 'Logistique & Transit',
    headlineEn: 'End-to-End Global Freight Solutions', headlineFr: 'Solutions de Fret Mondial de Bout en Bout',
    descEn: 'LTIC SARL manages the complete logistics lifecycle — from freight booking and customs clearance to final-mile delivery across air, sea, and road in 30+ countries.',
    descFr: "LTIC SARL gère le cycle logistique complet — de la réservation de fret et du dédouanement jusqu'à la livraison finale sur les réseaux aériens, maritimes et routiers dans plus de 30 pays.",
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=70',
    bulletsEn: ['International freight coordination (air, sea, road)', 'Cargo handling and warehousing', 'Customs clearance and documentation', 'International transit management', 'Last-mile distribution solutions', 'Real-time shipment tracking'],
    bulletsFr: ['Coordination du fret international (air, mer, route)', 'Manutention et entreposage de marchandises', 'Dédouanement et documentation', 'Gestion du transit international', 'Solutions de distribution dernier kilomètre', 'Suivi en temps réel des expéditions'],
  },
  {
    icon: Globe2, en: 'Import & Export', fr: 'Import & Export',
    headlineEn: 'Seamless International Trade Facilitation', headlineFr: 'Facilitation Fluide du Commerce International',
    descEn: 'We facilitate seamless cross-border transactions with expert compliance management, strategic sourcing, and comprehensive documentation support.',
    descFr: 'Nous facilitons des transactions transfrontalières fluides avec une gestion experte de la conformité, un sourcing stratégique et un support documentaire complet.',
    image: 'https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=800&auto=format&fit=crop&q=70',
    bulletsEn: ['International trade facilitation', 'Customs coordination and compliance', 'Global sourcing and procurement', 'Trade documentation management', 'Regulatory compliance advisory', 'Strategic market sourcing'],
    bulletsFr: ['Facilitation du commerce international', 'Coordination douanière et conformité', 'Sourcing mondial et approvisionnement', 'Gestion de la documentation commerciale', 'Conseil en conformité réglementaire', 'Sourcing stratégique de marché'],
  },
  {
    icon: Factory, en: 'Industrial Supply', fr: 'Fourniture Industrielle',
    headlineEn: 'Premium Industrial Products & Materials', headlineFr: 'Produits & Matériaux Industriels Premium',
    descEn: 'As an authorized distributor for Total, Shell and major OEM brands, we supply certified industrial products directly to your operations anywhere in the world.',
    descFr: 'En tant que distributeur agréé de Total, Shell et grandes marques OEM, nous fournissons des produits industriels certifiés directement à vos opérations partout dans le monde.',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=70',
    bulletsEn: ['Industrial generators (diesel, gas, standby power)', 'Lubricants — Total, Shell and leading brands', 'Oil filters and air filters (OEM-grade)', 'Timber and logs (certified tropical species)', 'Heavy industrial materials and equipment', 'Custom industrial procurement'],
    bulletsFr: ['Générateurs industriels (diesel, gaz, secours)', 'Lubrifiants — Total, Shell et grandes marques', 'Filtres à huile et à air (qualité OEM)', 'Bois et grumes (essences tropicales certifiées)', 'Matériaux industriels lourds et équipements', 'Approvisionnement industriel sur mesure'],
  },
  {
    icon: BarChart3, en: 'Supply Chain Consulting', fr: "Conseil en Chaîne d'Approvisionnement",
    headlineEn: 'Strategic Logistics Optimization', headlineFr: 'Optimisation Logistique Stratégique',
    descEn: 'Our consultants bring deep expertise in logistics network design, procurement strategy, and supply chain risk management for complex market environments.',
    descFr: "Nos consultants apportent une expertise approfondie en conception de réseaux logistiques, stratégie d'approvisionnement et gestion des risques de la chaîne logistique.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=70',
    bulletsEn: ['Supply chain strategy and design', 'Logistics network optimization', 'Procurement consulting', 'Cost reduction analysis', 'Risk management in trade', 'Operational efficiency consulting'],
    bulletsFr: ["Stratégie et conception de la chaîne d'approvisionnement", 'Optimisation du réseau logistique', 'Conseil en approvisionnement', 'Analyse de réduction des coûts', 'Gestion des risques commerciaux', 'Conseil en efficacité opérationnelle'],
  },
  {
    icon: Handshake, en: 'Commercial & Brand Representation', fr: 'Représentation Commerciale & de Marque',
    headlineEn: 'Your Gateway to New Markets', headlineFr: "Votre Porte d'Entrée vers de Nouveaux Marchés",
    descEn: 'We connect international brands with local market opportunities through strategic representation, joint ventures, and distribution partnerships.',
    descFr: 'Nous connectons les marques internationales aux opportunités de marché locales grâce à la représentation stratégique, aux coentreprises et aux partenariats de distribution.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=70',
    bulletsEn: ['Market entry strategy', 'Brand representation in target markets', 'Joint venture facilitation', 'Strategic business partnerships', 'Distribution channel development', 'Trade mission coordination'],
    bulletsFr: ["Stratégie d'entrée sur le marché", 'Représentation de marque sur les marchés cibles', 'Facilitation de coentreprises', 'Partenariats commerciaux stratégiques', 'Développement de canaux de distribution', 'Coordination de missions commerciales'],
  },
  {
    icon: Leaf, en: 'Phytosanitary Treatment & Sanitation', fr: 'Traitement Phytosanitaire & Assainissement',
    headlineEn: 'Compliance-First Treatment Services', headlineFr: 'Services de Traitement Axés sur la Conformité',
    descEn: 'Our certified phytosanitary and sanitation services ensure your timber, agricultural goods, and equipment meet all importing country requirements.',
    descFr: "Nos services certifiés de traitement phytosanitaire et d'assainissement garantissent que votre bois, vos produits agricoles et équipements répondent à toutes les exigences des pays importateurs.",
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=70',
    bulletsEn: ['Phytosanitary treatment for timber and agricultural goods', 'Industrial sanitation services', 'Regulatory compliance documentation', 'Inspection coordination', 'Treatment certification'],
    bulletsFr: ['Traitement phytosanitaire pour bois et produits agricoles', "Services d'assainissement industriel", 'Documentation de conformité réglementaire', 'Coordination des inspections', 'Certification de traitement'],
  },
  {
    icon: Truck, en: 'Transportation', fr: 'Transport',
    headlineEn: 'Reliable Multimodal Transportation', headlineFr: 'Transport Multimodal Fiable',
    descEn: 'From local road freight to international sea and air cargo, LTIC SARL coordinates reliable, cost-effective transportation solutions tailored to your timeline.',
    descFr: 'Du fret routier local au cargo maritime et aérien international, LTIC SARL coordonne des solutions de transport fiables et économiques adaptées à votre calendrier.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=70',
    bulletsEn: ['Road freight (local and regional)', 'Air freight coordination', 'Sea freight booking and management', 'Port handling and documentation', 'Fleet coordination for bulk cargo'],
    bulletsFr: ['Fret routier (local et régional)', 'Coordination du fret aérien', 'Réservation et gestion du fret maritime', 'Manutention portuaire et documentation', 'Coordination de flotte pour fret en vrac'],
  },
];

export default function ServicesPage() {
  const { L } = useLanguage();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-sidebar py-24 sm:py-32 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1600&auto=format&fit=crop&q=50"
            alt="LTIC SARL Services" fill className="object-cover opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar/90 via-sidebar/70 to-sidebar/30" />
        </div>
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-12">
          <motion.p variants={fadeInUp} className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            {L({ en: 'Our Services', fr: 'Nos Services' })}
          </motion.p>
          <motion.h1 variants={fadeInUp}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-sidebar-foreground tracking-tight mb-6 max-w-3xl">
            {L({ en: 'Full-Spectrum Business Solutions', fr: "Solutions d'Affaires à Spectre Complet" })}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-sidebar-foreground/70 text-base sm:text-lg max-w-xl leading-relaxed">
            {L({ en: 'From freight coordination to industrial supply and strategic consulting — delivering operational excellence across every dimension of global commerce.', fr: "De la coordination du fret aux fournitures industrielles et au conseil stratégique — l'excellence opérationnelle dans toutes les dimensions du commerce mondial." })}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Service sections ── */}
      {services.map((svc, index) => {
        const isEven = index % 2 === 0;
        return (
          <section key={svc.en} className={`py-14 sm:py-20 lg:py-28 ${isEven ? 'bg-background' : 'bg-muted/50'} border-b border-border`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                <motion.div variants={isEven ? fadeInLeft : fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
                  className={isEven ? '' : 'lg:order-2'}>
                  <div className="w-12 h-12 rounded-sm bg-foreground flex items-center justify-center mb-6">
                    <svc.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="amber-rule mb-4" />
                  <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
                    {L({ en: svc.en, fr: svc.fr })}
                  </p>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-4">
                    {L({ en: svc.headlineEn, fr: svc.headlineFr })}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm sm:text-base">
                    {L({ en: svc.descEn, fr: svc.descFr })}
                  </p>
                  <ul className="space-y-2.5">
                    {svc.bulletsEn.map((bullet, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{L({ en: bullet, fr: svc.bulletsFr[i] })}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={isEven ? fadeInRight : fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
                  className={`relative h-72 lg:h-[420px] rounded-sm overflow-hidden ${isEven ? '' : 'lg:order-1'}`}>
                  <Image src={svc.image} alt={L({ en: svc.en, fr: svc.fr })} fill
                    className="object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CTA ── */}
      <section className="bg-foreground py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-sidebar-foreground tracking-tight">
              {L({ en: 'Ready to Get Started?', fr: 'Prêt à Commencer ?' })}
            </h2>
            <p className="text-sidebar-foreground/60 text-sm mt-2">
              {L({ en: 'Discuss your requirements and get a tailored proposal.', fr: 'Discutez de vos besoins et obtenez une proposition personnalisée.' })}
            </p>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce} className="flex-shrink-0">
            <Button asChild size="lg" className="font-display font-semibold text-sm rounded-sm">
              <Link href="/contact">
                {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
