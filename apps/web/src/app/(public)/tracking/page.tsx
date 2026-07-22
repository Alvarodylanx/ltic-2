'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Package, AlertCircle, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { fadeInUp, scaleIn, stagger } from '@/components/motion/variants';
import { Suspense } from 'react';

const statusColors: Record<string, string> = {
  processing:        'bg-blue-50 text-blue-700 border-blue-200',
  'customs-cleared': 'bg-amber-50 text-amber-700 border-amber-200',
  shipped:           'bg-indigo-50 text-indigo-700 border-indigo-200',
  'in-transit':      'bg-violet-50 text-violet-700 border-violet-200',
  delivered:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled:         'bg-red-50 text-red-700 border-red-200',
};

const statusDot: Record<string, string> = {
  processing:        'bg-blue-500',
  'customs-cleared': 'bg-amber-500',
  shipped:           'bg-indigo-500',
  'in-transit':      'bg-violet-500',
  delivered:         'bg-emerald-500',
  cancelled:         'bg-red-500',
};

const statusLabels: Record<string, { en: string; fr: string }> = {
  processing:        { en: 'Processing',      fr: 'En traitement' },
  'customs-cleared': { en: 'Customs Cleared', fr: 'Dédouané' },
  shipped:           { en: 'Shipped',         fr: 'Expédié' },
  'in-transit':      { en: 'In Transit',      fr: 'En Transit' },
  delivered:         { en: 'Delivered',       fr: 'Livré' },
  cancelled:         { en: 'Cancelled',       fr: 'Annulé' },
};

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
    if (id) {
      setTrackingNumber(id);
      doTrack(id);
    }
  }, []);

  async function doTrack(tn: string) {
    if (!tn.trim()) return;
    setIsLoading(true);
    setError(null);
    setOrder(null);
    setSearched(true);
    try {
      const result = await api.get<any>(`/api/orders/track?trackingNumber=${encodeURIComponent(tn.trim())}`);
      setOrder(result);
    } catch {
      setError(L({ en: 'Shipment Not Found', fr: 'Expédition Introuvable' }));
    } finally {
      setIsLoading(false);
    }
  }

  const handleTrack = (e: React.FormEvent) => { e.preventDefault(); doTrack(trackingNumber); };

  return (
    <>
      {/* ── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 text-center">
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="flex flex-col items-center">
            <motion.div variants={fadeInUp} className="w-10 h-0.5 bg-primary mx-auto mb-8" />
            <motion.p variants={fadeInUp}
              className="text-primary font-display font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {L({ en: 'Real-Time Tracking', fr: 'Suivi en Temps Réel' })}
            </motion.p>
            <motion.h1 variants={fadeInUp}
              className="font-display font-extrabold text-section text-foreground leading-none mb-4">
              {L({ en: 'Track Your\nShipment', fr: 'Suivez\nVotre Cargaison' })}
            </motion.h1>
            <motion.p variants={fadeInUp}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-md">
              {L({ en: 'Enter your tracking number to get real-time updates on your cargo.', fr: 'Entrez votre numéro de suivi pour obtenir des mises à jour en temps réel sur votre cargaison.' })}
            </motion.p>

            {/* Search form */}
            <motion.form variants={fadeInUp} onSubmit={handleTrack}
              className="w-full max-w-xl flex border border-border">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder={L({ en: 'e.g. LTIC2605001234', fr: 'ex: LTIC2605001234' })}
                  className="pl-11 h-12 border-0 border-r border-border rounded-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0" />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !trackingNumber.trim()}
                className="h-12 px-6 rounded-none font-display font-bold text-sm uppercase tracking-[0.15em] flex-shrink-0">
                {isLoading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : (
                    <>
                      {L({ en: 'Track', fr: 'Suivre' })}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────────────────────────────── */}
      <section className="bg-background py-12 min-h-[40vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">

            {/* Idle state */}
            {!searched && (
              <motion.div key="idle" variants={fadeInUp} initial="hidden" animate="show"
                exit={{ opacity: 0, y: -12 }}
                className="flex flex-col items-center justify-center py-20 gap-5 text-center">
                <div className="w-16 h-16 border border-border flex items-center justify-center">
                  <Package className="h-7 w-7 text-muted-foreground/30" />
                </div>
                <p className="text-muted-foreground text-sm max-w-xs">
                  {L({ en: 'Enter your tracking number above to see shipment status and timeline.', fr: "Entrez votre numéro de suivi ci-dessus pour voir l'état et la chronologie de l'expédition." })}
                </p>
              </motion.div>
            )}

            {/* Loading */}
            {searched && isLoading && (
              <motion.div key="loading" variants={fadeInUp} initial="hidden" animate="show"
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground text-sm">
                  {L({ en: 'Locating your shipment…', fr: 'Localisation de votre expédition…' })}
                </p>
              </motion.div>
            )}

            {/* Error */}
            {searched && error && !isLoading && (
              <motion.div key="error" variants={scaleIn} initial="hidden" animate="show"
                className="border border-destructive/30 p-8 text-center">
                <div className="w-12 h-12 border border-destructive/30 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <h2 className="font-display font-extrabold text-lg text-destructive mb-2">{error}</h2>
                <p className="text-muted-foreground text-sm">
                  {L({ en: 'The tracking number you entered was not found. Please check and try again.', fr: "Le numéro de suivi entré est introuvable. Veuillez vérifier et réessayer." })}
                </p>
              </motion.div>
            )}

            {/* Result */}
            {searched && order && !isLoading && (
              <motion.div key="result" variants={stagger} initial="hidden" animate="show"
                className="space-y-6">

                {/* Header card */}
                <motion.div variants={scaleIn} className="border border-border">
                  <div className="border-b border-border px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="font-mono font-bold text-sm tracking-wider">
                        {order.trackingNumber}
                      </span>
                    </div>
                    <span className={`text-xs font-display font-bold uppercase tracking-[0.15em] px-3 py-1.5 border ${statusColors[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {L(statusLabels[order.status] || { en: order.status, fr: order.status })}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
                    {[
                      { label: { en: 'Client Name',       fr: 'Nom du Client'      }, value: order.clientName },
                      { label: { en: 'Origin',            fr: 'Origine'            }, value: order.origin },
                      { label: { en: 'Destination',       fr: 'Destination'        }, value: order.destination },
                      { label: { en: 'Description',       fr: 'Description'        }, value: order.description },
                      { label: { en: 'Estimated Delivery',fr: 'Livraison Estimée'  }, value: order.estimatedDelivery },
                    ].filter((item) => item.value).map(({ label, value }) => (
                      <div key={label.en} className="bg-background p-5">
                        <p className="text-muted-foreground text-xs font-display font-bold uppercase tracking-[0.15em] mb-1.5">
                          {L(label)}
                        </p>
                        <p className="font-medium text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Timeline */}
                {order.timeline && order.timeline.length > 0 && (
                  <motion.div variants={fadeInUp} className="border border-border">
                    <div className="border-b border-border px-6 py-4">
                      <p className="font-display font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {L({ en: 'Shipment Timeline', fr: "Chronologie de l'Expédition" })}
                      </p>
                    </div>
                    <div className="divide-y divide-border">
                      {[...(order.timeline as any[])].reverse().map((event: any, idx: number) => (
                        <motion.div key={idx} variants={fadeInUp}
                          className={`flex gap-4 px-6 py-5 ${idx === 0 ? 'bg-primary/[0.03]' : ''}`}>
                          <div className="flex flex-col items-center flex-shrink-0 pt-1">
                            <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-background ${
                              idx === 0
                                ? `${statusDot[event.status] || 'bg-primary'} ring-primary/15`
                                : 'bg-muted-foreground/25'
                            }`} />
                            {idx < order.timeline.length - 1 && (
                              <div className="w-px flex-1 bg-border mt-2 min-h-[20px]" />
                            )}
                          </div>
                          <div className="pb-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className={`text-xs font-display font-bold uppercase tracking-[0.1em] px-2 py-0.5 border ${statusColors[event.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                {L(statusLabels[event.status] || { en: event.status, fr: event.status })}
                              </span>
                              {idx === 0 && (
                                <span className="text-xs bg-primary text-primary-foreground font-display font-bold uppercase tracking-[0.1em] px-2 py-0.5">
                                  {L({ en: 'Latest', fr: 'Récent' })}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium mb-1.5">{event.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                      ))}
                    </div>
                  </motion.div>
                )}
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
