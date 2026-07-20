'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Linkedin, Instagram, Youtube, Music2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function Footer() {
  const { L } = useLanguage();
  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
    staleTime: 5 * 60 * 1000,
  });

  const socialLinks = [
    { key: 'social_facebook',  icon: Facebook,  label: 'Facebook' },
    { key: 'social_twitter',   icon: Twitter,   label: 'Twitter / X' },
    { key: 'social_linkedin',  icon: Linkedin,  label: 'LinkedIn' },
    { key: 'social_instagram', icon: Instagram, label: 'Instagram' },
    { key: 'social_youtube',   icon: Youtube,   label: 'YouTube' },
    { key: 'social_tiktok',    icon: Music2,    label: 'TikTok' },
  ];

  const year = new Date().getFullYear();

  const quickLinks = [
    { href: '/',         en: 'Home',        fr: 'Accueil' },
    { href: '/about',    en: 'About Us',    fr: 'À Propos' },
    { href: '/services', en: 'Services',    fr: 'Services' },
    { href: '/products', en: 'Products',    fr: 'Produits' },
    { href: '/news',     en: 'News',        fr: 'Actualités' },
    { href: '/tracking', en: 'Tracking',    fr: 'Suivi' },
    { href: '/quote',    en: 'Get a Quote', fr: 'Devis' },
    { href: '/contact',  en: 'Contact',     fr: 'Contact' },
  ];

  const serviceLinks = [
    { en: 'Logistics & Transit',       fr: 'Logistique & Transit' },
    { en: 'Import & Export',           fr: 'Import & Export' },
    { en: 'Industrial Supply',         fr: 'Fourniture Industrielle' },
    { en: 'Supply Chain Consulting',   fr: "Conseil Chaîne d'Appro." },
    { en: 'Commercial Representation', fr: 'Représentation Commerciale' },
    { en: 'Phytosanitary Treatment',   fr: 'Traitement Phytosanitaire' },
    { en: 'Transportation',            fr: 'Transport' },
  ];

  const sectors = [
    { en: 'Oil & Gas',   fr: 'Pétrole & Gaz' },
    { en: 'Mining',      fr: 'Mines' },
    { en: 'Construction',fr: 'Construction' },
    { en: 'Agriculture', fr: 'Agriculture' },
    { en: 'Energy',      fr: 'Énergie' },
    { en: 'Forestry',    fr: 'Foresterie' },
  ];

  return (
    <footer className="bg-sidebar text-sidebar-foreground">

      {/* Primary accent rule */}
      <div className="h-0.5 bg-primary" />

      {/* Sector strip */}
      <div className="border-b border-sidebar-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap gap-2 items-center">
          <span className="text-sidebar-foreground/35 text-xs font-display font-semibold uppercase tracking-widest mr-2 flex-shrink-0">
            {L({ en: 'Sectors:', fr: 'Secteurs :' })}
          </span>
          {sectors.map((s) => (
            <span key={s.en}
              className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-xs font-medium rounded-sm">
              {L(s)}
            </span>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5" aria-label="LTIC SARL — Home">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">LT</span>
              </div>
              <span className="font-bold text-lg">
                LTIC <span className="text-primary">SARL</span>
              </span>
            </Link>
            <p className="text-sidebar-foreground/55 text-sm leading-relaxed mb-6 max-w-xs">
              {L({
                en: 'Multinational business solutions — logistics, industrial supply, and international trade across 30+ countries.',
                fr: "Solutions d'affaires multinationales — logistique, fournitures industrielles et commerce international dans plus de 30 pays.",
              })}
            </p>

            {/* Social links — boxed style */}
            <div className="flex items-center gap-2 flex-wrap">
              {socialLinks.map(({ key, icon: Icon, label }) => {
                const url = settings?.[key];
                if (!url) return null;
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center border border-sidebar-border/40 rounded-sm text-sidebar-foreground/35 hover:text-primary hover:border-primary/40 transition-colors duration-200"
                    aria-label={label}>
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
              {settings?.social_whatsapp && (
                <a href={settings.social_whatsapp} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center border border-sidebar-border/40 rounded-sm text-sidebar-foreground/35 hover:text-primary hover:border-primary/40 transition-colors duration-200"
                  aria-label="WhatsApp">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-xs uppercase tracking-widest mb-4 text-sidebar-foreground/80 pb-3 border-b border-sidebar-border/35">
              {L({ en: 'Quick Links', fr: 'Liens Rapides' })}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sidebar-foreground/50 hover:text-sidebar-foreground text-sm transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors duration-200 flex-shrink-0" />
                    {L(link)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-xs uppercase tracking-widest mb-4 text-sidebar-foreground/80 pb-3 border-b border-sidebar-border/35">
              {L({ en: 'Services', fr: 'Services' })}
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((item, i) => (
                <li key={i} className="text-sidebar-foreground/50 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
                  {L(item)}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-xs uppercase tracking-widest mb-4 text-sidebar-foreground/80 pb-3 border-b border-sidebar-border/35">
              {L({ en: 'Contact', fr: 'Contact' })}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sidebar-foreground/55 text-sm leading-snug">
                  {settings?.company_address || 'Douala, Cameroon / International Operations'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`tel:${settings?.company_phone || ''}`}
                  className="text-sidebar-foreground/55 text-sm hover:text-sidebar-foreground transition-colors">
                  {settings?.company_phone || '+237 6XX XXX XXX'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`mailto:${settings?.company_email || 'contact@lticsarl.com'}`}
                  className="text-sidebar-foreground/55 text-sm hover:text-sidebar-foreground transition-colors">
                  {settings?.company_email || 'contact@lticsarl.com'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sidebar-foreground/55 text-sm">
                  {settings?.company_website || 'www.lticsarl.com'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sidebar-foreground/35 text-xs">
            {L({ en: `© ${year} LTIC SARL. All rights reserved.`, fr: `© ${year} LTIC SARL. Tous droits réservés.` })}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy" className="text-sidebar-foreground/35 hover:text-sidebar-foreground/70 transition-colors">
              {L({ en: 'Privacy Policy', fr: 'Confidentialité' })}
            </Link>
            <Link href="/terms" className="text-sidebar-foreground/35 hover:text-sidebar-foreground/70 transition-colors">
              {L({ en: 'Terms', fr: 'Conditions' })}
            </Link>
            <Link href="/cookies" className="text-sidebar-foreground/35 hover:text-sidebar-foreground/70 transition-colors">
              {L({ en: 'Cookies', fr: 'Cookies' })}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
