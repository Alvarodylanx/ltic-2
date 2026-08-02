'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Cookie, Settings2, CheckCircle2, XCircle,
  RefreshCw, Clock, Info, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  COOKIE_CATEGORIES, CookieCategory,
  getConsent, acceptAll, rejectAll, saveConsent, withdrawConsent,
  getConsentSummary, hasDecided,
} from '@/lib/cookieService';

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${enabled ? 'bg-primary' : 'bg-muted-foreground/30'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function CookiesPage() {
  const { L } = useLanguage();
  const [cats, setCats] = useState<Record<CookieCategory, boolean>>({
    essential: true, functional: true, analytics: false, marketing: false,
  });
  const [decided, setDecided] = useState(false);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const c = getConsent();
    if (c) {
      setCats(c.categories);
      setDecided(c.decided);
      setTimestamp(c.timestamp);
    }
  }, []);

  const toggle = (id: CookieCategory, val: boolean) =>
    setCats((prev) => ({ ...prev, [id]: val }));

  const handleSave = () => {
    saveConsent(cats);
    setDecided(true);
    setTimestamp(new Date().toISOString());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setCats({ essential: true, functional: true, analytics: true, marketing: true });
    setDecided(true);
    setTimestamp(new Date().toISOString());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRejectAll = () => {
    rejectAll();
    setCats({ essential: true, functional: false, analytics: false, marketing: false });
    setDecided(true);
    setTimestamp(new Date().toISOString());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleWithdraw = () => {
    withdrawConsent();
    setCats({ essential: true, functional: true, analytics: false, marketing: false });
    setDecided(false);
    setTimestamp(null);
  };

  const sections = [
    {
      titleEn: '1. What Are Cookies?',
      titleFr: '1. Que sont les cookies ?',
      bodyEn: 'Cookies are small text files stored on your device when you visit a website. They allow the site to remember information about your visit — such as your language preference or login status — making your next visit easier and the site more useful to you.',
      bodyFr: 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils permettent au site de mémoriser des informations sur votre visite — telles que votre préférence de langue ou votre statut de connexion — rendant votre prochaine visite plus facile et le site plus utile pour vous.',
    },
    {
      titleEn: '2. How LTIC SARL Uses Cookies',
      titleFr: '2. Comment LTIC SARL utilise les cookies',
      bodyEn: 'LTIC SARL uses cookies solely to operate the website, remember your preferences, and understand how users navigate our platform. We do not sell or share your data with third-party advertisers. All data collected is processed in accordance with applicable data protection legislation.',
      bodyFr: 'LTIC SARL utilise les cookies uniquement pour faire fonctionner le site web, mémoriser vos préférences et comprendre comment les utilisateurs naviguent sur notre plateforme. Nous ne vendons ni ne partageons vos données avec des annonceurs tiers.',
    },
    {
      titleEn: '3. Your Rights',
      titleFr: '3. Vos droits',
      bodyEn: 'You have the right to accept, reject, or customise cookie categories at any time. You may also withdraw your consent entirely. Withdrawing consent does not affect the lawfulness of processing based on consent before withdrawal. Essential cookies cannot be disabled as they are strictly necessary for the site to function.',
      bodyFr: 'Vous avez le droit d\'accepter, de refuser ou de personnaliser les catégories de cookies à tout moment. Vous pouvez également retirer entièrement votre consentement. Les cookies essentiels ne peuvent pas être désactivés car ils sont strictement nécessaires au fonctionnement du site.',
    },
    {
      titleEn: '4. Browser Controls',
      titleFr: '4. Contrôles du navigateur',
      bodyEn: 'Most browsers allow you to block or delete cookies through their settings. However, blocking all cookies may break site functionality. Refer to your browser\'s help documentation for specific instructions on managing cookies.',
      bodyFr: 'La plupart des navigateurs vous permettent de bloquer ou de supprimer les cookies via leurs paramètres. Cependant, le blocage de tous les cookies peut perturber le fonctionnement du site.',
    },
    {
      titleEn: '5. Policy Updates',
      titleFr: '5. Mises à jour de la politique',
      bodyEn: 'We may update this Cookie Policy from time to time. When we do, we will revise the "last updated" date and, where appropriate, notify you via the cookie banner. Continued use of the site after changes constitutes acceptance of the updated policy.',
      bodyFr: 'Nous pouvons mettre à jour cette politique de cookies de temps à autre. Lorsque nous le faisons, nous révisons la date de "dernière mise à jour" et, le cas échéant, vous en informons via la bannière de cookies.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-sidebar py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-8 right-8 w-48 h-48 border border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Cookie className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-sidebar-foreground">{L({ en: 'Cookie Policy', fr: 'Politique de Cookies' })}</h1>
            <p className="text-sidebar-foreground/60 mt-2 text-sm">
              {L({ en: 'Last updated: May 2026 — Version 1.1', fr: 'Dernière mise à jour : Mai 2026 — Version 1.1' })}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left: policy text ── */}
            <div className="lg:col-span-2 space-y-8">
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <h2 className="text-lg font-bold mb-2">{L({ en: s.titleEn, fr: s.titleFr })}</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{L({ en: s.bodyEn, fr: s.bodyFr })}</p>
                </motion.div>
              ))}

              {/* Cookie types detail table */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-lg font-bold mb-4">{L({ en: 'Cookie Details by Category', fr: 'Détails des cookies par catégorie' })}</h2>
                <div className="space-y-4">
                  {COOKIE_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="border rounded-xl overflow-hidden">
                      <div className="px-4 py-3 bg-muted/30 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">{L({ en: cat.nameEn, fr: cat.nameFr })}</span>
                        {cat.required && (
                          <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            {L({ en: 'Always active', fr: 'Toujours actif' })}
                          </span>
                        )}
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-xs text-muted-foreground mb-3">{L({ en: cat.descEn, fr: cat.descFr })}</p>
                        <div className="grid gap-1.5">
                          {cat.cookies.map((c) => (
                            <div key={c.name} className="grid grid-cols-3 gap-2 text-xs bg-background border rounded-lg px-3 py-2">
                              <code className="font-mono font-semibold text-primary truncate">{c.name}</code>
                              <span className="text-muted-foreground col-span-1">{c.purpose}</span>
                              <span className="text-muted-foreground/70 text-right">{c.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── Right: live consent manager ── */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24 space-y-4"
              >
                {/* Status card */}
                <div className={`rounded-2xl border p-4 ${decided ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {decided
                      ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                      : <Info className="h-4 w-4 text-amber-600" />}
                    <span className={`text-sm font-semibold ${decided ? 'text-green-800' : 'text-amber-800'}`}>
                      {decided
                        ? L({ en: 'Consent recorded', fr: 'Consentement enregistré' })
                        : L({ en: 'No consent recorded', fr: 'Aucun consentement enregistré' })}
                    </span>
                  </div>
                  {timestamp && (
                    <p className={`text-xs flex items-center gap-1 ${decided ? 'text-green-600' : 'text-amber-600'}`}>
                      <Clock className="h-3 w-3" />
                      {new Date(timestamp).toLocaleString()}
                    </p>
                  )}
                  {decided && (
                    <p className="text-xs text-green-700 mt-1">
                      {L({ en: 'Active:', fr: 'Actifs :' })} {getConsentSummary()}
                    </p>
                  )}
                </div>

                {/* Manage consent */}
                <div className="bg-card border rounded-2xl p-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary" />
                    {L({ en: 'Manage Consent', fr: 'Gérer le consentement' })}
                  </h3>

                  <div className="space-y-3 mb-4">
                    {COOKIE_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold">{L({ en: cat.nameEn, fr: cat.nameFr })}</p>
                          {cat.required && <p className="text-[10px] text-muted-foreground">{L({ en: 'Required', fr: 'Requis' })}</p>}
                        </div>
                        <Toggle enabled={cats[cat.id]} onChange={(v) => toggle(cat.id, v)} disabled={cat.required} />
                      </div>
                    ))}
                  </div>

                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 mb-3"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {L({ en: 'Saved successfully!', fr: 'Enregistré avec succès!' })}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Button onClick={handleSave} size="sm" className="w-full">
                      {L({ en: 'Save Preferences', fr: 'Enregistrer' })}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={handleAcceptAll} variant="outline" size="sm" className="text-xs">
                        {L({ en: 'Accept All', fr: 'Tout accepter' })}
                      </Button>
                      <Button onClick={handleRejectAll} variant="outline" size="sm" className="text-xs">
                        {L({ en: 'Reject All', fr: 'Tout refuser' })}
                      </Button>
                    </div>
                    {decided && (
                      <button
                        onClick={handleWithdraw}
                        className="w-full text-xs text-muted-foreground hover:text-destructive flex items-center justify-center gap-1 py-1 transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        {L({ en: 'Withdraw all consent', fr: 'Retirer tout consentement' })}
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-muted/50 border rounded-2xl p-4 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">{L({ en: 'Questions?', fr: 'Questions?' })}</p>
                  <p>{L({ en: 'Contact our data protection team at', fr: 'Contactez notre équipe de protection des données à' })}</p>
                  <a href="mailto:privacy@ltic-sarl.com" className="text-primary font-medium hover:underline">privacy@ltic-sarl.com</a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

