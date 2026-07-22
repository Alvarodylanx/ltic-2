'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Target, Globe2, ShieldCheck, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn, stagger, staggerFast, viewportOnce } from '@/components/motion/variants';

const statDefs = [
  { key: 'stat_countries', fallback: '30+',  en: 'Countries', fr: 'Pays' },
  { key: 'stat_clients',   fallback: '500+', en: 'Clients',   fr: 'Clients' },
  { key: 'stat_years',     fallback: '5+',   en: 'Years',     fr: 'Années' },
  { key: 'stat_shipments', fallback: '10K+', en: 'Shipments', fr: 'Expéditions' },
];

const values = [
  { icon: ShieldCheck,  en: 'Reliability',           fr: 'Fiabilité',                descEn: 'Committed to delivering on every promise — on time, in full, and with complete transparency.', descFr: 'Engagés à tenir chaque promesse — à temps, intégralement et avec une totale transparence.' },
  { icon: Target,       en: 'Professionalism',        fr: 'Professionnalisme',         descEn: 'Maintaining the highest standards of expertise, conduct, and accountability in every business interaction.', descFr: "Maintenir les plus hauts standards d'expertise, de conduite et de responsabilité dans chaque interaction." },
  { icon: CheckCircle2, en: 'Integrity',              fr: 'Intégrité',                 descEn: 'Operating with honesty and ethical standards across all client, partner, and supplier relationships.', descFr: 'Agir avec honnêteté et rigueur éthique dans toutes les relations commerciales.' },
  { icon: Lightbulb,    en: 'Innovation',             fr: 'Innovation',                descEn: 'Continuously adopting modern technologies and methodologies to deliver smarter logistics solutions.', descFr: 'Adopter continuellement les technologies modernes pour des solutions logistiques plus performantes.' },
  { icon: TrendingUp,   en: 'Operational Excellence', fr: 'Excellence Opérationnelle', descEn: 'Relentless pursuit of efficiency, quality, and continuous improvement across all our operations.', descFr: "Recherche constante d'efficacité, de qualité et d'amélioration continue dans toutes nos opérations." },
  { icon: Globe2,       en: 'Global Collaboration',   fr: 'Collaboration Mondiale',    descEn: 'Building strong international partnerships to connect businesses with global markets and opportunities.', descFr: 'Construire des partenariats internationaux solides pour connecter les entreprises aux marchés mondiaux.' },
];

export default function AboutPage() {
  const { L } = useLanguage();
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
      {/* ── PAGE HEADER — White asymmetric split ────────────────────────────── */}
      <section className="bg-background overflow-hidden border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-32 flex flex-col justify-center">
            <motion.div variants={fadeInUp} className="w-10 h-0.5 bg-primary mb-8" />
            <motion.p variants={fadeInUp}
              className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {L({ en: 'About LTIC SARL', fr: 'À Propos de LTIC SARL' })}
            </motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-display font-extrabold text-section text-foreground leading-none mb-6">
              {L({ en: 'Who We Are', fr: 'Qui Nous\nSommes' })}
            </motion.h1>
            <motion.p variants={fadeInUp}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
              {L({ en: 'A Cameroonian multinational delivering logistics, transit, industrial supply, and trade solutions across 30+ countries.', fr: 'Un groupe camerounais assurant logistique, transit, fournitures industrielles et solutions commerciales dans plus de 30 pays.' })}
            </motion.p>
          </motion.div>

          <motion.div
            variants={fadeInRight} initial="hidden" animate="show"
            className="relative h-72 lg:h-auto min-h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=70"
              alt="LTIC SARL operations" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-foreground/30" />
            <div className="absolute bottom-6 left-6 bg-foreground/90 px-5 py-3">
              <p className="font-display font-bold text-xs text-primary uppercase tracking-[0.2em]">
                {L({ en: 'Headquartered in', fr: 'Basé à' })}
              </p>
              <p className="text-sidebar-foreground text-sm font-semibold">Douala, Cameroun</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 01  OUR STORY ───────────────────────────────────────────────────── */}
      <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
        <span aria-hidden className="absolute right-4 top-0 font-display font-extrabold text-[12rem] leading-none text-foreground/[0.04] select-none pointer-events-none">
          01
        </span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="relative h-[380px] lg:h-[520px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=70"
                alt="LTIC story" fill className="object-cover" />
            </motion.div>

            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <div className="w-10 h-0.5 bg-primary mb-6" />
              <p className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
                {L({ en: 'Our Story', fr: 'Notre Histoire' })}
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight mb-6">
                {L({ en: 'Built for Global Commerce', fr: 'Conçu pour le Commerce Mondial' })}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                {L({ en: "LTIC — Logistics and Transit International Company — was incorporated in Douala, Cameroon as a SARL to serve a critical need: a reliable, comprehensive partner for logistics, transit, industrial supply, commercial representation, and international trade.", fr: "LTIC — Logistics and Transit International Company — a été constituée à Douala, Cameroun en SARL pour répondre à un besoin essentiel : un partenaire fiable en logistique, transit, fourniture industrielle, représentation commerciale et commerce international." })}
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
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm leading-relaxed">{L(item)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────────────────────────── */}
      <section className="bg-foreground py-0">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn}
                className="bg-foreground flex flex-col items-center py-12 px-4 text-center">
                <span className="font-display font-extrabold text-5xl sm:text-6xl text-primary leading-none mb-2">
                  {stat.value}
                </span>
                <span className="text-sidebar-foreground/50 text-xs uppercase tracking-[0.2em] font-semibold">
                  {L(stat)}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 02  MISSION · VISION · VALUES ──────────────────────────────────── */}
      <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
        <span aria-hidden className="absolute left-4 top-0 font-display font-extrabold text-[12rem] leading-none text-foreground/[0.04] select-none pointer-events-none">
          02
        </span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-14">
            <div className="w-10 h-0.5 bg-primary mb-6" />
            <h2 className="font-display font-extrabold text-section leading-none tracking-tight">
              {L({ en: 'Mission, Vision\n& Values', fr: 'Mission, Vision\n& Valeurs' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Target,      title: { en: 'Mission', fr: 'Mission' },
                desc: { en: 'To deliver reliable, efficient, and comprehensive logistics, industrial supply, and trade solutions that empower our clients to compete successfully in global markets.', fr: "Fournir des solutions logistiques, de fournitures industrielles et commerciales fiables et complètes qui permettent à nos clients de réussir sur les marchés mondiaux." } },
              { icon: Globe2,      title: { en: 'Vision',  fr: 'Vision'  },
                desc: { en: 'To become a globally recognized logistics, transit, and industrial solutions company — trusted by businesses across Africa, Europe, the Middle East, Canada, and beyond.', fr: "Devenir une entreprise de logistique, transit et solutions industrielles reconnue à l'échelle mondiale — de confiance pour les entreprises en Afrique, Europe, Moyen-Orient et Canada." } },
              { icon: ShieldCheck, title: { en: 'Values',  fr: 'Valeurs' },
                desc: { en: 'Professionalism, Reliability, Integrity, Customer Satisfaction, Operational Excellence, Innovation, Global Collaboration, Efficiency.', fr: 'Professionnalisme, Fiabilité, Intégrité, Satisfaction Client, Excellence Opérationnelle, Innovation, Collaboration Mondiale, Efficacité.' } },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div key={title.en} variants={fadeInUp} className="border-t-2 border-primary pt-6">
                <Icon className="h-5 w-5 text-primary mb-5" />
                <h3 className="font-display font-extrabold text-xl mb-4">{L(title)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{L(desc)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 03  CORE VALUES ──────────────────────────────────────────────────── */}
      <section className="bg-muted/20 border-y border-border py-20 lg:py-28 relative overflow-hidden">
        <span aria-hidden className="absolute right-4 top-0 font-display font-extrabold text-[12rem] leading-none text-foreground/[0.04] select-none pointer-events-none">
          03
        </span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-14">
            <div className="w-10 h-0.5 bg-primary mb-6" />
            <p className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {L({ en: 'What Drives Us', fr: 'Ce Qui Nous Anime' })}
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight">
              {L({ en: 'Core Values', fr: 'Valeurs Fondamentales' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border overflow-hidden">
            {values.map(({ icon: Icon, ...val }) => (
              <motion.div key={val.en} variants={fadeInUp}
                className="group bg-card hover:bg-primary p-8 transition-colors duration-300 cursor-default">
                <Icon className="h-5 w-5 text-primary group-hover:text-white mb-5 transition-colors duration-300" />
                <h3 className="font-display font-extrabold text-base mb-2 group-hover:text-white transition-colors duration-300">
                  {L({ en: val.en, fr: val.fr })}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed group-hover:text-white/75 transition-colors duration-300">
                  {L({ en: val.descEn, fr: val.descFr })}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 04  TEAM ──────────────────────────────────────────────────────────── */}
      <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
        <span aria-hidden className="absolute left-4 top-0 font-display font-extrabold text-[12rem] leading-none text-foreground/[0.04] select-none pointer-events-none">
          04
        </span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-14">
            <div className="w-10 h-0.5 bg-primary mb-6" />
            <p className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {L({ en: 'Our Team', fr: 'Notre Équipe' })}
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight tracking-tight">
              {L({ en: 'Professional Expertise', fr: 'Expertise Professionnelle' })}
            </h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="divide-y divide-border border-y border-border">
            {[
              { role: { en: 'Operations Director', fr: 'Directeur des Opérations' }, desc: { en: 'Experienced in managing international freight, customs operations, and multi-modal logistics across Africa, Europe, and the Middle East.', fr: "Expérimenté dans la gestion du fret international, des opérations douanières et de la logistique multimodale en Afrique, Europe et Moyen-Orient." } },
              { role: { en: 'Trade Manager', fr: 'Responsable Commercial' }, desc: { en: 'Specialist in global sourcing, import/export compliance, and building strategic trade partnerships across 30+ markets.', fr: "Spécialiste en approvisionnement mondial, conformité import/export et partenariats commerciaux stratégiques dans 30+ marchés." } },
              { role: { en: 'Supply Chain Consultant', fr: 'Consultant en Chaîne Logistique' }, desc: { en: 'Expert in supply chain design, procurement optimization, and industrial supply solutions for complex operational environments.', fr: "Expert en conception de chaîne logistique, optimisation des achats et solutions industrielles pour environnements complexes." } },
            ].map((member, i) => (
              <motion.div key={i} variants={fadeInUp}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 items-start group">
                <div className="flex items-center gap-3">
                  <div className="w-0.5 h-10 bg-primary flex-shrink-0" />
                  <h3 className="font-display font-extrabold text-base">{L(member.role)}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed sm:col-span-2">{L(member.desc)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&auto=format&fit=crop&q=30"
            alt="" fill className="object-cover opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <div className="w-10 h-0.5 bg-primary mb-6" />
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-sidebar-foreground leading-tight tracking-tight">
              {L({ en: 'Ready to Partner with LTIC SARL?', fr: 'Prêt à Collaborer avec LTIC SARL ?' })}
            </h2>
            <p className="text-sidebar-foreground/60 text-sm mt-4 leading-relaxed max-w-md">
              {L({ en: 'Let us show you how our global network and expert teams can transform your operations.', fr: "Laissez-nous vous montrer comment notre réseau mondial peut transformer vos opérations logistiques." })}
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
