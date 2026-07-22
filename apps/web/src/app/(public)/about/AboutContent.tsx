'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  { key: 'stat_countries', fallback: '30+',  en: 'Countries', fr: 'Pays' },
  { key: 'stat_clients',   fallback: '500+', en: 'Clients',   fr: 'Clients' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years',     fr: 'Années' },
  { key: 'stat_shipments', fallback: '10K+', en: 'Shipments', fr: 'Expéditions' },
];

const mvvItems = [
  {
    icon: Target,
    number: '01',
    title: { en: 'Mission', fr: 'Mission' },
    desc: { en: 'To deliver reliable, efficient, and comprehensive logistics, industrial supply, and trade solutions that empower our clients to compete successfully in global markets.', fr: "Fournir des solutions logistiques, de fournitures industrielles et commerciales fiables qui permettent à nos clients de réussir sur les marchés mondiaux." },
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=70',
  },
  {
    icon: Globe2,
    number: '02',
    title: { en: 'Vision', fr: 'Vision' },
    desc: { en: 'To become a globally recognized logistics, transit, and industrial solutions company — trusted by businesses across Africa, Europe, the Middle East, Canada, and beyond.', fr: "Devenir une entreprise de logistique, transit et solutions industrielles reconnue à l'échelle mondiale — de confiance pour les entreprises en Afrique, Europe, Moyen-Orient et Canada." },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=70',
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: { en: 'Values', fr: 'Valeurs' },
    desc: { en: 'Professionalism, Reliability, Integrity, Customer Satisfaction, Operational Excellence, Innovation, Global Collaboration — the principles that guide every decision we make.', fr: 'Professionnalisme, Fiabilité, Intégrité, Satisfaction Client, Excellence Opérationnelle, Innovation, Collaboration Mondiale — les principes qui guident chacune de nos décisions.' },
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&auto=format&fit=crop&q=70',
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
      <section className="relative bg-sidebar py-20 sm:py-28 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&auto=format&fit=crop&q=50"
          alt="" fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar/90 via-sidebar/70 to-sidebar/30" />
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p variants={fadeInUp}
            className="text-primary font-display font-semibold text-xs uppercase tracking-[0.25em] mb-4">
            {L({ en: 'About LTIC SARL', fr: 'À Propos de LTIC SARL' })}
          </motion.p>
          <motion.h1 variants={fadeInUp}
            className="font-display font-bold text-section text-sidebar-foreground leading-none mb-5 max-w-2xl">
            {L({ en: 'Who We Are', fr: 'Qui Nous Sommes' })}
          </motion.h1>
          <motion.p variants={fadeInUp}
            className="text-sidebar-foreground/70 text-base sm:text-lg max-w-xl leading-relaxed">
            {L({ en: 'A Cameroonian multinational delivering logistics, transit, industrial supply, and global trade solutions across 30+ countries.', fr: 'Un groupe camerounais assurant logistique, transit, fournitures industrielles et solutions commerciales dans plus de 30 pays.' })}
          </motion.p>
        </motion.div>
      </section>

      {/* ── STORY ───────────────────────────────────────────────────────────── */}
      <section className="bg-background py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                {L({ en: 'Our Story', fr: 'Notre Histoire' })}
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-5">
                {L({ en: 'Built for the Demands of Global Commerce', fr: 'Conçu pour les Exigences du Commerce Mondial' })}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                {L({ en: "LTIC — Logistics and Transit International Company — was incorporated in Douala, Cameroon as a SARL to serve a critical need: a reliable partner for logistics, transit, industrial supply, commercial representation, and international trade.", fr: "LTIC — Logistics and Transit International Company — a été constituée à Douala, Cameroun en SARL pour répondre à un besoin essentiel : un partenaire fiable en logistique, transit, fourniture industrielle, représentation commerciale et commerce international." })}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed text-sm sm:text-base">
                {L({ en: 'From Douala, we operate across Africa, Europe, the Middle East, and Canada — delivering precision logistics, industrial supply, and strategic trade solutions.', fr: "Depuis Douala, nous opérons en Afrique, Europe, Moyen-Orient et Canada — logistique de précision, fournitures industrielles et solutions commerciales stratégiques." })}
              </p>
              <ul className="space-y-3">
                {[
                  { en: 'Active in 30+ countries across Africa, Europe, Middle East & Americas', fr: "Actif dans 30+ pays en Afrique, Europe, Moyen-Orient et Amériques" },
                  { en: 'Specialized in industrial supply chains, timber trade & consulting', fr: "Spécialisé en chaînes d'approvisionnement, commerce du bois et conseil" },
                  { en: 'Certified partnerships with Total, Shell and major OEM brands', fr: "Partenariats certifiés avec Total, Shell et grandes marques OEM" },
                  { en: 'Full compliance: phytosanitary treatment & customs documentation', fr: "Conformité complète : traitement phytosanitaire et documentation douanière" },
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
              className="relative h-80 lg:h-full min-h-[420px] rounded-sm overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=70"
                alt="LTIC SARL operations" fill className="object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ──────────────────────────────────────────────────────── */}
      <section className="bg-foreground py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn} className="flex flex-col items-center">
                <span className="font-display font-bold text-4xl sm:text-5xl text-primary leading-none mb-2">
                  {stat.value}
                </span>
                <span className="text-sidebar-foreground/60 text-xs uppercase tracking-widest font-medium">
                  {L(stat)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MISSION · VISION · VALUES — hover-reveal panels ─────────────────── */}
      <section className="bg-muted/30 border-y border-border py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="mb-12">
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-3">
              {L({ en: 'Our Foundation', fr: 'Notre Fondation' })}
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              {L({ en: 'Mission, Vision & Values', fr: 'Mission, Vision & Valeurs' })}
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mvvItems.map((item, i) => {
              const isActive = activeMVV === i;
              return (
                <motion.div
                  key={item.title.en}
                  variants={scaleIn}
                  className="relative overflow-hidden rounded-sm cursor-default"
                  style={{ minHeight: 360 }}
                  onMouseEnter={() => setActiveMVV(i)}
                  onMouseLeave={() => setActiveMVV(null)}>

                  {/* Background image — revealed on hover */}
                  <div className="absolute inset-0">
                    <Image src={item.image} alt="" fill className="object-cover" />
                    {/* Overlay: lightens when hovered to reveal image */}
                    <motion.div
                      className="absolute inset-0 bg-card"
                      animate={{ opacity: isActive ? 0.82 : 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Top accent bar — slides in on hover */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-primary"
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    initial={{ scaleX: 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {/* Content */}
                  <div className="relative h-full p-8 flex flex-col justify-between border border-border rounded-sm">
                    {/* Top: always visible */}
                    <div>
                      <span className="font-display font-bold text-xs text-primary tracking-[0.3em] block mb-5">
                        {item.number}
                      </span>
                      <motion.div
                        className="w-11 h-11 rounded-sm bg-foreground flex items-center justify-center mb-5"
                        animate={{ scale: isActive ? 1.08 : 1 }}
                        transition={{ duration: 0.3 }}>
                        <item.icon className="h-5 w-5 text-primary" />
                      </motion.div>
                      <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
                        {L(item.title)}
                      </h3>
                    </div>

                    {/* Bottom: description slides up on hover */}
                    <div>
                      {/* Always visible on mobile, hover-revealed on desktop */}
                      <div className="md:hidden mt-5">
                        <p className="text-muted-foreground text-sm leading-relaxed">{L(item.desc)}</p>
                      </div>
                      <motion.div
                        className="hidden md:block overflow-hidden"
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                        <p className="text-muted-foreground text-sm leading-relaxed mt-5 mb-4">
                          {L(item.desc)}
                        </p>
                      </motion.div>

                      <motion.div
                        className="flex items-center gap-2 mt-4"
                        animate={{ x: isActive ? 4 : 0 }}
                        transition={{ duration: 0.3 }}>
                        <span className="text-primary text-xs font-display font-bold uppercase tracking-[0.2em]">
                          {L({ en: 'Read More', fr: 'En Savoir Plus' })}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CORE VALUES — Style 4: Flip Cards ───────────────────────────────── */}
      <section className="bg-background border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex items-center justify-between mb-10">
            <div>
              <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                {L({ en: 'What Drives Us', fr: 'Ce Qui Nous Anime' })}
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
                {L({ en: 'Core Values', fr: 'Valeurs Fondamentales' })}
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-border mx-8" />
            <span className="hidden sm:block text-muted-foreground/40 font-display font-bold text-xs uppercase tracking-[0.3em] whitespace-nowrap">
              {L({ en: 'Hover to flip', fr: 'Survolez pour retourner' })}
            </span>
          </motion.div>

          <motion.div variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {values.map(({ icon: Icon, en, fr, descEn, descFr }, i) => (
              <motion.div key={en} variants={scaleIn}
                className="[perspective:900px] h-40 sm:h-44">
                {/* Flip container */}
                <div className="relative w-full h-full [transform-style:preserve-3d]
                  transition-transform duration-500 ease-out
                  hover:[transform:rotateY(180deg)] cursor-default">

                  {/* Front face */}
                  <div className="absolute inset-0 [backface-visibility:hidden]
                    bg-card border border-border rounded-sm
                    flex flex-col items-center justify-center gap-3 p-5
                    group hover:border-primary/40 transition-colors duration-200">
                    <div className="w-10 h-10 rounded-sm bg-foreground flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5 text-primary" style={{ width: '1.125rem', height: '1.125rem' }} />
                    </div>
                    <span className="font-display font-bold text-sm uppercase tracking-wide text-center leading-tight">
                      {L({ en, fr })}
                    </span>
                    <span className="text-muted-foreground/40 text-[10px] font-display uppercase tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Back face */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]
                    bg-foreground border border-primary/20 rounded-sm
                    flex flex-col justify-center p-5">
                    <div className="h-px w-8 bg-primary mb-3" />
                    <p className="font-display font-bold text-xs text-sidebar-foreground uppercase tracking-wide mb-2">
                      {L({ en, fr })}
                    </p>
                    <p className="text-sidebar-foreground/60 text-xs leading-relaxed">
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
      <section className="bg-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-sidebar-foreground tracking-tight">
              {L({ en: 'Ready to Partner with LTIC SARL?', fr: 'Prêt à Collaborer avec LTIC SARL ?' })}
            </h2>
            <p className="text-sidebar-foreground/60 text-sm mt-2">
              {L({ en: 'Let us show you how our global network transforms your operations.', fr: "Laissez-nous vous montrer comment notre réseau mondial transforme vos opérations." })}
            </p>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
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
                {L({ en: 'Get a Quote', fr: 'Devis Gratuit' })}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
