'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Loader2, Package, AlertCircle,
  MapPin, Calendar, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ── Status config ──────────────────────────────────────────────────────────────

const STEPS = [
  { key: 'processing',      en: 'Processing', fr: 'Traitement' },
  { key: 'customs-cleared', en: 'Customs',    fr: 'Douane'     },
  { key: 'in-transit',      en: 'In Transit', fr: 'Transit'    },
  { key: 'delivered',       en: 'Delivered',  fr: 'Livré'      },
];

const STEP_INDEX: Record<string, number> = {
  processing: 0, 'customs-cleared': 1, shipped: 2, 'in-transit': 2, delivered: 3,
};

const STATUS_BADGE: Record<string, string> = {
  processing:        'bg-blue-500/10 text-blue-500 border-blue-500/25',
  'customs-cleared': 'bg-amber-500/10 text-amber-500 border-amber-500/25',
  shipped:           'bg-indigo-500/10 text-indigo-500 border-indigo-500/25',
  'in-transit':      'bg-primary/10 text-primary border-primary/25',
  delivered:         'bg-green-500/10 text-green-500 border-green-500/25',
  cancelled:         'bg-red-500/10 text-red-500 border-red-500/25',
};

const STATUS_DOT: Record<string, string> = {
  processing: 'bg-blue-500', 'customs-cleared': 'bg-amber-500',
  shipped: 'bg-indigo-500', 'in-transit': 'bg-primary',
  delivered: 'bg-green-500', cancelled: 'bg-red-500',
};

const STATUS_LABEL: Record<string, { en: string; fr: string }> = {
  processing:        { en: 'Processing',      fr: 'En traitement' },
  'customs-cleared': { en: 'Customs Cleared', fr: 'Dédouané' },
  shipped:           { en: 'Shipped',         fr: 'Expédié' },
  'in-transit':      { en: 'In Transit',      fr: 'En Transit' },
  delivered:         { en: 'Delivered',       fr: 'Livré' },
  cancelled:         { en: 'Cancelled',       fr: 'Annulé' },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function ScanAnimation({ label }: { label: string }) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-8 py-20"
    >
      {/* Orbit scanner */}
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-primary/40"
          animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.3, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-3 h-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        </div>
      </div>
      {/* Scanning dots */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.18 }}
            />
          ))}
        </div>
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

function ProgressStepper({ status, L }: { status: string; L: (t: { en: string; fr: string }) => string }) {
  const current = STEP_INDEX[status] ?? -1;
  const cancelled = status === 'cancelled';

  return (
    <div className="flex items-start gap-0 w-full mb-8 overflow-x-auto pb-1">
      {STEPS.map((step, i) => {
        const done = !cancelled && i < current;
        const active = !cancelled && i === current;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.key} className="flex items-center flex-1 min-w-0 last:flex-none">
            <div className="flex flex-col items-center flex-shrink-0">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22, delay: i * 0.07 }}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300',
                  done  ? 'bg-primary shadow-md shadow-primary/25' :
                  active ? 'bg-primary shadow-lg shadow-primary/30 ring-4 ring-primary/15' :
                           'bg-muted border border-border',
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ) : active ? (
                  <motion.span
                    className="w-2 h-2 rounded-full bg-white"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  />
                ) : (
                  <span className="text-[11px] font-bold text-muted-foreground">{i + 1}</span>
                )}
              </motion.div>
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wide mt-2 text-center whitespace-nowrap',
                active ? 'text-primary' : done ? 'text-foreground/60' : 'text-muted-foreground/40',
              )}>
                {L(step)}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 mt-[-18px] bg-border overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-primary rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: i < current ? 1 : 0 }}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TimelineRow({
  event, isFirst, isLast, index,
}: {
  event: any; isFirst: boolean; isLast: boolean; index: number;
}) {
  const { L } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 + index * 0.08 }}
      className="flex gap-4"
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 + index * 0.08 }}
          className={cn(
            'w-3 h-3 rounded-full mt-1 flex-shrink-0',
            isFirst
              ? cn('ring-4 ring-offset-1 ring-primary/25', STATUS_DOT[event.status] || 'bg-muted-foreground/40')
              : (STATUS_DOT[event.status] || 'bg-muted-foreground/30'),
          )}
        />
        {!isLast && (
          <div className="w-0.5 flex-1 my-1.5 bg-border overflow-hidden rounded-full">
            <motion.div
              className="w-full bg-primary/50 origin-top"
              style={{ height: '100%' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn('pb-5', isLast && 'pb-0')}>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className={cn(
            'text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border',
            STATUS_BADGE[event.status] || 'bg-muted text-muted-foreground border-border',
          )}>
            {L(STATUS_LABEL[event.status] || { en: event.status, fr: event.status })}
          </span>
          {isFirst && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-bold uppercase tracking-wide"
            >
              {L({ en: 'Latest', fr: 'Dernier' })}
            </motion.span>
          )}
        </div>
        <p className={cn('text-sm font-medium mb-1', isFirst ? 'text-foreground' : 'text-foreground/70')}>
          {event.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {format(new Date(event.date), 'dd MMM yyyy, HH:mm')}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {event.location}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

function TrackingContent() {
  const { L } = useLanguage();
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) { setTrackingNumber(id); doTrack(id); }
  }, []);

  async function doTrack(tn: string) {
    if (!tn.trim()) return;
    setIsLoading(true); setError(null); setOrder(null); setSearched(true);
    try {
      const result = await api.get<any>(`/api/orders/track?trackingNumber=${encodeURIComponent(tn.trim())}`);
      setOrder(result);
    } catch {
      setError(L({ en: 'Shipment Not Found', fr: 'Expédition Introuvable' }));
    } finally {
      setIsLoading(false);
    }
  }

  const events: any[] = order?.timeline ? [...order.timeline].reverse() : [];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative bg-sidebar overflow-hidden py-10 sm:py-14">
        {/* Ambient glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl pointer-events-none"
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="w-5 h-px bg-primary" />
            <span className="text-primary font-bold text-xs uppercase tracking-[0.3em]">
              {L({ en: 'Real-Time Tracking', fr: 'Suivi en Temps Réel' })}
            </span>
            <span className="w-5 h-px bg-primary" />
          </motion.div>

          {/* Heading — line-by-line clip reveal */}
          <h1 className="font-extrabold text-section text-sidebar-foreground [text-wrap:balance] mb-4">
            {[
              L({ en: 'Track Your', fr: 'Suivre Votre' }),
              L({ en: 'Shipment.', fr: 'Expédition.' }),
            ].map((line, li) => (
              <span key={li} className="block overflow-hidden leading-[1.08]">
                <motion.span
                  className="block"
                  initial={{ y: '108%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.1 + li * 0.13 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
            className="text-sidebar-foreground/60 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed"
          >
            {L({ en: 'Enter your tracking number for live cargo updates.', fr: 'Entrez votre numéro de suivi pour suivre votre cargaison.' })}
          </motion.p>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.52 }}
            onSubmit={(e) => { e.preventDefault(); doTrack(trackingNumber); }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40 pointer-events-none" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder={L({ en: 'LTIC2605001234', fr: 'LTIC2605001234' })}
                className="w-full h-14 pl-11 pr-4 bg-sidebar-accent border border-sidebar-border text-sidebar-foreground
                           placeholder:text-sidebar-foreground/30 rounded-full text-sm font-medium
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                           transition-all duration-200"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !trackingNumber.trim()}
              className="h-14 px-8 font-semibold text-base shadow-lg shadow-primary/25 flex-shrink-0"
            >
              {isLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : L({ en: 'Track', fr: 'Suivre' })}
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-sidebar-foreground/30 text-xs"
          >
            {L({ en: 'Example: LTIC2605001234', fr: 'Exemple : LTIC2605001234' })}
          </motion.p>
        </div>
      </section>

      {/* ── RESULTS ───────────────────────────────────────────────────────────── */}
      <section className="bg-background py-14 min-h-[50vh]">
        <div className="max-w-2xl mx-auto px-4">
          <AnimatePresence mode="wait">

            {/* Idle */}
            {!searched && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center justify-center py-20 gap-5 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Package className="h-7 w-7 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-semibold text-foreground/70 mb-1">
                    {L({ en: 'Ready to track', fr: 'Prêt à suivre' })}
                  </p>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {L({ en: 'Enter your tracking number above to see real-time shipment status.', fr: "Entrez votre numéro de suivi ci-dessus pour voir l'état en temps réel." })}
                  </p>
                </div>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/quote">
                    {L({ en: 'Request a Shipment', fr: 'Demander une Expédition' })}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}

            {/* Loading */}
            {searched && isLoading && (
              <ScanAnimation label={L({ en: 'Locating your shipment…', fr: 'Localisation de votre expédition…' })} />
            )}

            {/* Error */}
            {searched && error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                className="bg-card border border-destructive/20 rounded-2xl p-10 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="font-extrabold text-xl text-foreground mb-2">{error}</h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  {L({ en: 'Please double-check your tracking number and try again.', fr: 'Veuillez vérifier votre numéro de suivi et réessayer.' })}
                </p>
              </motion.div>
            )}

            {/* Result */}
            {searched && order && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Status header bar */}
                <div className="bg-sidebar px-6 py-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono font-bold text-sidebar-foreground text-sm tracking-wider">
                    {order.trackingNumber}
                  </span>
                  <span className={cn(
                    'text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border',
                    STATUS_BADGE[order.status] || 'bg-muted text-muted-foreground border-border',
                  )}>
                    {L(STATUS_LABEL[order.status] || { en: order.status, fr: order.status })}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                  {/* Progress stepper */}
                  {order.status !== 'cancelled' && (
                    <ProgressStepper status={order.status} L={L} />
                  )}

                  {/* Info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    {([
                      { label: { en: 'Client',             fr: 'Client'          }, value: order.clientName },
                      { label: { en: 'Origin',             fr: 'Origine'         }, value: order.origin },
                      { label: { en: 'Destination',        fr: 'Destination'     }, value: order.destination },
                      { label: { en: 'Estimated Delivery', fr: 'Livraison Est.'  }, value: order.estimatedDelivery },
                      { label: { en: 'Description',        fr: 'Description'     }, value: order.description },
                    ] as { label: { en: string; fr: string }; value: string }[])
                      .filter((f) => f.value)
                      .map(({ label, value }, i) => (
                        <motion.div
                          key={label.en}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.06, duration: 0.35 }}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                            {L(label)}
                          </p>
                          <p className="font-semibold text-sm text-foreground">{value}</p>
                        </motion.div>
                      ))}
                  </div>

                  {/* Timeline */}
                  {events.length > 0 && (
                    <div className="border-t border-border pt-7">
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6"
                      >
                        {L({ en: 'Shipment Timeline', fr: "Chronologie de l'Expédition" })}
                      </motion.h3>
                      <div className="space-y-0">
                        {events.map((event, idx) => (
                          <TimelineRow
                            key={idx}
                            event={event}
                            isFirst={idx === 0}
                            isLast={idx === events.length - 1}
                            index={idx}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

export default function TrackingPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  );
}
