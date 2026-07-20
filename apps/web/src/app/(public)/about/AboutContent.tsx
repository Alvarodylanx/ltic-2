'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Target, Globe2, ShieldCheck, Lightbulb, TrendingUp, User, ArrowRight } from 'lucide-react';
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
  { icon: ShieldCheck,  en: 'Reliability',            fr: 'Fiabilité',                 descEn: 'Committed to delivering on every promise — on time, in full, and with complete transparency.',                                                    descFr: 'Engagés à tenir chaque promesse — à temps, intégralement et avec une totale transparence.' },
  { icon: Target,       en: 'Professionalism',         fr: 'Professionnalisme',          descEn: 'Maintaining the highest standards of expertise, conduct, and accountability in every business interaction.',                                       descFr: "Maintenir les plus hauts standards d'expertise, de conduite et de responsabilité dans chaque interaction commerciale." },
  { icon: CheckCircle2, en: 'Integrity',               fr: 'Intégrité',                  descEn: 'Operating with honesty and ethical standards across all client, partner, and supplier relationships.',                                             descFr: 'Agir avec honnêteté et rigueur éthique dans toutes les relations avec clients, partenaires et fournisseurs.' },
  { icon: Lightbulb,    en: 'Innovation',              fr: 'Innovation',                 descEn: 'Continuously adopting modern technologies and methodologies to deliver smarter logistics solutions.',                                               descFr: 'Adopter continuellement les technologies et méthodologies modernes pour des solutions logistiques plus performantes.' },
  { icon: TrendingUp,   en: 'Operational Excellence',  fr: 'Excellence Opérationnelle',  descEn: 'Relentless pursuit of efficiency, quality, and continuous improvement across all our operations.',                                                 descFr: "Recherche constante d'efficacité, de qualité et d'amélioration continue dans toutes nos opérations." },
  { icon: Globe2,       en: 'Global Collaboration',    fr: 'Collaboration Mondiale',      descEn: 'Building strong international partnerships to connect businesses with global markets and opportunities.',                                           descFr: 'Construire des partenariats internationaux solides pour connecter les entreprises aux marchés et opportunités mondiales.' },
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
      {/* ── Hero ── */}
      <section className="relative bg-sidebar py-24 sm:py-32 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&auto=format&fit=crop&q=50"
            alt="About LTIC SARL" fill className="object-cover opacity-25" priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar/90 via-sidebar/70 to-sidebar/30" />
        </div>
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-12">
          <motion.p variants={fadeInUp} className="text-primary font-display font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            {L({ en: 'About Us', fr: 'À Propos' })}
          </motion.p>
          <motion.h1 variants={fadeInUp}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-sidebar-foreground leading-tight tracking-tight mb-6 max-w-3xl">
            {L({ en: 'Who We Are', fr: 'Qui Nous Sommes' })}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-sidebar-foreground/70 text-base sm:text-lg max-w-xl leading-relaxed">
            {L({ en: 'A Cameroonian company with international reach — providing reliable logistics, transit, industrial supply, and global trade solutions across 30+ countries.', fr: "Une entreprise camerounaise à portée internationale — offrant des solutions fiables de logistique, transit, fourniture industrielle et commerce mondial dans plus de 30 pays." })}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Company Overview ── */}
      <section className="bg-background py-14 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <span className="amber-rule mb-4" />
              <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
                {L({ en: 'Our Story', fr: 'Notre Histoire' })}
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-6">
                {L({ en: 'Built for the Demands of Global Commerce', fr: 'Conçu pour les Exigences du Commerce Mondial' })}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                {L({ en: "LTIC — Logistics and Transit International Company — was incorporated in Douala, Cameroon as a SARL to serve a critical need: a reliable, comprehensive partner for logistics, transit, industrial supply, commercial representation, and international trade in Cameroon and abroad.", fr: "LTIC — Logistics and Transit International Company — a été constituée à Douala, Cameroun en SARL pour répondre à un besoin essentiel : un partenaire fiable et complet en logistique, transit, fourniture industrielle, représentation commerciale et commerce international." })}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed text-sm sm:text-base">
                {L({ en: 'From our registered headquarters in Douala, we operate across Africa, Europe, the Middle East, and Canada — delivering logistics, industrial supply, import/export facilitation, phytosanitary treatment, and strategic trade solutions with precision and reliability.', fr: "Depuis notre siège social à Douala, nous opérons en Afrique, Europe, Moyen-Orient et Canada — en livrant des solutions logistiques, de fourniture industrielle, de facilitation import/export, de traitement phytosanitaire et de commerce stratégique avec précision." })}
              </p>
              <ul className="space-y-3">
                {[
                  { en: 'Active operations in 30+ countries across Africa, Europe, Middle East & Americas', fr: "Opérations actives dans 30+ pays en Afrique, Europe, Moyen-Orient & Amériques" },
                  { en: 'Specialized in industrial supply chains, logistics, timber trade & consulting', fr: "Spécialisé dans les chaînes d'approvisionnement industrielles, logistique, commerce du bois" },
                  { en: 'Certified partnerships with Total, Shell and major OEM brands', fr: "Partenariats certifiés avec Total, Shell et grandes marques OEM" },
                  { en: 'Full compliance: phytosanitary treatment & customs documentation', fr: "Conformité complète : traitement phytosanitaire et documentation douanière" },
                ].map((item, i) => (
                  <motion.li key={i} variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
                    transition={{ delay: i * 0.07 }} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">{L(item)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
              className="relative h-80 lg:h-full min-h-[400px] rounded-sm overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=70"
                alt="LTIC SARL operations" fill className="object-cover transition-transform duration-700 hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission, Vision, Values ── */}
      <section className="bg-muted/50 py-14 sm:py-20 lg:py-28 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-8 sm:mb-12 lg:mb-14">
            <span className="amber-rule mb-4" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              {L({ en: 'Mission, Vision & Values', fr: 'Mission, Vision & Valeurs' })}
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {[
              { icon: Target,     title: { en: 'Mission', fr: 'Mission' }, desc: { en: 'To deliver reliable, efficient, and comprehensive logistics, industrial supply, and trade solutions that empower our clients to compete successfully in global markets.', fr: "Fournir des solutions logistiques, de fournitures industrielles et commerciales fiables, efficaces et complètes qui permettent à nos clients de réussir sur les marchés mondiaux." } },
              { icon: Globe2,     title: { en: 'Vision',  fr: 'Vision'  }, desc: { en: 'To become a globally recognized logistics, transit, and industrial solutions company — trusted by businesses across Africa, Europe, the Middle East, Canada, and beyond.', fr: "Devenir une entreprise de logistique, transit et solutions industrielles reconnue à l'échelle mondiale — de confiance pour les entreprises en Afrique, Europe, Moyen-Orient, Canada et au-delà." } },
              { icon: ShieldCheck,title: { en: 'Values',  fr: 'Valeurs' }, desc: { en: 'Professionalism, Reliability, Integrity, Customer Satisfaction, Operational Excellence, Innovation, Global Collaboration, Efficiency', fr: 'Professionnalisme, Fiabilité, Intégrité, Satisfaction Client, Excellence Opérationnelle, Innovation, Collaboration Mondiale, Efficacité' } },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div key={title.en} variants={fadeInUp}
                className="group bg-card p-8 hover:bg-background transition-colors duration-200 relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 rounded-sm bg-foreground flex items-center justify-center mb-6">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg mb-4">{L(title)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{L(desc)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Core Values Grid ── */}
      <section className="bg-background py-14 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-8 sm:mb-12 lg:mb-14">
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              {L({ en: 'What Drives Us', fr: 'Ce Qui Nous Anime' })}
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
              {L({ en: 'Our Core Values', fr: 'Nos Valeurs Fondamentales' })}
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map(({ icon: Icon, ...val }) => (
              <motion.div key={val.en} variants={scaleIn}
                className="group bg-card border border-border rounded-sm p-6 hover:border-primary/50 transition-colors duration-200">
                <div className="w-10 h-10 rounded-sm bg-foreground flex items-center justify-center mb-5">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-display font-bold text-sm mb-2">{L({ en: val.en, fr: val.fr })}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{L({ en: val.descEn, fr: val.descFr })}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-foreground py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerFast} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn} className="flex flex-col items-center">
                <span className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-primary leading-none mb-2">{stat.value}</span>
                <span className="text-sidebar-foreground/60 text-[10px] sm:text-xs uppercase tracking-widest font-medium">{L(stat)}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-background py-14 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-8 sm:mb-12 lg:mb-14">
            <span className="amber-rule mb-4" />
            <p className="text-primary font-display font-semibold text-xs uppercase tracking-[0.18em] mb-3">
              {L({ en: 'Our Team', fr: 'Notre Équipe' })}
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-4">
              {L({ en: 'Professional Expertise at Every Level', fr: 'Expertise Professionnelle à Chaque Niveau' })}
            </h2>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              {L({ en: 'Our team combines deep expertise across logistics, international trade, industrial supply, and strategic consulting.', fr: "Notre équipe combine une expertise approfondie en logistique, commerce international, fournitures industrielles et conseil stratégique." })}
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { role: { en: 'Operations Director', fr: 'Directeur des Opérations' }, desc: { en: 'Experienced in managing international freight, customs operations, and multi-modal logistics across Africa, Europe, and the Middle East.', fr: "Expérimenté dans la gestion du fret international, des opérations douanières et de la logistique multimodale en Afrique, Europe et Moyen-Orient." } },
              { role: { en: 'Trade Manager',        fr: 'Responsable Commercial'   }, desc: { en: 'Specialist in global sourcing, import/export compliance, and building strategic trade partnerships across 30+ markets.', fr: "Spécialiste en approvisionnement mondial, conformité import/export, et développement de partenariats commerciaux stratégiques dans 30+ marchés." } },
              { role: { en: 'Supply Chain Consultant', fr: 'Consultant en Chaîne Logistique' }, desc: { en: 'Expert in supply chain design, procurement optimization, and industrial supply solutions for complex operational environments.', fr: "Expert en conception de chaîne logistique, optimisation des achats et solutions de fournitures industrielles pour environnements complexes." } },
            ].map((member, i) => (
              <motion.div key={i} variants={scaleIn}
                className="bg-card border border-border rounded-sm p-6 text-center hover:border-primary/40 transition-colors duration-200">
                <div className="w-14 h-14 rounded-sm bg-foreground flex items-center justify-center mx-auto mb-5">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-sm mb-3">{L(member.role)}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{L(member.desc)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-foreground py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-sidebar-foreground tracking-tight">
              {L({ en: 'Ready to Partner with LTIC SARL?', fr: 'Prêt à Collaborer avec LTIC SARL ?' })}
            </h2>
            <p className="text-sidebar-foreground/60 text-sm mt-2">
              {L({ en: 'Let us show you how our global network transforms your operations.', fr: "Laissez-nous vous montrer comment notre réseau mondial transforme vos opérations." })}
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
