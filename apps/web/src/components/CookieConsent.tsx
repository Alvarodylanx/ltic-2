'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ChevronDown, ChevronUp, Cookie, X,
  CheckCircle2, XCircle, Settings2, Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  COOKIE_CATEGORIES, CookieCategory,
  acceptAll, rejectAll, saveConsent,
  hasDecided, getConsent, withdrawConsent,
} from '@/lib/cookieService';

/* ─── small toggle ──────────────────────────────────────────────── */
function Toggle({
  enabled, onChange, disabled,
}: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
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
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200
          ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

/* ─── category accordion row ───────────────────────────────────── */
function CategoryRow({
  cat, enabled, onToggle, L,
}: {
  cat: typeof COOKIE_CATEGORIES[number];
  enabled: boolean;
  onToggle: (id: CookieCategory, val: boolean) => void;
  L: (o: { en: string; fr: string }) => string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-left flex-1 min-w-0"
        >
          {open ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
          <div>
            <span className="font-semibold text-sm">{L({ en: cat.nameEn, fr: cat.nameFr })}</span>
            {cat.required && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                {L({ en: 'Required', fr: 'Requis' })}
              </span>
            )}
          </div>
        </button>
        <Toggle enabled={enabled} onChange={(v) => onToggle(cat.id, v)} disabled={cat.required} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {L({ en: cat.descEn, fr: cat.descFr })}
              </p>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                  {L({ en: 'Cookies used', fr: 'Cookies utilisés' })}
                </p>
                {cat.cookies.map((c) => (
                  <div key={c.name} className="flex items-start gap-2 text-xs bg-background border rounded-lg px-3 py-2">
                    <code className="font-mono font-semibold text-primary min-w-[120px]">{c.name}</code>
                    <span className="text-muted-foreground flex-1">{c.purpose}</span>
                    <span className="text-muted-foreground/70 whitespace-nowrap">{c.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── preferences modal ────────────────────────────────────────── */
function PreferencesModal({
  onClose, onSave, L,
}: {
  onClose: () => void;
  onSave: (cats: Record<CookieCategory, boolean>) => void;
  L: (o: { en: string; fr: string }) => string;
}) {
  const existing = getConsent();
  const [cats, setCats] = useState<Record<CookieCategory, boolean>>({
    essential: true,
    functional: existing?.categories.functional ?? true,
    analytics: existing?.categories.analytics ?? false,
    marketing: existing?.categories.marketing ?? false,
  });

  const toggle = (id: CookieCategory, val: boolean) =>
    setCats((prev) => ({ ...prev, [id]: val }));

  const allOn = COOKIE_CATEGORIES.every((c) => cats[c.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="relative z-10 w-full sm:max-w-lg bg-background border rounded-none sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-base">{L({ en: 'Cookie Preferences', fr: 'Préférences Cookies' })}</h2>
              <p className="text-xs text-muted-foreground">{L({ en: 'Manage your consent by category', fr: 'Gérez votre consentement par catégorie' })}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">
            <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-primary" />
            <span>{L({ en: 'Essential cookies are always active and cannot be disabled. They are required for basic site functionality.', fr: 'Les cookies essentiels sont toujours actifs. Ils sont nécessaires au fonctionnement de base du site.' })}</span>
          </div>

          {COOKIE_CATEGORIES.map((cat) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              enabled={cats[cat.id]}
              onToggle={toggle}
              L={L}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t space-y-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setCats({ essential: true, functional: false, analytics: false, marketing: false });
              }}
            >
              {L({ en: 'Reject All', fr: 'Tout Refuser' })}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setCats({ essential: true, functional: true, analytics: true, marketing: true });
              }}
            >
              {L({ en: 'Accept All', fr: 'Tout Accepter' })}
            </Button>
          </div>
          <Button className="w-full" onClick={() => onSave(cats)}>
            {L({ en: 'Save My Preferences', fr: 'Enregistrer mes préférences' })}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── main banner ──────────────────────────────────────────────── */
export function CookieConsent() {
  const { L } = useLanguage();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth') || pathname?.startsWith('/admin');
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFloating, setShowFloating] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const decided = hasDecided();
    // Never show the full banner on login / admin pages — it covers interactive elements
    setShowBanner(!decided && !isAuthPage);
    setShowFloating(decided);
  }, [isAuthPage]);

  const handleAcceptAll = () => {
    acceptAll();
    setShowBanner(false);
    setShowFloating(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRejectAll = () => {
    rejectAll();
    setShowBanner(false);
    setShowFloating(true);
  };

  const handleSavePreferences = useCallback((cats: Record<CookieCategory, boolean>) => {
    saveConsent(cats);
    setShowModal(false);
    setShowBanner(false);
    setShowFloating(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  const handleOpenModal = () => setShowModal(true);

  return (
    <>
      {/* ── Banner ── */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          >
            <div className="max-w-4xl mx-auto bg-background border rounded-2xl shadow-2xl overflow-hidden">
              {/* Top accent */}
              <div className="h-1 bg-gradient-to-r from-primary via-blue-400 to-primary" />

              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Cookie className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{L({ en: 'We value your privacy', fr: 'Nous respectons votre vie privée' })}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                      {L({
                        en: 'LTIC SARL uses cookies to enhance your experience, analyse site traffic, and personalise content. You can choose which categories to allow.',
                        fr: 'LTIC SARL utilise des cookies pour améliorer votre expérience, analyser le trafic du site et personnaliser le contenu. Vous pouvez choisir les catégories à autoriser.',
                      })}
                    </p>
                  </div>
                </div>

                {/* Category badges preview */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {COOKIE_CATEGORIES.map((cat) => (
                    <span
                      key={cat.id}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                        cat.required
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-muted text-muted-foreground border-transparent'
                      }`}
                    >
                      {L({ en: cat.nameEn, fr: cat.nameFr })}
                      {cat.required && ' ✓'}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={handleAcceptAll} size="sm" className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {L({ en: 'Accept All', fr: 'Tout Accepter' })}
                  </Button>
                  <Button onClick={handleRejectAll} variant="outline" size="sm" className="flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    {L({ en: 'Reject All', fr: 'Tout Refuser' })}
                  </Button>
                  <Button onClick={handleOpenModal} variant="ghost" size="sm" className="flex items-center gap-1.5">
                    <Settings2 className="h-3.5 w-3.5" />
                    {L({ en: 'Manage Preferences', fr: 'Gérer les préférences' })}
                  </Button>
                  <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors ml-auto hidden sm:block">
                    {L({ en: 'Cookie Policy', fr: 'Politique Cookies' })}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating cookie settings button ── */}
      <AnimatePresence>
        {showFloating && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.5 }}
            className="fixed bottom-6 left-6 z-40"
          >
            {/* Saved confirmation */}
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="absolute left-12 bottom-0 whitespace-nowrap bg-foreground text-background text-xs px-3 py-1.5 rounded-lg shadow-lg"
                >
                  {L({ en: 'Preferences saved!', fr: 'Préférences enregistrées!' })}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowModal(true)}
              title={L({ en: 'Cookie settings', fr: 'Paramètres cookies' })}
              className="group w-10 h-10 bg-background border-2 border-border hover:border-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <Cookie className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preferences modal ── */}
      <AnimatePresence>
        {showModal && (
          <PreferencesModal
            onClose={() => setShowModal(false)}
            onSave={handleSavePreferences}
            L={L}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── hook for consuming consent in other components ────────────── */
export { isAllowed } from '@/lib/cookieService';
