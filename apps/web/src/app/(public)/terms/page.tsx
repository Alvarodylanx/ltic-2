'use client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { L } = useLanguage();
  return (
    <>
      <section className="bg-sidebar py-3 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-sidebar-foreground">{L({ en: 'Terms & Conditions', fr: 'Conditions Générales d\'Utilisation' })}</h1>
          <p className="text-sidebar-foreground/70 mt-2 text-sm">{L({ en: 'Last updated: May 2026', fr: 'Dernière mise à jour: Mai 2026' })}</p>
        </div>
      </section>
      <section className="bg-background py-3 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 prose prose-slate">
          <h2>{L({ en: '1. Acceptance of Terms', fr: '1. Acceptation des Conditions' })}</h2>
          <p>{L({ en: 'By accessing or using the LTIC SARL website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.', fr: 'En accédant ou en utilisant le site web et les services de LTIC SARL, vous acceptez d\'être lié par ces Conditions Générales.' })}</p>
          <h2>{L({ en: '2. Services', fr: '2. Services' })}</h2>
          <p>{L({ en: 'LTIC SARL provides logistics, industrial supply, international trade facilitation, and consulting services. All services are subject to separate service agreements and applicable law.', fr: 'LTIC SARL fournit des services de logistique, de fournitures industrielles, de facilitation du commerce international et de conseil. Tous les services sont soumis à des accords de service séparés et aux lois applicables.' })}</p>
          <h2>{L({ en: '3. Intellectual Property', fr: '3. Propriété Intellectuelle' })}</h2>
          <p>{L({ en: 'All content on this website, including text, images, logos, and trademarks, is the property of LTIC SARL and is protected by applicable intellectual property laws.', fr: 'Tout le contenu de ce site web, y compris les textes, images, logos et marques déposées, est la propriété de LTIC SARL et est protégé par les lois applicables sur la propriété intellectuelle.' })}</p>
          <h2>{L({ en: '4. Limitation of Liability', fr: '4. Limitation de Responsabilité' })}</h2>
          <p>{L({ en: 'LTIC SARL shall not be liable for indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question.', fr: 'LTIC SARL ne sera pas responsable des dommages indirects, accessoires ou consécutifs résultant de l\'utilisation de nos services.' })}</p>
          <h2>{L({ en: '5. Governing Law', fr: '5. Droit Applicable' })}</h2>
          <p>{L({ en: 'These Terms are governed by the laws of Cameroon and applicable international trade law. Any disputes shall be resolved through arbitration in Douala, Cameroon.', fr: 'Ces Conditions sont régies par le droit camerounais et le droit commercial international applicable. Tout litige sera résolu par arbitrage à Douala, Cameroun.' })}</p>
          <h2>{L({ en: '6. Changes to Terms', fr: '6. Modifications des Conditions' })}</h2>
          <p>{L({ en: 'We reserve the right to modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the updated Terms.', fr: 'Nous nous réservons le droit de modifier ces Conditions à tout moment. L\'utilisation continue de nos services après les modifications constitue une acceptation des Conditions mises à jour.' })}</p>
        </div>
      </section>
    </>
  );
}

