'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2, Target, Globe2, ShieldCheck, Lightbulb,
  TrendingUp, ArrowRight, ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import {
  fadeInUp, fadeInLeft, fadeInRight, scaleIn,
  stagger, staggerFast, viewportOnce,
} from '@/components/motion/variants';

const statDefs = [
  { key: 'stat_ports',     fallback: '5+',   en: 'African Ports',   fr: 'Ports Africains' },
  { key: 'stat_clients',   fallback: '100+', en: 'Active Clients',  fr: 'Clients Actifs' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years',           fr: 'Années' },
  { key: 'stat_products',  fallback: '20+',  en: 'Product Lines',   fr: 'Gammes de Produits' },
];

const mvvItems = [
  {
    icon: Target,
    number: '01',
    title: { en: 'Mission', fr: 'Mission' },
    desc: { en: 'To deliver reliable maritime supply, chemical manufacturing, lubricant distribution, land transport and general commercial services that empower businesses across Cameroon and the Central African region.', fr: "Fournir des services fiables d'avitaillement maritime, de fabrication chimique, de distribution de lubrifiants, de transport terrestre et de commerce général pour les entreprises au Cameroun et en Afrique Centrale." },
    image: '/images/banner-services.jpg',
  },
  {
    icon: Globe2,
    number: '02',
    title: { en: 'Vision', fr: 'Vision' },
    desc: { en: 'To become the leading ship supplier, chemical manufacturer, and industrial commerce company in Cameroon — expanding our reach progressively across Central and West Africa.', fr: "Devenir le principal fournisseur de navires, fabricant de produits chimiques et société de commerce industriel au Cameroun — en étendant progressivement notre présence en Afrique Centrale et de l'Ouest." },
    image: '/images/about-milestone-trade.jpg',
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: { en: 'Values', fr: 'Valeurs' },
    desc: { en: 'Professionalism, Reliability, Integrity, Customer Satisfaction, Operational Excellence and Innovation — the principles that guide every decision we make at LTIC SARL.', fr: 'Professionnalisme, Fiabilité, Intégrité, Satisfaction Client, Excellence Opérationnelle et Innovation — les principes qui guident chacune de nos décisions chez LTIC SARL.' },
    image: '/images/about-milestone-handshake.jpg',
  },
];

const values = [
  { icon: ShieldCheck,  en: 'Reliability',           fr: 'Fiabilité',                descEn: 'Committed to delivering on every promise — on time, in full, and with complete transparency.',                            descFr: 'Engagés à tenir chaque promesse — à temps, intégralement et avec une totale transparence.' },
  { icon: Target,       en: 'Professionalism',        fr: 'Professionnalisme',         descEn: 'Maintaining the highest standards of expertise, conduct, and accountability in every business interaction.',               descFr: "Maintenir les plus hauts standards d'expertise, de conduite et de responsabilité dans chaque interaction." },
  { icon: CheckCircle2, en: 'Integrity',              fr: 'Intégrité',                 descEn: 'Operating with honesty and ethical standards across all client, partner, and supplier relationships.',                     descFr: 'Agir avec honnêteté et rigueur éthique dans toutes les relations commerciales.' },
  { icon: Lightbulb,    en: 'Innovation',             fr: 'Innovation',                descEn: 'Continuously adopting modern technologies and methodologies to deliver smarter logistics solutions.',                       descFr: 'Adopter continuellement les technologies modernes pour des solutions logistiques plus performantes.' },
  { icon: TrendingUp,   en: 'Operational Excellence', fr: 'Excellence Opérationnelle', descEn: 'Relentless pursuit of efficiency, quality, and continuous improvement across all our operations.',                        descFr: "Recherche constante d'efficacité, de qualité et d'amélioration continue dans toutes nos opérations." },
  { icon: Globe2,       en: 'Global Collaboration',   fr: 'Collaboration Mondiale',    descEn: 'Building strong international partnerships to connect businesses with global markets and opportunities.',                   descFr: 'Construire des partenariats internationaux solides pour connecter les entreprises aux marchés mondiaux.' },
];

export default function AboutPage() {
  const { L } = useLanguage();
  const [activeMVV, setActiveMVV] = useState<number | null>(null);

  const { data: siteSettings } = useQuery<Record<string, string>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
    staleTime: 5 * 60 * 1000,
  });
  const stats = statDefs.map((s) => ({
    value: siteSettings?.[s.key] || s.fallback,
    en: s.en,
    fr: s.fr,
  }));

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[36vh] min-h-[260px] overflow-hidden bg-sidebar flex items-center">
        <Image src="/images/banner-about.jpg" alt="" fill className="object-cover object-center opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/95 via-sidebar/65 to-sidebar/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-sidebar/90 via-sidebar/25 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2.5 mb-3">
            <span className="w-6 h-px bg-primary flex-shrink-0" />
            <span className="text-primary font-semibold text-[11px] uppercase tracking-[0.3em]">
              {L({ en: 'About LTIC SARL', fr: 'À Propos de LTIC SARL' })}
            </span>
          </motion.div>
          <h1 className="font-display font-extrabold text-section text-sidebar-foreground leading-[0.88] tracking-[-0.02em] mb-3">
            {L({ en: 'Who We Are', fr: 'Qui Nous Sommes' }).split(' ').map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.18em] last:mr-0">
                <motion.span
                  className="inline-block"
                  initial={{ y: '112%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1], delay: 0.1 + wi * 0.08 }}>
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.48 }}
            className="font-sans text-sidebar-foreground/90 text-[15px] sm:text-[16px] leading-relaxed max-w-xl mx-auto">
            {L({ en: 'A Cameroonian company based in Douala — general ship supplier, chemical manufacturer, lubricant distributor, and commercial trader since 2019.', fr: 'Une entreprise camerounaise basée à Douala — fournisseur général de navires, fabricant de produits chimiques, distributeur de lubrifiants et négociant depuis 2019.' })}
          </motion.p>
        </div>

      </section>

      {/* ── STORY ───────────────────────────────────────────────────────────── */}
      <section className="bg-background py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                {L({ en: 'Our Story', fr: 'Notre Histoire' })}
              </p>
              <h2 className="font-bold text-3xl sm:text-4xl tracking-tight mb-5">
                {L({ en: 'Built on Maritime Expertise & Local Manufacturing', fr: 'Fondé sur l\'Expertise Maritime et la Fabrication Locale' })}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                {L({ en: "LTIC SARL — Logistics and Transit International Company — was founded in Douala, Cameroon in 2019 by John Smith and is led by General Director Vincent de Paul. The company operates as a general ship supplier, maritime logistics provider, and manufacturer of home care, personal care, and sanitation products under the ECOKLIN brand.", fr: "LTIC SARL — Logistics and Transit International Company — a été fondée à Douala, Cameroun en 2019 par John Smith et est dirigée par le Directeur Général Vincent de Paul. La société opère comme fournisseur général de navires, prestataire logistique maritime et fabricant de produits ménagers, soins personnels et assainissement sous la marque ECOKLIN." })}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed text-sm sm:text-base">
                {L({ en: 'From our headquarters in Akwa, Douala and our PK13 manufacturing plant, we serve the maritime, industrial, and commercial sectors across Cameroon and the Central African region — with plans to expand further across the continent.', fr: "Depuis notre siège social à Akwa, Douala et notre usine de fabrication à PK13, nous servons les secteurs maritime, industriel et commercial au Cameroun et en Afrique Centrale — avec des projets d'expansion sur le continent." })}
              </p>
              <ul className="space-y-3">
                {[
                  { en: 'General ship chandling and offshore supply in the Gulf of Guinea', fr: "Avitaillement général des navires et fournitures offshore dans le Golfe de Guinée" },
                  { en: 'ECOKLIN chemical manufacturing plant at PK13, Douala', fr: "Usine de fabrication ECOKLIN à PK13, Douala" },
                  { en: 'Authorized distributor of Total and Shell lubricants', fr: "Distributeur agréé de lubrifiants Total et Shell" },
                  { en: 'Commercial trade: timber, food products, generators, engines & spare parts', fr: "Commerce : bois, produits alimentaires, groupes électrogènes, moteurs et pièces détachées" },
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeInLeft} initial="hidden" whileInView="show"
                    viewport={viewportOnce} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{L(item)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="relative h-80 lg:h-full min-h-[420px] rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about-operations.jpg"
                alt="LTIC SARL team on operations" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ──────────────────────────────────────────────────────── */}
      <section className="bg-muted/20 border-y border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="text-center mb-10">
            <p className="text-primary font-bold text-[11px] uppercase tracking-[0.32em] mb-2 flex items-center justify-center gap-2.5">
              <span className="w-5 h-px bg-primary" />
              {L({ en: 'Our Leadership', fr: 'Notre Direction' })}
              <span className="w-5 h-px bg-primary" />
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
              {L({ en: 'The People Behind LTIC SARL', fr: 'Les Personnes Derrière LTIC SARL' })}
            </h2>
          </motion.div>

          <motion.div variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              {
                name: 'John Smith',
                role: { en: 'Founder & President', fr: 'Fondateur & Président' },
                detail: { en: 'Founded LTIC SARL in Douala, Cameroon in 2019.', fr: 'A fondé LTIC SARL à Douala, Cameroun en 2019.' },
                initials: 'JS',
              },
              {
                name: 'Vincent de Paul',
                role: { en: 'General Director (DG)', fr: 'Directeur Général (DG)' },
                detail: { en: 'Leads the day-to-day operations of LTIC SARL Group.', fr: 'Dirige les opérations quotidiennes du Groupe LTIC SARL.' },
                initials: 'VP',
              },
            ].map((person) => (
              <motion.div key={person.name} variants={scaleIn}
                className="flex flex-col items-center gap-4 bg-card border border-border rounded-2xl p-6 sm:p-8
                           hover:border-primary/40 hover:shadow-md transition-all duration-200 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5
                                border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-black text-primary">{person.initials}</span>
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground leading-tight">{person.name}</p>
                  <span className="inline-block bg-primary/10 text-primary text-[11px] font-semibold
                                   rounded-full px-3 py-1 mt-1.5 mb-2">
                    {L(person.role)}
                  </span>
                  <p className="text-muted-foreground text-sm">{L(person.detail)}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FIELD OPERATIONS ────────────────────────────────────────────────── */}
      <section className="bg-muted/30 border-y border-border py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text — first in DOM (mobile reads headline before photo) */}
            <motion.div
              variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="lg:order-2"
            >
              <p className="text-primary font-semibold text-xs uppercase tracking-[0.25em] mb-3">
                {L({ en: 'On the Ground', fr: 'Sur le Terrain' })}
              </p>
              <h2 className="font-bold text-3xl sm:text-4xl tracking-tight mb-5 leading-tight whitespace-pre-line">
                {L({ en: 'Where Your Cargo\nGoes, We Go Too.', fr: 'Là Où Va Votre\nCargaison, Nous Aussi.' })}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                {L({ en: 'LTIC SARL operates beyond the desk. Our teams are physically present on offshore supply vessels, at port facilities, and at customs checkpoints — ensuring every shipment is handled with full accountability.', fr: "LTIC SARL opère au-delà du bureau. Nos équipes sont physiquement présentes sur les navires de ravitaillement offshore, dans les installations portuaires et aux postes douaniers." })}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed text-sm sm:text-base">
                {L({ en: 'From the Port of Douala to offshore hubs in the Gulf of Guinea, our on-ground presence means real oversight at every stage — not just paperwork.', fr: "Du Port de Douala aux hubs offshore du Golfe de Guinée, notre présence terrain garantit une supervision réelle à chaque étape — pas seulement de la documentation." })}
              </p>
              <ul className="space-y-3">
                {[
                  { en: 'Direct coordination with vessel crews and port authorities', fr: 'Coordination directe avec équipages et autorités portuaires' },
                  { en: 'On-site cargo inspection and verification at every port', fr: 'Inspection et vérification de cargaison sur site à chaque port' },
                  { en: 'Offshore supply chain management across the Gulf of Guinea', fr: "Gestion de la chaîne offshore dans le Golfe de Guinée" },
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeInRight} initial="hidden" whileInView="show"
                    viewport={viewportOnce} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{L(item)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Photos — staggered portrait duo */}
            <motion.div
              variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="lg:order-1 relative pb-6"
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Left: team on deck — full height */}
                <div className="relative h-[300px] sm:h-[420px] md:h-auto md:aspect-[9/16] lg:aspect-auto lg:h-[480px] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/about-team-maritime.jpg"
                    alt="LTIC SARL team on offshore vessel"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 45vw, 22vw"
                  />
                  {/* subtle gradient at bottom for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
                {/* Right: TAMPEN vessel — offset down for stagger effect */}
                <div className="relative h-[300px] sm:h-[420px] md:h-auto md:aspect-[35/54] lg:aspect-auto lg:h-[480px] rounded-2xl overflow-hidden shadow-xl mt-8 sm:mt-12">
                  <Image
                    src="/images/about-vessel-tampen.jpg"
                    alt="LTIC SARL offshore supply vessel TAMPEN"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 45vw, 22vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating badge — anchored bottom-centre of photo block */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2
                              bg-primary text-primary-foreground rounded-full
                              px-5 py-2.5 shadow-lg flex items-center gap-2.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/70 animate-pulse flex-shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  {L({ en: 'Offshore Operations · Est. 2019', fr: 'Opérations Offshore · Dep. 2019' })}
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── STATS BAND ──────────────────────────────────────────────────────── */}
      <section className="bg-foreground py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn} className="flex flex-col items-center">
                <span className="font-bold text-2xl sm:text-4xl lg:text-5xl text-primary leading-none mb-1.5 sm:mb-2">
                  {stat.value}
                </span>
                <span className="text-sidebar-foreground/60 text-[10px] sm:text-xs uppercase tracking-widest font-medium">
                  {L(stat)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── OUR CLIENTS ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-12 sm:py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="text-center mb-10">
            <p className="text-primary font-bold text-[11px] uppercase tracking-[0.32em] mb-2 flex items-center justify-center gap-2.5">
              <span className="w-5 h-px bg-primary" />
              {L({ en: 'Who We Serve', fr: 'Qui Nous Servons' })}
              <span className="w-5 h-px bg-primary" />
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
              {L({ en: 'Trusted by Industry Leaders', fr: 'La Confiance des Leaders Industriels' })}
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto leading-relaxed">
              {L({ en: 'From global shipping giants to regional industrial companies — our clients span the maritime, logistics, and industrial sectors.', fr: 'Des géants mondiaux du transport maritime aux entreprises industrielles régionales — nos clients couvrent les secteurs maritime, logistique et industriel.' })}
            </p>
          </motion.div>

          <motion.div variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { name: 'Bourbon Offshore Marine', sector: { en: 'Marine Services',  fr: 'Services Maritimes' },  domain: '',            logo: '/images/bourbon-logo.png' },
              { name: 'Inyanga Maritime',         sector: { en: 'Maritime',          fr: 'Maritime' },            domain: '',            logo: '/images/inyanga-logo.png' },
              { name: 'Alpha Marine',             sector: { en: 'Maritime',          fr: 'Maritime' },            domain: 'alphamarinegroup.net', logo: '' },
              { name: 'Bolloré Africa',           sector: { en: 'Logistics',         fr: 'Logistique' },          domain: 'bollore.com', logo: '' },
              { name: 'Maersk',                   sector: { en: 'Shipping',          fr: 'Transport Maritime' },  domain: 'maersk.com',  logo: '' },
              { name: 'MSC',                      sector: { en: 'Shipping',          fr: 'Transport Maritime' },  domain: 'msc.com',     logo: '' },
              { name: 'PASTA S.A',                sector: { en: 'Industry',          fr: 'Industrie' },           domain: '',            logo: '/images/pasta-logo.png' },
              { name: 'NEO INDUSTRY S.A',         sector: { en: 'Industry',          fr: 'Industrie' },           domain: '',            logo: '/images/neo-industry-logo.png' },
              { name: 'MOVIS S.A',                sector: { en: 'Logistics',         fr: 'Logistique' },          domain: '',            logo: '/images/movis-logo.svg' },
              { name: 'SOLENA SARL',              sector: { en: 'Industry',          fr: 'Industrie' },           domain: 'solena-cm.net', logo: '' },
            ].map((client) => (
              <motion.div key={client.name} variants={scaleIn}
                className="flex flex-col items-center gap-3 bg-card border border-border rounded-2xl p-4 sm:p-5
                           hover:border-primary/40 hover:shadow-md transition-all duration-200 group text-center">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {client.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={client.logo} alt={client.name} width={40} height={40} className="w-10 h-10 object-contain p-0.5" />
                  ) : client.domain ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${client.domain}&sz=128`}
                      alt={client.name}
                      width={28} height={28}
                      className="w-7 h-7 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (fb) fb.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <span className={`text-[12px] font-black text-primary leading-none tracking-wide ${client.logo || client.domain ? 'hidden' : ''}`}>
                    {client.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm leading-snug text-foreground/75 group-hover:text-primary transition-colors">
                    {client.name}
                  </p>
                  <span className="inline-block bg-primary/10 text-primary text-[10px] font-semibold rounded-full px-2 py-0.5 mt-1 w-fit mx-auto">
                    {L(client.sector)}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MISSION · VISION · VALUES — Style 01: Oblique Panels ───────────── */}
      <section className="bg-sidebar py-3 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex items-center gap-6 mb-10">
            <div>
              <p className="text-primary font-semibold text-xs uppercase tracking-[0.25em] mb-2">
                {L({ en: 'Our Foundation', fr: 'Notre Fondation' })}
              </p>
              <h2 className="font-bold text-3xl sm:text-4xl tracking-tight text-sidebar-foreground">
                {L({ en: 'Mission, Vision & Values', fr: 'Mission, Vision & Valeurs' })}
              </h2>
            </div>
            <div className="hidden md:block h-px flex-1 bg-white/10" />
          </motion.div>

          {/* ── DESKTOP: Oblique expanding panels ── */}
          <motion.div
            variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="hidden md:flex h-[460px] overflow-hidden rounded-2xl border border-white/10">
            {mvvItems.map((item, i) => {
              const isActive = activeMVV === i;
              const isFirst = i === 0;
              return (
                <motion.div
                  key={item.title.en}
                  className="relative overflow-hidden flex-shrink-0 cursor-default"
                  style={{
                    transform: 'skewX(-5deg)',
                    transformOrigin: 'top left',
                    marginLeft: isFirst ? 0 : '-36px',
                    zIndex: isActive ? 10 : mvvItems.length - i,
                  }}
                  animate={{ flexGrow: activeMVV === null ? 1 : isActive ? 2.6 : 0.65 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setActiveMVV(i)}
                  onMouseLeave={() => setActiveMVV(null)}>

                  {/* Background image + overlay — counter-skewed */}
                  <div
                    className="absolute inset-0"
                    style={{ transform: 'skewX(5deg) scaleX(1.12)', transformOrigin: 'top left' }}>
                    <Image src={item.image} alt="" fill className="object-cover" sizes="60vw" />
                    <motion.div
                      className="absolute inset-0 bg-sidebar"
                      animate={{ opacity: isActive ? 0.55 : 0.82 }}
                      transition={{ duration: 0.5 }}
                    />
                    {/* Gradient: dark at bottom for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/40 to-transparent" />
                  </div>

                  {/* Content — counter-skewed */}
                  <div
                    className="relative h-full flex flex-col justify-end pb-9 pl-10 pr-6"
                    style={{ transform: 'skewX(5deg)', transformOrigin: 'top left' }}>

                    {/* Ghost number — top right */}
                    <span
                      className="absolute top-6 right-10 font-black leading-none select-none pointer-events-none"
                      style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', color: 'hsl(var(--sidebar-foreground) / 0.05)' }}>
                      {item.number}
                    </span>

                    {/* Accent line — grows on hover */}
                    <motion.div
                      className="bg-primary origin-left mb-4"
                      style={{ height: '2px' }}
                      animate={{ scaleX: isActive ? 1 : 0.4, width: '3rem' }}
                      transition={{ duration: 0.45 }}
                    />

                    {/* Title */}
                    <h3 className="font-extrabold text-sidebar-foreground leading-none tracking-tight mb-0"
                      style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}>
                      {L(item.title)}
                    </h3>

                    {/* Description — fades in when panel expands */}
                    <motion.p
                      className="text-sidebar-foreground/60 text-sm leading-relaxed mt-3 max-w-[22ch]"
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                      transition={{ duration: 0.3, delay: isActive ? 0.18 : 0 }}>
                      {L(item.desc)}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── MOBILE: stacked panels, always expanded ── */}
          <div className="md:hidden flex flex-col gap-3">
            {mvvItems.map((item, i) => (
              <div key={item.title.en} className="relative overflow-hidden rounded-2xl h-56">
                <Image src={item.image} alt="" fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-sidebar/75" />
                <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="h-px w-8 bg-primary mb-3" />
                  <h3 className="font-extrabold text-sidebar-foreground text-2xl tracking-tight mb-2">
                    {L(item.title)}
                  </h3>
                  <p className="text-sidebar-foreground/60 text-xs leading-relaxed">
                    {L(item.desc)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CORE VALUES — typographic index ─────────────────────────────────── */}
      <section className="bg-background border-t border-border py-3 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
                <span className="w-5 h-px bg-primary flex-shrink-0" />
                {L({ en: 'What Drives Us', fr: 'Ce Qui Nous Anime' })}
              </motion.p>
              <h2 className="font-extrabold text-section text-foreground [text-wrap:balance] max-w-lg">
                {[
                  L({ en: 'Core', fr: 'Valeurs' }),
                  L({ en: 'Values.', fr: 'Fondamentales.' }),
                ].map((line, li) => (
                  <span key={li} className="block overflow-hidden leading-[1.08]">
                    <motion.span
                      className="block"
                      initial={{ y: '108%' }}
                      whileInView={{ y: 0 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + li * 0.12 }}>
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
            </div>
          </div>

          {/* Value rows */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.065, delayChildren: 0.15 } } }}
          >
            {values.map(({ en, fr, descEn, descFr }, i) => (
              <motion.div
                key={en}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 95, damping: 22 } },
                }}
                className="group relative border-b border-border first:border-t"
              >
                <div className="relative flex items-start lg:items-center gap-5 lg:gap-10 py-3 lg:py-4 pl-5">
                  {/* Left accent bar */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary rounded-full
                               scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-300 ease-out"
                  />

                  {/* Index */}
                  <span className="w-7 flex-shrink-0 pt-0.5 lg:pt-0 text-[11px] font-bold tabular-nums tracking-[0.18em]
                                   text-foreground/25 group-hover:text-primary transition-colors duration-200">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Name + description */}
                  <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:gap-10">
                    <h3 className="font-extrabold text-2xl lg:text-[1.75rem] text-foreground leading-tight
                                   mb-1.5 lg:mb-0 lg:w-64 xl:w-72 flex-shrink-0
                                   group-hover:text-primary transition-colors duration-200">
                      {L({ en, fr })}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {L({ en: descEn, fr: descFr })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="bg-foreground py-3 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <h2 className="font-bold text-2xl sm:text-3xl text-sidebar-foreground tracking-tight">
              {L({ en: 'Ready to Partner with LTIC SARL?', fr: 'Prêt à Collaborer avec LTIC SARL ?' })}
            </h2>
            <p className="text-sidebar-foreground/60 text-sm mt-2">
              {L({ en: 'From ship supply to chemical manufacturing and commercial trade — one partner for all your needs.', fr: "De l'avitaillement maritime à la fabrication chimique et au commerce — un seul partenaire pour tous vos besoins." })}
            </p>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex flex-shrink-0 gap-3">
            <Button asChild size="lg" className="font-semibold text-sm">
              <Link href="/contact">
                {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="font-semibold text-sm bg-transparent border-sidebar-foreground/30 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground hover:border-sidebar-foreground/50">
              <Link href="/quote">
                {L({ en: 'Get a Quote', fr: 'Devis Gratuit' })}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}

