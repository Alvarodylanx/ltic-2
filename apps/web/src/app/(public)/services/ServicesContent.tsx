'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { viewportOnce } from '@/components/motion/variants';

const services = [
  {
    id: 'land-transport',
    en: 'Land Transport', fr: 'Transport Terrestre',
    tagEn: 'Road Freight', tagFr: 'Fret Routier',
    headlineEn: 'Douala to Chad, RCA, Congo-Brazzaville, Gabon & All 10 Regions of Cameroon',
    headlineFr: 'Douala vers le Tchad, RCA, Congo-Brazzaville, Gabon et les 10 Régions du Cameroun',
    descEn: 'LTIC SARL operates dedicated road freight corridors linking Douala to major Central African capitals while covering all 10 administrative regions of Cameroon. From port pickup to final destination, our fleet ensures every shipment arrives on time, fully documented and customs-cleared.',
    descFr: 'LTIC SARL opère des corridors de fret routier dédiés reliant Douala aux grandes capitales d\'Afrique Centrale.',
    image: '/images/transportation.jpg',
    bulletsEn: ['Douala – N\'Djamena (Chad)', 'Douala – Bangui (CAR)', 'Douala – Brazzaville (Congo)', 'Douala – Libreville (Gabon)', 'All 10 Regions of Cameroon', 'Port pickup & door-to-door', 'Customs clearance included'],
    bulletsFr: ['Douala – N\'Djamena (Tchad)', 'Douala – Bangui (RCA)', 'Douala – Brazzaville (Congo)', 'Douala – Libreville (Gabon)', 'Les 10 régions du Cameroun', 'Enlèvement au port & porte-à-porte', 'Dédouanement inclus'],
  },
  {
    id: 'chemical',
    en: 'Chemical Manufacturing', fr: 'Production Chimique',
    tagEn: 'ECOKLIN Brand', tagFr: 'Marque ECOKLIN',
    headlineEn: 'ECOKLIN — Our Own Cleaning & Hygiene Brand',
    headlineFr: 'ECOKLIN — Notre Marque de Produits de Nettoyage',
    descEn: 'LTIC SARL manufactures a complete range of home care, personal care, and industrial sanitation products under the ECOKLIN brand at our factory in PK13, Douala. All products are eco-friendly and biodegradable.',
    descFr: 'LTIC SARL fabrique une gamme complète de produits ménagers et désinfectants industriels sous la marque ECOKLIN dans notre usine à PK13, Douala.',
    image: '/images/ecoklin-factory.jpg',
    bulletsEn: ['Bleach (Eau de Javel)', 'Industrial Degreaser', 'Descaler', 'Tile Liquid Soap', 'Laundry Liquid Soap', 'Dish Washing Liquid', 'Muriatic Acid'],
    bulletsFr: ['Eau de Javel', 'Dégraissant Industriel', 'Détartrant', 'Savon Liquide Carreaux', 'Savon Liquide Lessive', 'Savon Liquide Vaisselle', 'Acide Muriatique'],
  },
  {
    id: 'lubricants',
    en: 'Lubricant Distribution', fr: 'Distribution de Lubrifiants',
    tagEn: 'Total & Shell', tagFr: 'Total & Shell',
    headlineEn: 'Authorized Distributor — Total, Shell & Leading Brands',
    headlineFr: 'Distributeur Agréé — Total, Shell et Grandes Marques',
    descEn: 'LTIC SARL distributes premium lubricants for motors, vessels, and industrial equipment. We supply Total, Shell, and other certified brands across Central Africa and beyond.',
    descFr: 'LTIC SARL distribue des lubrifiants premium pour moteurs, navires et équipements industriels en Afrique Centrale et au-delà.',
    image: '/images/lubricants-warehouse.jpg',
    bulletsEn: ['Engine oils (Total, Shell)', 'Marine lubricants', 'Hydraulic oils', 'Gear & transmission fluids', 'Greases & specialty lubricants', 'Bulk & packaged supply'],
    bulletsFr: ['Huiles moteur (Total, Shell)', 'Lubrifiants marins', 'Huiles hydrauliques', 'Huiles de boîte & transmissions', 'Graisses & lubrifiants spéciaux', 'Fourniture vrac & conditionnée'],
  },
  {
    id: 'offshore',
    en: 'Offshore Marine Services', fr: 'Services Offshore & Maritimes',
    tagEn: 'Gulf of Guinea', tagFr: 'Golfe de Guinée',
    headlineEn: 'General Ship Chandling & Maritime Supply',
    headlineFr: 'Avitaillement & Fournitures Maritimes',
    descEn: 'LTIC SARL operates as a general ship supplier and maritime logistics provider, supporting vessels across African ports. We handle ship chandling, spare parts, chemical supply, and sludging services in the Gulf of Guinea.',
    descFr: 'LTIC SARL opère comme fournisseur général de navires et prestataire logistique maritime dans le Golfe de Guinée.',
    image: '/images/offshore-port-supply.jpg',
    bulletsEn: ['General ship chandling', 'Spare parts procurement', 'Sludging & waste management', 'Chemical & lubricant supply', 'Bunkering coordination', 'Gulf of Guinea operations'],
    bulletsFr: ['Avitaillement général', 'Approvisionnement pièces détachées', 'Services boues & déchets', 'Produits chimiques & lubrifiants', 'Coordination bunkering', 'Opérations Golfe de Guinée'],
  },
  {
    id: 'training',
    en: 'Logistics Training', fr: 'Formation Logistique',
    tagEn: 'Professional Training', tagFr: 'Formation Pro',
    headlineEn: 'Build Your Team\'s Logistics Expertise',
    headlineFr: 'Développez l\'Expertise Logistique de Votre Équipe',
    descEn: 'LTIC SARL provides professional logistics training programs for personnel in the maritime, customs, transit, and supply chain sectors. Practical, hands-on training by experienced industry professionals.',
    descFr: 'LTIC SARL propose des programmes de formation professionnelle en logistique pour le personnel des secteurs maritime, douanier et chaîne d\'approvisionnement.',
    image: '/images/logistics-training.jpg',
    bulletsEn: ['Freight forwarding fundamentals', 'Customs procedures', 'Maritime logistics operations', 'Supply chain management', 'Port & terminal operations', 'Safety & compliance'],
    bulletsFr: ['Fondamentaux du fret', 'Procédures douanières', 'Opérations logistiques maritimes', 'Gestion chaîne d\'approvisionnement', 'Opérations portuaires', 'Sécurité & conformité'],
  },
  {
    id: 'commercial',
    en: 'Commercial Representation', fr: 'Représentation Commerciale',
    tagEn: 'Market Entry', tagFr: 'Entrée Marché',
    headlineEn: 'Your Gateway to the Cameroonian Market',
    headlineFr: 'Votre Porte d\'Entrée sur le Marché Camerounais',
    descEn: 'LTIC SARL represents international brands and companies seeking to enter the Cameroonian and Central African markets. We provide local market intelligence, distribution networks, and on-the-ground business development support.',
    descFr: 'LTIC SARL représente des marques internationales souhaitant s\'implanter sur les marchés camerounais et centrafricains.',
    image: '/images/commercial-representation.jpeg',
    bulletsEn: ['Brand representation', 'Distribution channel development', 'Market entry strategy', 'Joint venture facilitation', 'Regulatory compliance support', 'Trade mission coordination'],
    bulletsFr: ['Représentation de marque', 'Développement canaux distribution', 'Stratégie d\'entrée marché', 'Facilitation coentreprises', 'Support réglementaire', 'Coordination missions commerciales'],
  },
  {
    id: 'vessel',
    en: 'Vessel Maintenance', fr: 'Maintenance des Navires',
    tagEn: 'On-Site Support', tagFr: 'Support sur Site',
    headlineEn: 'On-Site Technical Support Wherever Your Vessel Is',
    headlineFr: 'Support Technique sur Site où que soit Votre Navire',
    descEn: 'LTIC SARL provides professional vessel maintenance and technical support for ships operating in African waters. Our teams deploy on-site to perform inspections, maintenance operations, and emergency interventions at sea.',
    descFr: 'LTIC SARL assure la maintenance professionnelle des navires pour les bateaux opérant dans les eaux africaines.',
    image: '/images/service-vessel-maintenance.jpg',
    bulletsEn: ['On-site maintenance at sea', 'Hull & machinery support', 'Spare parts logistics', 'Crew coordination', 'Emergency repair intervention', 'Compliance & certification'],
    bulletsFr: ['Maintenance sur site en mer', 'Support coque & machines', 'Logistique pièces détachées', 'Coordination équipage', 'Intervention d\'urgence', 'Conformité & certification'],
  },
];

const contentVariants = {
  enter: { opacity: 0, y: 18, scale: 0.985 },
  center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.22, ease: 'easeIn' } },
};

/* Mobile accordion item */
function AccordionItem({ svc, index, isOpen, onToggle }: {
  svc: typeof services[0]; index: number; isOpen: boolean; onToggle: () => void;
}) {
  const { L } = useLanguage();
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/50 transition-colors">
        <span className={`font-display font-black text-2xl leading-none w-10 flex-shrink-0 transition-colors ${isOpen ? 'text-primary' : 'text-foreground/20'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className={`flex-1 font-semibold text-sm transition-colors ${isOpen ? 'text-primary' : 'text-foreground'}`}>
          {L({ en: svc.en, fr: svc.fr })}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden">
            <div className="px-5 pb-6">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-5 bg-muted">
                <Image src={svc.image} alt={L({ en: svc.en, fr: svc.fr })} fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {L({ en: svc.tagEn, fr: svc.tagFr })}
                </span>
              </div>
              <h3 className="font-display font-bold text-foreground text-lg leading-snug mb-3">
                {L({ en: svc.headlineEn, fr: svc.headlineFr })}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {L({ en: svc.descEn, fr: svc.descFr })}
              </p>
              <ul className="space-y-2">
                {svc.bulletsEn.map((b, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" strokeWidth={2.5} />
                    {L({ en: b, fr: svc.bulletsFr[i] })}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServicesPage() {
  const { L } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const active = services[activeIndex];

  return (
    <>
      {/* ── COMPACT HERO BANNER ── */}
      <section className="relative bg-sidebar overflow-hidden border-b border-white/10">
        <Image src="/images/banner-services.jpg" alt="" fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar/90 to-sidebar/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-primary font-bold text-[11px] uppercase tracking-[0.32em] mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-primary" />
              {L({ en: 'Our Services', fr: 'Nos Services' })}
            </p>
            <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.5rem)] text-sidebar-foreground leading-tight tracking-tight">
              {L({ en: 'What We Do', fr: 'Ce Que Nous Faisons' })}
            </h1>
            <p className="text-sidebar-foreground/55 text-sm mt-2 max-w-md">
              {L({ en: 'Select a service below to explore our full capabilities.', fr: 'Sélectionnez un service ci-dessous pour explorer nos capacités.' })}
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8 flex-shrink-0">
            {[{ v: '07', l: { en: 'Services', fr: 'Services' } }, { v: '05', l: { en: 'Countries', fr: 'Pays' } }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-black text-4xl text-primary leading-none mb-1">{s.v}</div>
                <div className="text-sidebar-foreground/50 text-[11px] font-semibold uppercase tracking-wider">{L(s.l)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESKTOP SPLIT LAYOUT ── */}
      <div className="hidden lg:flex min-h-[80vh] bg-background">

        {/* LEFT: Service list sidebar */}
        <aside className="w-72 xl:w-80 flex-shrink-0 border-r border-border bg-background sticky top-16 self-start h-[calc(100vh-4rem)] overflow-y-auto flex flex-col">
          <div className="px-6 pt-7 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">
              {L({ en: 'Browse Services', fr: 'Parcourir les Services' })}
            </p>
          </div>
          <nav className="flex-1 px-3">
            {services.map((svc, i) => (
              <button
                key={svc.id}
                onClick={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-xl mb-0.5 text-left transition-all duration-200 group ${
                  activeIndex === i
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted border border-transparent'
                }`}>
                <span className={`font-display font-black text-xl leading-none w-9 flex-shrink-0 transition-colors ${activeIndex === i ? 'text-primary' : 'text-foreground/15 group-hover:text-foreground/30'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-tight transition-colors truncate ${activeIndex === i ? 'text-primary' : 'text-foreground/70 group-hover:text-foreground'}`}>
                    {L({ en: svc.en, fr: svc.fr })}
                  </p>
                  <p className={`text-[10px] mt-0.5 font-medium uppercase tracking-wider transition-colors ${activeIndex === i ? 'text-primary/60' : 'text-muted-foreground'}`}>
                    {L({ en: svc.tagEn, fr: svc.tagFr })}
                  </p>
                </div>
                {activeIndex === i && (
                  <motion.div layoutId="sidebar-dot" className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </nav>
          <div className="p-5 mt-2 border-t border-border">
            <Button asChild size="sm" className="w-full font-semibold text-xs">
              <Link href="/quote">
                {L({ en: 'Request a Quote', fr: 'Demander un Devis' })}
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </aside>

        {/* RIGHT: Content panel */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="h-full">

              {/* Image */}
              <div className="relative w-full aspect-[16/7] overflow-hidden bg-muted">
                <Image
                  src={active.image}
                  alt={L({ en: active.en, fr: active.fr })}
                  fill sizes="(max-width: 1280px) 80vw, 1100px"
                  className="object-cover"
                  priority />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent" />

                {/* Floating tag */}
                <div className="absolute top-5 right-5 flex items-center gap-2">
                  <span className="bg-sidebar/85 backdrop-blur-md border border-white/10 text-sidebar-foreground text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    {String(activeIndex + 1).padStart(2, '0')} / 07
                  </span>
                  <span className="bg-primary/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    {L({ en: active.tagEn, fr: active.tagFr })}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="px-8 xl:px-12 py-8 xl:py-10 max-w-3xl">
                <h2 className="font-display font-bold text-foreground text-2xl xl:text-3xl leading-tight tracking-tight mb-4">
                  {L({ en: active.headlineEn, fr: active.headlineFr })}
                </h2>
                <p className="text-muted-foreground text-[15px] leading-relaxed mb-7 max-w-xl">
                  {L({ en: active.descEn, fr: active.descFr })}
                </p>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {active.bulletsEn.map((b, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {L({ en: b, fr: active.bulletsFr[i] })}
                    </li>
                  ))}
                </ul>

                {/* Next service nudge */}
                {activeIndex < services.length - 1 && (
                  <button
                    onClick={() => setActiveIndex(activeIndex + 1)}
                    className="mt-8 flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group">
                    <span>{L({ en: 'Next:', fr: 'Suivant :' })}</span>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {L({ en: services[activeIndex + 1].en, fr: services[activeIndex + 1].fr })}
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── MOBILE ACCORDION ── */}
      <div className="lg:hidden bg-background border-b border-border">
        {services.map((svc, i) => (
          <AccordionItem
            key={svc.id} svc={svc} index={i}
            isOpen={openMobile === i}
            onToggle={() => setOpenMobile(openMobile === i ? null : i)} />
        ))}
      </div>

      {/* ── COVERAGE STRIP ── */}
      <section className="bg-muted border-b border-border py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <div className="flex-shrink-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-0.5">{L({ en: 'Road Freight', fr: 'Fret Routier' })}</p>
              <h2 className="font-bold text-lg text-foreground">{L({ en: 'Coverage Map', fr: 'Carte de Couverture' })}</h2>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {[
                { flag: '🇹🇩', label: { en: 'Chad', fr: 'Tchad' }, km: '~1 900 km' },
                { flag: '🇨🇫', label: { en: 'C.A.R.', fr: 'R.C.A.' }, km: '~1 500 km' },
                { flag: '🇨🇬', label: { en: 'Congo', fr: 'Congo' }, km: '~900 km' },
                { flag: '🇬🇦', label: { en: 'Gabon', fr: 'Gabon' }, km: '~620 km' },
                { flag: '🇨🇲', label: { en: 'Cameroon × 10', fr: 'Cameroun × 10' }, km: null },
              ].map((dest, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-background border border-border rounded-full px-3 py-1.5 text-xs">
                  <span className="text-sm leading-none">{dest.flag}</span>
                  <span className="font-semibold text-foreground">{L(dest.label)}</span>
                  {dest.km && <span className="text-muted-foreground flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{dest.km}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-sidebar py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.45 }}
              className="font-display font-bold text-2xl sm:text-3xl text-sidebar-foreground tracking-tight mb-2">
              {L({ en: 'Ready to Get Started?', fr: 'Prêt à Commencer ?' })}
            </motion.h2>
            <p className="text-sidebar-foreground/55 text-sm leading-relaxed max-w-sm">
              {L({ en: 'Get a tailored proposal from our logistics team.', fr: 'Obtenez une proposition personnalisée de notre équipe logistique.' })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
            <Button asChild size="lg" className="font-semibold text-sm w-full sm:w-auto justify-center shadow-lg shadow-primary/25">
              <Link href="/contact">
                {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="font-semibold text-sm bg-transparent border-sidebar-foreground/25 text-sidebar-foreground hover:bg-white/8 hover:border-sidebar-foreground/45 w-full sm:w-auto justify-center">
              <Link href="/quote">{L({ en: 'Request a Quote', fr: 'Demander un Devis' })}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
