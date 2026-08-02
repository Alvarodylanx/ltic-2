'use client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { L } = useLanguage();
  return (
    <>
      <section className="bg-sidebar py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-sidebar-foreground">{L({ en: 'Privacy Policy', fr: 'Politique de Confidentialité' })}</h1>
          <p className="text-sidebar-foreground/70 mt-2 text-sm">{L({ en: 'Last updated: May 2026', fr: 'Dernière mise à jour: Mai 2026' })}</p>
        </div>
      </section>
      <section className="bg-background py-3 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 prose prose-slate">
          <h2>{L({ en: '1. Data Collection', fr: '1. Collecte de Données' })}</h2>
          <p>{L({ en: 'LTIC SARL collects personal data you voluntarily provide when contacting us, requesting quotes, or using our services. This includes name, email address, phone number, company name, and communication content.', fr: 'LTIC SARL collecte les données personnelles que vous fournissez volontairement lorsque vous nous contactez, demandez des devis ou utilisez nos services.' })}</p>
          <h2>{L({ en: '2. How We Use Your Data', fr: '2. Comment Nous Utilisons Vos Données' })}</h2>
          <p>{L({ en: 'We use your data to respond to inquiries, process service requests, provide updates on orders and shipments, send relevant communications, and improve our services. We do not sell your personal data to third parties.', fr: 'Nous utilisons vos données pour répondre aux demandes, traiter les demandes de services, fournir des mises à jour et améliorer nos services. Nous ne vendons pas vos données personnelles à des tiers.' })}</p>
          <h2>{L({ en: '3. Data Sharing', fr: '3. Partage des Données' })}</h2>
          <p>{L({ en: 'We may share your data with logistics partners, customs authorities, and service providers strictly necessary to fulfill your service requests. All partners are bound by confidentiality agreements.', fr: 'Nous pouvons partager vos données avec des partenaires logistiques, des autorités douanières et des prestataires strictement nécessaires à l\'exécution de vos demandes de service.' })}</p>
          <h2>{L({ en: '4. Cookies', fr: '4. Cookies' })}</h2>
          <p>{L({ en: 'We use cookies to enhance your browsing experience. See our Cookie Policy for full details.', fr: 'Nous utilisons des cookies pour améliorer votre expérience de navigation. Consultez notre Politique de Cookies pour plus de détails.' })}</p>
          <h2>{L({ en: '5. Your Rights (GDPR)', fr: '5. Vos Droits (RGPD)' })}</h2>
          <p>{L({ en: 'You have the right to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact us at contact@lticsarl.com.', fr: 'Vous avez le droit d\'accéder, corriger, supprimer ou restreindre le traitement de vos données personnelles. Pour exercer ces droits, contactez-nous à contact@lticsarl.com.' })}</p>
          <h2>{L({ en: '6. Contact', fr: '6. Contact' })}</h2>
          <p>{L({ en: 'For privacy-related inquiries, please contact our Data Protection Officer at contact@lticsarl.com.', fr: 'Pour toute question relative à la confidentialité, veuillez contacter notre Délégué à la Protection des Données à contact@lticsarl.com.' })}</p>
        </div>
      </section>
    </>
  );
}

