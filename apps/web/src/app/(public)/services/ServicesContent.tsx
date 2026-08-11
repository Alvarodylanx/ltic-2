'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeInUp, fadeInLeft, fadeInRight, stagger, viewportOnce } from '@/components/motion/variants';

const services = [
  {
    en: 'Land Transport', fr: 'Transport Terrestre',
    headlineEn: 'Douala to Chad, RCA, Congo-Brazzaville, Gabon & All 10 Regions of Cameroon', headlineFr: 'Douala vers le Tchad, RCA, Congo-Brazzaville, Gabon et les 10 Régions du Cameroun',
    descEn: 'LTIC SARL operates dedicated road freight corridors linking Douala to major Central African capitals — N\'Djamena (Chad), Bangui (Central African Republic), Brazzaville (Congo), and Libreville (Gabon) — while covering all 10 administrative regions of Cameroon for domestic delivery. From port pickup to final destination, our fleet ensures every shipment arrives on time, fully documented and customs-cleared.',
    descFr: 'LTIC SARL opère des corridors de fret routier dédiés reliant Douala aux grandes capitales d\'Afrique Centrale — N\'Djamena (Tchad), Bangui (République Centrafricaine), Brazzaville (Congo) et Libreville (Gabon) — tout en couvrant les 10 régions administratives du Cameroun pour la livraison intérieure. De l\'enlèvement au port jusqu\'à la destination finale, notre flotte garantit chaque livraison dans les délais avec documentation complète.',
    image: '/images/transportation.jpg',
    bulletsEn: ['Douala – N\'Djamena (Chad): trans-border road freight corridor', 'Douala – Bangui (Central African Republic): commercial & humanitarian supply', 'Douala – Brazzaville (Congo-Brazzaville): cross-border cargo logistics', 'Douala – Libreville (Gabon): international road freight', 'All 10 regions of Cameroon: full domestic delivery coverage', 'Port pickup and door-to-door delivery from Port of Douala', 'Cargo handling, customs clearance and complete documentation'],
    bulletsFr: ['Douala – N\'Djamena (Tchad) : corridor de fret routier transfrontalier', 'Douala – Bangui (République Centrafricaine) : approvisionnement commercial et humanitaire', 'Douala – Brazzaville (Congo-Brazzaville) : logistique cargo transfrontalière', 'Douala – Libreville (Gabon) : fret routier international', 'Les 10 régions du Cameroun : couverture nationale complète', 'Enlèvement au port et livraison porte-à-porte depuis le Port de Douala', 'Manutention, dédouanement et documentation complète'],
  },
  {
    en: 'Chemical Product Manufacturing', fr: 'Production de Produits Chimiques',
    headlineEn: 'ECOKLIN — Our Own Cleaning & Hygiene Brand', headlineFr: 'ECOKLIN — Notre Marque de Produits de Nettoyage',
    descEn: 'LTIC SARL manufactures a complete range of home care, personal care, and industrial sanitation products under the ECOKLIN brand at our factory in PK13, Douala. All products are eco-friendly and biodegradable.',
    descFr: 'LTIC SARL fabrique une gamme complète de produits ménagers, soins personnels et désinfectants industriels sous la marque ECOKLIN, dans notre usine à PK13, Douala. Tous les produits sont écologiques et biodégradables.',
    image: '/images/ecoklin-factory.jpg',
    bulletsEn: ['Bleach (Eau de Javel)', 'Industrial Degreaser (Dégraissant Industriel)', 'Descaler (Détartrant)', 'Tile Liquid Soap (Savon Liquide Carreaux)', 'Laundry Liquid Soap (Savon Liquide Lessive)', 'Dish Washing Liquid (Savon Liquide Vaisselle)', 'Muriatic Acid and other industrial chemicals'],
    bulletsFr: ['Eau de Javel', 'Dégraissant Industriel', 'Détartrant', 'Savon Liquide pour Carreaux', 'Savon Liquide pour Lessive', 'Savon Liquide pour Vaisselle', 'Acide Muriatique et autres produits chimiques industriels'],
  },
  {
    en: 'Lubricant Sales & Distribution', fr: 'Commercialisation des Lubrifiants',
    headlineEn: 'Authorized Distributor — Total, Shell & Leading Brands', headlineFr: 'Distributeur Agréé — Total, Shell et Grandes Marques',
    descEn: 'LTIC SARL distributes premium lubricants for motors, vessels, and industrial equipment. We supply Total, Shell, and other certified brands across Central Africa and beyond — exclusively motor and vessel lubricants, not food-grade oils.',
    descFr: 'LTIC SARL distribue des lubrifiants premium pour moteurs, navires et équipements industriels. Nous fournissons Total, Shell et autres marques certifiées en Afrique Centrale et au-delà — exclusivement des lubrifiants moteur et marine.',
    image: '/images/lubricants-warehouse.jpg',
    bulletsEn: ['Engine oils and motor lubricants (Total, Shell)', 'Marine and vessel lubricants', 'Hydraulic oils for industrial machinery', 'Gear oils and transmission fluids', 'Greases and specialty lubricants', 'Bulk and packaged supply available'],
    bulletsFr: ['Huiles moteur et lubrifiants (Total, Shell)', 'Lubrifiants marins et navires', 'Huiles hydrauliques pour machines industrielles', 'Huiles de boîte de vitesses et fluides de transmission', 'Graisses et lubrifiants spéciaux', 'Fourniture en vrac et conditionnée disponible'],
  },
  {
    en: 'Offshore Marine Services', fr: 'Services Offshore & Maritimes',
    headlineEn: 'General Ship Chandling & Maritime Supply', headlineFr: 'Avitaillement & Fournitures Maritimes',
    descEn: 'LTIC SARL operates as a general ship supplier and maritime logistics provider, supporting vessels across African ports. We handle ship chandling, spare parts procurement, chemical supply, and sludging services in the Gulf of Guinea.',
    descFr: 'LTIC SARL opère comme fournisseur général de navires et prestataire logistique maritime, soutenant les navires dans les ports africains. Avitaillement, fourniture de pièces détachées, produits chimiques et services de boues dans le Golfe de Guinée.',
    image: '/images/offshore-port-supply.jpg',
    bulletsEn: ['General ship chandling and provisions', 'Spare parts procurement for vessels', 'Sludging and waste management services', 'Chemical and lubricant supply for ships', 'Bunkering support and coordination', 'Gulf of Guinea port operations'],
    bulletsFr: ['Avitaillement général et provisions des navires', 'Approvisionnement en pièces détachées', 'Services de boues et gestion des déchets', 'Fourniture de produits chimiques et lubrifiants', 'Support et coordination de bunkering', 'Opérations portuaires dans le Golfe de Guinée'],
  },
  {
    en: 'Logistics Staff Training', fr: 'Formation du Personnel Logistique',
    headlineEn: 'Build Your Team\'s Logistics Expertise', headlineFr: 'Développez l\'Expertise Logistique de Votre Équipe',
    descEn: 'LTIC SARL provides professional logistics training programs for personnel in the maritime, customs, transit, and supply chain sectors. Practical, hands-on training delivered by experienced industry professionals.',
    descFr: 'LTIC SARL propose des programmes de formation professionnelle en logistique pour le personnel des secteurs maritime, douanier, transit et chaîne d\'approvisionnement. Formation pratique dispensée par des professionnels expérimentés.',
    image: '/images/logistics-training.jpg',
    bulletsEn: ['Freight forwarding fundamentals', 'Customs procedures and documentation', 'Maritime logistics operations', 'Supply chain management', 'Port and terminal operations', 'Safety and compliance training'],
    bulletsFr: ['Fondamentaux du commissionnement de fret', 'Procédures douanières et documentation', 'Opérations logistiques maritimes', 'Gestion de la chaîne d\'approvisionnement', 'Opérations portuaires et terminales', 'Formation sécurité et conformité'],
  },
  {
    en: 'Commercial Representation', fr: 'Représentation Commerciale',
    headlineEn: 'Your Gateway to the Cameroonian Market', headlineFr: 'Votre Porte d\'Entrée sur le Marché Camerounais',
    descEn: 'LTIC SARL represents international brands and companies seeking to enter the Cameroonian and Central African markets. We provide local market intelligence, distribution networks, and on-the-ground business development support.',
    descFr: 'LTIC SARL représente des marques et entreprises internationales souhaitant s\'implanter sur les marchés camerounais et centrafricains. Nous offrons une connaissance locale du marché, des réseaux de distribution et un appui commercial.',
    image: '/images/commercial-representation.jpeg',
    bulletsEn: ['Brand representation across Central Africa and beyond', 'Distribution channel development', 'Market entry strategy and advisory', 'Joint venture and partnership facilitation', 'Local regulatory and compliance support', 'Trade mission coordination'],
    bulletsFr: ['Représentation de marque en Afrique Centrale et au-delà', 'Développement des canaux de distribution', 'Stratégie et conseil pour l\'entrée sur le marché', 'Facilitation de coentreprises et partenariats', 'Support réglementaire et conformité locale', 'Coordination de missions commerciales'],
  },
  {
    en: 'Vessel Maintenance at Sea', fr: 'Maintenance des Navires en Haute Mer',
    headlineEn: 'On-Site Technical Support Wherever Your Vessel Is', headlineFr: 'Support Technique sur Site où que soit Votre Navire',
    descEn: 'LTIC SARL provides professional vessel maintenance and technical support for ships operating in African waters. Our teams deploy on-site to perform inspections, maintenance operations, and emergency interventions at sea.',
    descFr: 'LTIC SARL assure la maintenance professionnelle des navires et le support technique pour les bateaux opérant dans les eaux africaines. Nos équipes se déploient sur site pour les inspections, opérations de maintenance et interventions d\'urgence en mer.',
    image: '/images/service-vessel-maintenance.jpg',
    bulletsEn: ['On-site maintenance and inspection at sea', 'Hull and machinery technical support', 'Spare parts supply and logistics', 'Crew coordination and support', 'Emergency repair intervention', 'Compliance and certification support'],
    bulletsFr: ['Maintenance et inspection sur site en mer', 'Support technique coque et machines', 'Fourniture de pièces détachées et logistique', 'Coordination et soutien de l\'équipage', 'Intervention d\'urgence pour réparations', 'Support conformité et certification'],
  },
];

export default function ServicesPage() {
  const { L } = useLanguage();

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative h-[36vh] min-h-[260px] overflow-hidden bg-sidebar flex items-center">
        <Image src="/images/banner-services.jpg" alt="" fill className="object-cover object-center opacity-30" priority />
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
              {L({ en: 'Our Services', fr: 'Nos Services' })}
            </span>
          </motion.div>
          <h1 className="font-display font-extrabold text-section text-sidebar-foreground leading-[0.88] tracking-[-0.02em] mb-3">
            {L({ en: 'Seven Services, One Company.', fr: 'Sept Services, Une Seule Entreprise.' }).split(' ').map((word, wi) => (
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
            {L({ en: 'From land transport and chemical manufacturing to offshore marine, lubricant distribution, logistics training, commercial representation, and vessel maintenance.', fr: 'Du transport terrestre et la fabrication de produits chimiques aux services offshore, lubrifiants, formation logistique, représentation commerciale et maintenance des navires.' })}
          </motion.p>
        </div>

      </section>

      {/* ── DETAILED SERVICE SECTIONS ────────────────────────────────────────── */}
      {services.map((svc, index) => {
        const isEven = index % 2 === 0;
        return (
          <section key={svc.en}
            className={`py-20 lg:py-28 border-b border-border ${isEven ? 'bg-muted/50' : 'bg-background'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  variants={isEven ? fadeInLeft : fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
                  className={isEven ? '' : 'lg:order-2'}>
                  <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-3">
                    {L({ en: svc.en, fr: svc.fr })}
                  </p>
                  <h2 className="font-bold text-2xl sm:text-3xl tracking-tight mb-4">
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

                <motion.div
                  variants={isEven ? fadeInRight : fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}
                  className={`relative h-72 lg:h-[420px] rounded-2xl overflow-hidden ${isEven ? '' : 'lg:order-1'}`}>
                  <Image src={svc.image} alt={L({ en: svc.en, fr: svc.fr })} fill
                    className="object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── TRANSPORT COVERAGE MAP ──────────────────────────────────────────── */}
      <section className="bg-sidebar py-16 sm:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="text-center mb-10">
            <p className="text-primary font-bold text-[11px] uppercase tracking-[0.32em] mb-2 flex items-center justify-center gap-2.5">
              <span className="w-5 h-px bg-primary" />
              {L({ en: 'Road Freight Coverage', fr: 'Couverture Fret Routier' })}
              <span className="w-5 h-px bg-primary" />
            </p>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight text-sidebar-foreground">
              {L({ en: 'Where We Deliver', fr: 'Là Où Nous Livrons' })}
            </h2>
            <p className="text-sidebar-foreground/55 text-sm mt-2 max-w-lg mx-auto leading-relaxed">
              {L({ en: 'International corridors from the Port of Douala to four Central African countries, plus full domestic coverage across Cameroon.', fr: 'Corridors internationaux depuis le Port de Douala vers quatre pays d\'Afrique Centrale, plus une couverture nationale complète au Cameroun.' })}
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { flag: '🇹🇩', country: { en: 'Chad',                      fr: 'Tchad' },                       route: 'Douala – N\'Djamena', km: '~1 900 km', type: { en: 'International', fr: 'International' } },
              { flag: '🇨🇫', country: { en: 'Central African Republic',   fr: 'Rép. Centrafricaine' },          route: 'Douala – Bangui',     km: '~1 500 km', type: { en: 'International', fr: 'International' } },
              { flag: '🇨🇬', country: { en: 'Congo-Brazzaville',          fr: 'Congo-Brazzaville' },            route: 'Douala – Brazzaville', km: '~900 km',   type: { en: 'International', fr: 'International' } },
              { flag: '🇬🇦', country: { en: 'Gabon',                      fr: 'Gabon' },                        route: 'Douala – Libreville',  km: '~620 km',   type: { en: 'International', fr: 'International' } },
              { flag: '🇨🇲', country: { en: 'Cameroon',                   fr: 'Cameroun' },                     route: { en: 'All 10 Regions', fr: '10 Régions' }, km: null, type: { en: 'Domestic',      fr: 'National' } },
            ].map((dest, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 40, scale: 0.92 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 90, damping: 20, delay: i * 0.07 } } }}
                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-2xl p-5 transition-all duration-300 cursor-default">
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="text-3xl mb-3 leading-none">{dest.flag}</div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
                  {L(dest.type)}
                </p>
                <h3 className="font-bold text-sidebar-foreground text-sm sm:text-base leading-tight mb-2">
                  {L(dest.country)}
                </h3>
                <div className="flex items-center gap-1.5 text-sidebar-foreground/50 text-[11px] mb-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span>{typeof dest.route === 'string' ? dest.route : L(dest.route)}</span>
                </div>
                {dest.km && (
                  <span className="inline-block text-[10px] font-semibold bg-primary/15 text-primary rounded-full px-2.5 py-0.5 mt-1">
                    {dest.km}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="mt-8 text-center">
            <p className="text-sidebar-foreground/40 text-xs">
              {L({ en: 'All routes include customs clearance, cargo tracking and full documentation.', fr: 'Tous les corridors incluent le dédouanement, le suivi de la cargaison et la documentation complète.' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="bg-foreground py-3 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <h2 className="font-bold text-2xl sm:text-3xl text-sidebar-foreground tracking-tight">
              {L({ en: 'Ready to Get Started?', fr: 'Prêt à Commencer ?' })}
            </h2>
            <p className="text-sidebar-foreground/60 text-sm mt-2">
              {L({ en: 'Discuss your requirements and get a tailored proposal.', fr: 'Discutez de vos besoins et obtenez une proposition personnalisée.' })}
            </p>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" whileInView="show" viewport={viewportOnce}
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto sm:flex-shrink-0">
            <Button asChild size="lg" className="font-semibold text-sm w-full sm:w-auto justify-center">
              <Link href="/contact">
                {L({ en: 'Contact Our Team', fr: 'Contacter Notre Équipe' })}
                <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="font-semibold text-sm bg-transparent border-sidebar-foreground/30 text-sidebar-foreground hover:bg-white/10 hover:text-sidebar-foreground hover:border-sidebar-foreground/50 w-full sm:w-auto justify-center">
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
